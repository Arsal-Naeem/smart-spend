import { Card, Progress, Space, Button } from "antd"
import CategoryModal from "../Modals/CategoryModal/CategoryModal";

interface CategoryCardProps {
  categoryName: string;
  totalSpend: number;
  budget: number;
  transactionCount: number;
  color: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  categoryName,
  totalSpend,
  budget,
  transactionCount,
  color,
}) => {
  const spendPercentage = (totalSpend / budget) * 100;

  return (
    <Card
      title={categoryName}
      hoverable
      style={{ width: 300 }}
      bordered={false}
      extra={
        <CategoryModal
          isEdit
          initialValues={{ categoryName: categoryName, budget: budget, color: color }}
        />
      }
    >
      <Space
        direction="vertical"
        style={{ width: "100%", marginBottom: "1rem" }}
      >
        <p>Total Spend: ${totalSpend.toFixed(2)}</p>
        <p>Budget: ${budget.toFixed(2)}</p>
        <Progress
          percent={parseFloat(spendPercentage.toFixed(2))}
          status={spendPercentage >= 100 ? "exception" : "normal"}
          strokeColor={{
            "0%": color,
            "100%": spendPercentage >= 100 ? "#D64040" : color,
          }}
        />
        <p>Transactions: {transactionCount}</p>
      </Space>
    </Card>
  );
};

export default CategoryCard;
