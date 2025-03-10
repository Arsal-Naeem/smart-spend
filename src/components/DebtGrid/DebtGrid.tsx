"use client";
import React, { useState } from "react";
import DebtCard from "../DebtCard/DebtCard";
import { Segmented } from "antd";
import LoadingSkeleton from "../HelperComponents/LoadingSkeleton";

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
  transactions: DebtTransaction[];
}

const debts: Debt[] = [
  {
    _id: "5",
    title: "Arham Javed",
    totalAmount: 200,
    amountPaid: 0,
    amountRemaining: 200,
    date: "2025-02-27T20:47:00.000Z",
    debtType: "taken",
    transactions: [{
      _id: "t3",
      type: "add",
      amount: 200,
      date: "2025-03-01T14:20:00.000Z",
      reason: "T2K registration",
    },],
  },
  {
    _id: "5",
    title: "Rafay Khan",
    totalAmount: 200,
    amountPaid: 0,
    amountRemaining: 200,
    date: "2025-02-27T20:47:00.000Z",
    debtType: "given",
    transactions: [{
      _id: "t3",
      type: "add",
      amount: 200,
      date: "2025-03-01T14:20:00.000Z",
      reason: "T2K registration",
    },],
  },
  {
    _id: "5",
    title: "Shahryar Khan",
    totalAmount: 200,
    amountPaid: 0,
    amountRemaining: 200,
    date: "2025-02-27T20:47:00.000Z",
    debtType: "given",
    transactions: [{
      _id: "t3",
      type: "add",
      amount: 200,
      date: "2025-03-01T14:20:00.000Z",
      reason: "T2K registration",
    },],
  },
  {
    _id: "1",
    title: "Wasay Baboo",
    totalAmount: 1130,
    amountPaid: 150,
    amountRemaining: 980,
    date: "2025-02-27T20:47:00.000Z",
    debtType: "given",
    transactions: [
      {
        _id: "t1",
        type: "add",
        amount: 290,
        date: "2025-03-03T07:00:00.000Z",
        reason: "Pizza Spice",
      },
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
    totalAmount: 1560,
    amountPaid: 0,
    amountRemaining: 1560,
    date: "2025-02-27T20:47:00.000Z",
    debtType: "given",
    transactions: [
      {
        _id: "t1",
        type: "add",
        amount: 200,
        date: "2025-02-28T12:00:00.000Z",
        reason: "Kumail's T2K Academy registration",
      },
      {
        _id: "t1",
        type: "add",
        amount: 400,
        date: "2025-02-28T12:00:00.000Z",
        reason: "Gaming Zone + Pizza",
      },
      {
        _id: "t2",
        type: "add",
        amount: 560,
        date: "2025-03-28T12:00:00.000Z",
        reason: "Pizza Spice",
      },
      {
        _id: "t3",
        type: "add",
        amount: 400,
        date: "2025-03-01T14:20:00.000Z",
        reason: "Kumail + Hasnain's T2K registration",
      },
    ],
  },
  {
    _id: "3",
    title: "Syed Shayan",
    totalAmount: 14260,
    amountPaid: 10000,
    amountRemaining: 4360,
    date: "2025-02-27T20:47:00.000Z",
    debtType: "given",
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
    transactions: [{
      _id: "t3",
      type: "add",
      amount: 1500,
      date: "2025-03-01T14:20:00.000Z",
      reason: "Hosting fees",
    },],
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
            <LoadingSkeleton type="debt" quantity={3} />
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
