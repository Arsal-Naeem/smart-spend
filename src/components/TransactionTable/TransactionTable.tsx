"use client";
import React, { useEffect, useState } from "react";
import { Table, Segmented, Tag, Card, Skeleton } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import styles from "./TransactionTable.module.css";
import DeleteTransactionButton from "../Modals/DeleteTransactionModal/DeleteTransactionModal";
import TransactionModal from "../Modals/TransactionModal/TransactionModal";
import EmptyState from "../EmptyState/EmptyState";
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

const TransactionsTable = () => {
  const [filter, setFilter] = useState<"All" | "Income" | "Expense">("All");
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);

  const fetchTransactions = async () => {
    try {
      let url = "/api/transactions";

      if (filter !== "All") {
        url += `?type=${filter.toLowerCase()}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }
      const data = await response.json();
      setTransactions(data);
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
  }, [filter]);

  const handleFilterChange = (value: "All" | "Income" | "Expense") => {
    setFilter(value);
  };

  const columns: ColumnsType<TransactionData> = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date: string) => dayjs(date).format("hh:mm A, DD/MM/YYYY"),
      width: 200,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      align: "center",
      width: 100,
      render: (type: "income" | "expense") => (
        <Tag
          icon={type === "income" ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
          style={{
            backgroundColor: type === "income" ? "#cdf345" : "#f34545",
            color: "#000",
            border: `1px solid ${type === "income" ? "#181c08" : "#240a0a"}`,
            padding: "4px 10px 4px 8px",
            borderRadius: 100,
            textTransform: "uppercase",
          }}
        >
          <span className={styles.typeText}>{type}</span>
        </Tag>
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      align: "center",
      render: (amount: number, record: TransactionData) => (
        <span
          style={{
            color:
              record.type.toLowerCase() === "expense" ? "#ff4d4f" : "#52c41a",
            fontWeight: 500,
          }}
        >
          Rs.{amount.toFixed(2)}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      align: "center",
      render: (_, record) => (
        <div>
          <TransactionModal
            isEdit
            record={record}
            onClose={fetchTransactions}
          />
          <DeleteTransactionButton
            record={record}
            onClose={fetchTransactions}
          />
        </div>
      ),
    },
  ];

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
        <h2 style={{ textAlign: "center" }}>Transaction History</h2>
      </div>
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

export default TransactionsTable;
