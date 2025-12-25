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
    title: "Shahryar Khan",
    totalAmount: 8863,
    amountPaid: 8590,
    amountRemaining: 273,
    date: "2025-02-27T20:47:00.000Z",
    debtType: "given",
    transactions: [
      {
        _id: "t3",
        type: "add",
        amount: 8000,
        date: "2025-03-01T14:20:00.000Z",
        reason: "adan fees debt clearence",
      },
      {
        _id: "t3",
        type: "return",
        amount: 60,
        date: "2025-03-01T14:20:00.000Z",
        reason: "Tea",
      },
      {
        _id: "t3",
        type: "return",
        amount: 270,
        date: "2025-03-01T14:20:00.000Z",
        reason: "Damthal Fries",
      },
      {
        _id: "t3",
        type: "add",
        amount: 300,
        date: "2025-03-01T14:20:00.000Z",
        reason: "T2K academy Zone",
      },
      {
        _id: "t3",
        type: "return",
        amount: 8260,
        date: "2025-03-01T14:20:00.000Z",
        reason: "Anda tea clearance + adan fees",
      },
      {
        _id: "t3",
        type: "add",
        amount: 230,
        date: "2025-03-01T14:20:00.000Z",
        reason: "Anda Burger and Tea",
      },
      {
        _id: "t3",
        type: "add",
        amount: 133,
        date: "2025-03-01T14:20:00.000Z",
        reason: "T2K Academy registration",
      },
      {
        _id: "t3",
        type: "add",
        amount: 200,
        date: "2025-03-01T14:20:00.000Z",
        reason: "T2K registration",
      },
    ],
  },
  {
    _id: "1",
    title: "Wasay Baboo",
    totalAmount: 1490,
    amountPaid: 150,
    amountRemaining: 1340,
    date: "2025-02-27T20:47:00.000Z",
    debtType: "given",
    transactions: [
      {
        _id: "t1",
        type: "add",
        amount: 300,
        date: "2025-03-03T07:00:00.000Z",
        reason: "Iftaar + Tea",
      },
      {
        _id: "t1",
        type: "add",
        amount: 60,
        date: "2025-03-03T07:00:00.000Z",
        reason: "Tea",
      },
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
    totalAmount: 1800,
    amountPaid: 100,
    amountRemaining: 1700,
    date: "2025-02-27T20:47:00.000Z",
    debtType: "given",
    transactions: [
      {
        _id: "t1",
        type: "add",
        amount: 150,
        date: "2025-02-28T12:00:00.000Z",
        reason: "Iftaar + tea",
      },
      {
        _id: "t1",
        type: "add",
        amount: 90,
        date: "2025-02-28T12:00:00.000Z",
        reason: "Damthal Fries",
      },
      {
        _id: "t1",
        type: "return",
        amount: 100,
        date: "2025-02-28T12:00:00.000Z",
        reason: "Fries + Tea",
      },
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
    totalAmount: 15000,
    amountPaid: 15000,
    amountRemaining: 0,
    date: "2025-02-27T20:47:00.000Z",
    debtType: "given",
    transactions: [
      {
        _id: "t3",
        type: "add",
        amount: 115,
        date: "2025-03-14T08:02:30+05:00",
        reason: "T2K registration",
      },
      {
        _id: "t3",
        type: "return",
        amount: 4500,
        date: "2025-03-14T08:02:30+05:00",
        reason: "T2K registration",
      },
      {
        _id: "t3",
        type: "add",
        amount: 140,
        date: "2025-03-14T08:02:30+05:00",
        reason: "T2K registration",
      },
      {
        _id: "t3",
        type: "return",
        amount: 10000,
        date: "2025-03-14T08:02:30+05:00",
      },
      {
        _id: "t3",
        type: "add",
        amount: 560,
        date: "2025-03-14T08:02:30+05:00",
        reason: "Pizza Spice",
      },
      {
        _id: "t3",
        type: "add",
        amount: 9500,
        date: "2025-03-14T08:02:30+05:00",
        reason: "Phone Repair Bill",
      },
      {
        _id: "t3",
        type: "add",
        amount: 3200,
        date: "2025-03-14T08:02:30+05:00",
        reason: "IBA debt clearence of AR",
      },
      {
        _id: "t3",
        type: "add",
        amount: 150,
        date: "2025-03-14T08:02:30+05:00",
        reason: "chicken roll at DPA",
      },
      {
        _id: "t3",
        type: "add",
        amount: 100,
        date: "2025-03-14T08:02:30+05:00",
        reason: "Petrol",
      },
      {
        _id: "t3",
        type: "add",
        amount: 325,
        date: "2025-03-14T08:02:30+05:00",
        reason: "Arsal's Shawarma after MAJU tourney",
      },
      {
        _id: "t3",
        type: "add",
        amount: 150,
        date: "2025-03-14T08:02:30+05:00",
        reason: "Gaming Zone before MAJU tournee",
        
      },
      {
        _id: "t3",
        type: "add",
        amount: 110,
        date: "2025-03-14T08:02:30+05:00",
        reason: "food of Game Night at Haz",
      },
      {
        _id: "t3",
        type: "add",
        amount: 150,
        date: "2025-03-14T08:02:30+05:00",
        reason: "Gaming Zone at Haz",
      },
    ],
  },
  {
    _id: "5",
    title: "Uzair Bhai",
    totalAmount: 3000,
    amountPaid: 0,
    amountRemaining: 3000,
    date: "2025-02-27T20:47:00.000Z",
    debtType: "given",
    transactions: [
      {
        _id: "t3",
        type: "add",
        amount: 1500,
        date: "2025-03-01T14:20:00.000Z",
        reason: "Hosting fees",
      },
      {
        _id: "t3",
        type: "add",
        amount: 1500,
        date: "2025-03-01T14:20:00.000Z",
        reason: "Hosting fees",
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
