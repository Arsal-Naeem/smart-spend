"use client";
import React, { useState } from "react";
import { Table, Segmented, Tag } from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import styles from "./TransactionTable.module.css";
import DeleteTransactionButton from "../Modals/DeleteTransactionModal/DeleteTransactionModal";
import TransactionModal from "../Modals/TransactionModal/TransactionModal";

dayjs.extend(customParseFormat);

interface TransactionData {
  key: string;
  date: string;
  type: "Income" | "Expense";
  title: string;
  amount: number;
  category: string;
  notes?: string;
}

const TransactionsTable = () => {
  const [filter, setFilter] = useState<string | number>("All");

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
      render: (type: "Income" | "Expense") => (
        <Tag
          icon={type === "Income" ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
          style={{
            backgroundColor: type === "Income" ? "#cdf345" : "#f34545",
            color: "#000",
            border: `1px solid ${type === "Income" ? "#181c08" : "#240a0a"}`,
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
          ${amount.toFixed(2)}
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
          <TransactionModal isEdit record={record} />
          <DeleteTransactionButton record={record} onDelete={handleDelete} />
        </div>
      ),
    },
  ];

  const handleDelete = (record: TransactionData) => {
    console.log("Delete:", record);
  };

  const dummyData: TransactionData[] = [
    {
      key: "1",
      date: "2025-02-08T12:00:00Z",
      type: "Income",
      title: "Salary",
      amount: 5000.0,
      category: "Employment",
      notes: "Monthly salary payment",
    },
    {
      key: "2",
      date: "2025-02-07T15:30:00Z",
      type: "Expense",
      title: "Groceries",
      amount: 150.5,
      category: "Food & Supplies",
      notes: "Weekly grocery shopping at Walmart",
    },
    {
      key: "3",
      date: "2025-02-06T08:45:00Z",
      type: "Expense",
      title: "Internet Bill",
      amount: 79.99,
      category: "Utilities",
      notes: "Monthly internet subscription",
    },
    {
      key: "4",
      date: "2025-02-05T19:20:00Z",
      type: "Income",
      title: "Freelance Work",
      amount: 1200.0,
      category: "Side Business",
      notes: "Website development project",
    },
    {
      key: "5",
      date: "2025-02-04T21:15:00Z",
      type: "Expense",
      title: "Restaurant",
      amount: 45.75,
      category: "Dining Out",
      notes: "Dinner with family",
    },
  ];

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
        onChange={setFilter}
        style={{ marginBottom: 16 }}
        block
      />
      <Table<TransactionData>
        columns={columns}
        dataSource={dummyData}
        pagination={
          dummyData.length > 10
            ? {
                pageSize: 10,
                position: ["bottomCenter"],
              }
            : false
        }
        scroll={{ x: true }}
      />
    </div>
  );
};

export default TransactionsTable;
