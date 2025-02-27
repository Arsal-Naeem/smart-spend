"use client";
import { Card, Skeleton } from "antd";
import { useEffect, useState } from "react";
import RecentTransactionCard from "./RecentTransactionCard";

interface TransactionData {
  _id: string;
  date: string;
  type: "income" | "expense";
  title: string;
  amount: number;
  category: string;
  notes?: string;
}

const RecentTransaction = () => {
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/transactions?page=1&pageSize=7");
      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }
      const data = await response.json();
      setTransactions(data.transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const LoadingSkeleton = () => (
    <Card size="small" style={{ width: "100%" }} bordered={false}>
      <Skeleton active paragraph={{ rows: 1 }} />
    </Card>
  );

  return (
    <div style={{ padding: 16 }}>
      <div
        style={{
          padding: "0px 16px 16px 16px ",
          color: "var(--color-accent)",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Recent Transactions</h2>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {loading ? (
          <>
            <LoadingSkeleton />
            <LoadingSkeleton />
            <LoadingSkeleton />
            <LoadingSkeleton />
          </>
        ) : (
          transactions.map((transaction) => (
            <RecentTransactionCard
              key={transaction._id}
              _id={transaction._id}
              title={transaction.title}
              date={transaction.date}
              type={transaction.type}
              amount={transaction.amount}
              category={transaction.category}
              notes={transaction.notes}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default RecentTransaction;
