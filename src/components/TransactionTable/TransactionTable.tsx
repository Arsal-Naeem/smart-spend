"use client";
import React, { useEffect, useState } from "react";
import { Segmented, Card, Skeleton, Pagination } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import TransactionModal from "../Modals/TransactionModal/TransactionModal";
import RecentTransactionCard from "../RecentTransaction/RecentTransactionCard";

dayjs.extend(customParseFormat);

interface TransactionData {
  _id: string;
  date: string;
  type: "income" | "expense";
  title: string;
  amount: number;
  category: string;
  notes?: string;
}

interface PaginationState {
  current: number;
  pageSize: number;
  total: number;
}

const TransactionsTable = () => {
  const [filter, setFilter] = useState<"All" | "Income" | "Expense">("All");
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);

  const [pagination, setPagination] = useState<PaginationState>({
    current: 1,
    pageSize: 10,
    total: 10
  });

  const fetchTransactions = async () => {
    try {
      let url = `/api/transactions?page=${pagination.current}&pageSize=${pagination.pageSize}`;

      if (filter !== "All") {
        url += `&type=${filter.toLowerCase()}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }
      const data = await response.json();
      setTransactions(data.transactions);
      setPagination(prev => ({
        ...prev,
        total: data.pagination.total
      }));
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      fetchTransactions();
    }, 1);

    return () => clearTimeout(timer);
  }, [filter, pagination.current, pagination.pageSize]);

  const handleFilterChange = (value: "All" | "Income" | "Expense") => {
    setFilter(value);
  };

  const handlePageChange = (page: number, pageSize?: number) => {
    setPagination(prev => ({
      ...prev,
      current: page,
      pageSize: pageSize || prev.pageSize
    }));
  };

  const LoadingSkeleton = () => (
    <Card size="small" style={{ width: "100%" }} bordered={false}>
      <Skeleton active paragraph={{ rows: 1 }} />
    </Card>
  );

  return (
    <div style={{ padding: 16 }}>
      <Segmented
        options={["All", "Income", "Expense"]}
        value={filter}
        onChange={handleFilterChange}
        style={{ marginBottom: 16 }}
        block
      />
      <TransactionModal onClose={fetchTransactions} />
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {loading ? (
          <>
            <LoadingSkeleton />
            <LoadingSkeleton />
            <LoadingSkeleton />
            <LoadingSkeleton />
          </>
        ) : (
          <>
            {transactions.map((transaction) => (
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
            ))}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
              <Pagination
                current={pagination.current}
                total={pagination.total}
                pageSize={pagination.pageSize}
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionsTable;
