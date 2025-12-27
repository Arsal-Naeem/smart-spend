import React from "react";
import { Card, Skeleton } from "antd";

type SkeletonType = "transaction" | "debt" | "category";

interface LoadingSkeletonProps {
  type: SkeletonType;
  quantity?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  type = "transaction", 
  quantity = 1 
}) => {
  const getSkeletonStyle = () => {
    switch (type) {
      case "transaction":
        return {
          width: "100%",
          size: "small" as const,
        };
      case "debt":
        return {
          width: 400,
          size: "default" as const,
        };
      case "category":
        return {
          width: 300,
          size: "default" as const,
        };
      default:
        return {
          width: "100%",
          size: "default" as const,
        };
    }
  };

  const getSkeletonRows = () => {
    switch (type) {
      case "transaction":
        return 1;
      case "debt":
      case "category":
        return 5;
      default:
        return 3;
    }
  };

  const style = getSkeletonStyle();
  const rows = getSkeletonRows();

  return (
    <>
      {[...Array(quantity)].map((_, index) => (
        <Card 
          key={index}
          size={style.size}
          style={{ width: style.width }}
          bordered={false}
        >
          <Skeleton active paragraph={{ rows }} />
        </Card>
      ))}
    </>
  );
};

export default LoadingSkeleton;