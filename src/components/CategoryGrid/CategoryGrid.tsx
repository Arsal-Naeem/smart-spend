"use client";
import { useState } from "react";
import CategoryCard from "../CategoryCard/CategoryCard";
import CategoryModal from "../Modals/CategoryModal/CategoryModal";
import { Card, Skeleton } from "antd";

// Dummy data for categories
const categories = [
  {
    categoryName: "Shopping",
    totalSpend: 450.75,
    budget: 600,
    color: "#ff9d00",
    transactionCount: 8,
  },
  {
    categoryName: "Housing",
    totalSpend: 1200,
    budget: 1500,
    color: "#00ff22",
    transactionCount: 2,
  },
  {
    categoryName: "Transportation",
    totalSpend: 250.5,
    budget: 300,
    color: "#0063f9",
    transactionCount: 5,
  },
  {
    categoryName: "Healthcare",
    totalSpend: 500,
    budget: 400,
    color: "#f5e1c0",
    transactionCount: 3,
  },
];

const CategoryGrid = () => {
  const [loading, setLoading] = useState(false);

  const LoadingSkeleton = () => (
    <Card style={{ width: 300 }} bordered={false}>
      <Skeleton active paragraph={{ rows: 5 }} />
    </Card>
  );
  return (
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
          <LoadingSkeleton />
          <LoadingSkeleton />
        </>
      ) : (
        <>
          {categories.map((category, index) => (
            <CategoryCard
              key={index}
              categoryName={category.categoryName}
              totalSpend={category.totalSpend}
              budget={category.budget}
              transactionCount={category.transactionCount}
              color={category.color}
            />
          ))}
          <CategoryModal />
        </>
      )}
    </div>
  );
};

export default CategoryGrid;
