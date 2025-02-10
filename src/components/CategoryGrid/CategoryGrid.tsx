"use client";
import { useState, useEffect } from "react";
import CategoryCard from "../CategoryCard/CategoryCard";
import CategoryModal from "../Modals/CategoryModal/CategoryModal";
import { Card, message, Skeleton } from "antd";

interface Category {
  _id: string;
  category: string;
  totalSpend: number;
  budget: number;
  color: string;
  transactionCount: number;
}

const CategoryGrid = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/category");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      message.error("Failed to fetch categories");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

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
              id={category._id}
              category={category.category}
              totalSpend={category.totalSpend}
              budget={category.budget}
              transactionCount={category.transactionCount}
              color={category.color}
              onSuccess={fetchCategories}
            />
          ))}
          <CategoryModal onSuccess={fetchCategories} />
        </>
      )}
    </div>
  );
};

export default CategoryGrid;
