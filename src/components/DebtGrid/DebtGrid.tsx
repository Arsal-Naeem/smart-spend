"use client";
import React, { useState } from "react";
import DebtCard from "../DebtCard/DebtCard";
import { Card, Segmented, Skeleton } from "antd";

interface Debt {
  title: string;
  totalAmount: number;
  amountPaid: number;
  amountRemaining: number;
  debtType: "given" | "taken";
  date: string;
  notes: string;
}

const debts: Debt[] = [
  {
    title: "Wasay Baboo",
    totalAmount: 25000,
    amountPaid: 25000,
    amountRemaining: 0,
    date: "2025-02-21",
    debtType: "given",
    notes: "Monthly payment of $500",
  },
  {
    title: "Hasnain Ziaidi",
    totalAmount: 5000,
    amountPaid: 2000,
    amountRemaining: 3000,
    date: "2025-02-15",
    debtType: "given",
    notes: "Need to pay minimum by end of month",
  },
  {
    title: "Shayan",
    totalAmount: 10000,
    amountPaid: 4000,
    amountRemaining: 6000,
    date: "2025-01-30",
    debtType: "taken",
    notes: "Emergency loan",
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
                title={debt.title}
                totalAmount={debt.totalAmount}
                amountPaid={debt.amountPaid}
                amountRemaining={debt.amountRemaining}
                date={debt.date}
                debtType={debt.debtType}
                notes={debt.notes}
              />
            ))}
          </>
        )}
      </div>
    </>
  );
};

export default DebtGrid;
