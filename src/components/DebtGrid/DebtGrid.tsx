"use client";
import React, { useState, useEffect } from "react";
import DebtCard from "../DebtCard/DebtCard";
import { Segmented, message } from "antd";
import LoadingSkeleton from "../HelperComponents/LoadingSkeleton";
import NoTransactions from "../HelperComponents/NoTransactions";

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

const DebtGrid: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [filter, setFilter] = useState<"Debt" | "Credit" | "History">("Debt");

  const fetchDebts = async () => {
    try {
      setLoading(true);
      let url = "/api/debts?";

      if (filter === "Debt") {
        url += "debtType=taken&status=active";
      } else if (filter === "Credit") {
        url += "debtType=given&status=active";
      } else if (filter === "History") {
        url += "status=completed";
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch debts");
      }

      const data = await response.json();
      setDebts(data.debts);
    } catch (error) {
      console.error("Error fetching debts:", error);
      message.error("Failed to load debts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDebts();
  }, [filter]);

  const handleFilterChange = (value: "Debt" | "Credit" | "History") => {
    setFilter(value);
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
        ) : debts.length === 0 ? (
          <NoTransactions />
        ) : (
          <>
            {debts.map((debt, index) => (
              <DebtCard
                key={debt._id}
                _id={debt._id}
                title={debt.title}
                totalAmount={debt.totalAmount}
                amountPaid={debt.amountPaid}
                amountRemaining={debt.amountRemaining}
                date={debt.date}
                debtType={debt.debtType}
                transactions={debt.transactions}
                onRefresh={fetchDebts}
              />
            ))}
          </>
        )}
      </div>
    </>
  );
};

export default DebtGrid;
