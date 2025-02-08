import { Row, Col } from "antd";
import CategoryCard from "../CategoryCard/CategoryCard";
import CategoryModal from "../CategoryModal/CategoryModal";

// Dummy data for categories
const categories = [
  {
    categoryName: "Shopping",
    totalSpend: 450.75,
    budget: 600,
    transactionCount: 8,
  },
  {
    categoryName: "Housing",
    totalSpend: 1200,
    budget: 1500,
    transactionCount: 2,
  },
  {
    categoryName: "Transportation",
    totalSpend: 250.5,
    budget: 300,
    transactionCount: 5,
  },
  {
    categoryName: "Healthcare",
    totalSpend: 500,
    budget: 400,
    transactionCount: 3,
  },
];

const CategoryGrid = () => {
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
      {categories.map((category, index) => (
        <CategoryCard
          key={index}
          categoryName={category.categoryName}
          totalSpend={category.totalSpend}
          budget={category.budget}
          transactionCount={category.transactionCount}
        />
      ))}
      <CategoryModal />
    </div>
  );
};

export default CategoryGrid;
