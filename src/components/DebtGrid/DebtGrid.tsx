"use client";
import React, { useState } from "react";
import DebtCard from "../DebtCard/DebtCard";
import { Card, Segmented, Skeleton } from "antd";

interface DebtTransaction {
  _id: string;
  type: "return" | "add";
  amount: number;
  date: string;
  reason?: string;
  category?: string;
}

interface Debt {
  _id: string;
  title: string;
  totalAmount: number;
  amountPaid: number;
  amountRemaining: number;
  debtType: "given" | "taken";
  date: string;
  notes: string;
  transactions: DebtTransaction[];
}

const debts: Debt[] = [
  {
    _id: "1",
    title: "Wasay Baboo",
    totalAmount: 840,
    amountPaid: 150,
    amountRemaining: 690,
    date: "2025-02-27T20:47:00.000Z",
    debtType: "given",
    notes: "Monthly payment of $500",
    transactions: [
      {
        _id: "t1",
        type: "add",
        amount: 80,
        date: "2025-03-03T07:00:00.000Z",
        reason: "chai",
      },
      {
        _id: "t1",
        type: "add",
        amount: 200,
        date: "2025-03-02T07:00:00.000Z",
        reason: "T2K Academy",
      },
      {
        _id: "t1",
        type: "return",
        amount: 150,
        date: "2025-03-01T07:00:00.000Z",
        reason: "Gaming Zone",
      },
      {
        _id: "t1",
        type: "add",
        amount: 560,
        date: "2025-02-26T21:00:00.000Z",
        reason: "Pizza/Burger",
      },
    ],
  },
  {
    _id: "2",
    title: "Hasnain Ziaidi",
    totalAmount: 1060,
    amountPaid: 100,
    amountRemaining: 960,
    date: "2025-02-27T20:47:00.000Z",
    debtType: "given",
    notes: "Monthly payment of $500",
    transactions: [
      {
        _id: "t1",
        type: "add",
        amount: 100,
        date: "2025-02-28T12:00:00.000Z",
      },
      {
        _id: "t2",
        type: "add",
        amount: 560,
        date: "2025-03-28T12:00:00.000Z",
      },
      {
        _id: "t3",
        type: "add",
        amount: 400,
        date: "2025-03-01T14:20:00.000Z",
      },
      {
        _id: "t3",
        type: "return",
        amount: 100,
        date: "2025-03-10T14:20:00.000Z",
      },
    ],
  },
  {
    _id: "3",
    title: "Syed Shayan",
    totalAmount: 4160,
    amountPaid: 0,
    amountRemaining: 14160,
    date: "2025-02-27T20:47:00.000Z",
    debtType: "given",
    notes: "Monthly payment of $500",
    transactions: [],
  },
  {
    _id: "4",
    title: "Abbu",
    totalAmount: 5000,
    amountPaid: 0,
    amountRemaining: 5000,
    date: "2025-02-27T20:47:00.000Z",
    debtType: "given",
    notes: "Monthly payment of $500",
    transactions: [],
  },
  {
    _id: "5",
    title: "Uzair Bhai",
    totalAmount: 1500,
    amountPaid: 0,
    amountRemaining: 1500,
    date: "2025-02-27T20:47:00.000Z",
    debtType: "given",
    notes: "Monthly payment of $500",
    transactions: [],
  },
  {
    _id: "6",
    title: "Shahryar Khan",
    totalAmount: 5000,
    amountPaid: 0,
    amountRemaining: 5000,
    date: "2025-03-01T20:47:00.000Z",
    debtType: "taken",
    notes: "Monthly payment of $500",
    transactions: [
      {
        _id: "t3",
        type: "add",
        amount: 260,
        date: "2025-03-01T14:20:00.000Z",
      },
      {
        _id: "t3",
        type: "add",
        amount: 280,
        date: "2025-03-10T14:20:00.000Z",
      },
    ],
  },
];

const DebtGrid: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"Debt" | "Credit" | "History">("Debt");

  const handleFilterChange = (value: "Debt" | "Credit" | "History") => {
    setLoading(true);
    setFilter(value);

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const LoadingSkeleton = () => (
    <Card style={{ width: 400 }} bordered={false}>
      <Skeleton active paragraph={{ rows: 5 }} />
    </Card>
  );
  return (
    <>
      <Segmented
        options={["Debt", "Credit", "History"]}
        value={filter}
        onChange={handleFilterChange}
        style={{ margin: "0 16px 16px 16px" }}
        block
      />

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          padding: "12px 24px 24px 24px",
          justifyContent: "center",
          alignItems: "stretch",
          width: "100%",
        }}
      >
        {loading ? (
          <>
            <LoadingSkeleton />
            <LoadingSkeleton />
            <LoadingSkeleton />
          </>
        ) : (
          <>
            {debts.map((debt, index) => (
              <DebtCard
                key={index}
                _id={debt._id}
                title={debt.title}
                totalAmount={debt.totalAmount}
                amountPaid={debt.amountPaid}
                amountRemaining={debt.amountRemaining}
                date={debt.date}
                debtType={debt.debtType}
                notes={debt.notes}
                transactions={debt.transactions}
              />
            ))}
          </>
        )}
      </div>
    </>
  );
};

export default DebtGrid;
