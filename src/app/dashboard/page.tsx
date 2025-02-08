import CategoryBreakdown from "@/components/Dashboard/CategoryBreakdown/CategoryBreakdown";
import MonthlyBalanceTrend from "@/components/Dashboard/MonthlyBalanceTrend/MonthlyBalanceTrend";
import Stats from "@/components/Dashboard/Stats/Stats";
import TransactionModal from "@/components/TransactionModal/TransactionModal";
import TransactionsTable from "@/components/TransactionTable/TransactionTable";
import { Col, Row } from "antd";

export default function Dashboard() {
  const data = [
    { month: "June", balance: 100 },
    { month: "Jul", balance: 2200 },
    { month: "Aug", balance: 3000 },
    { month: "Sep", balance: 2800 },
    { month: "Oct", balance: 3500 },
    { month: "Nov", balance: 4000 },
    { month: "Dec", balance: 4500 },
  ];

  const categoryData = [
    { category: "Groceries", amount: 500, color: "#a2f345" },
    { category: "Utilities", amount: 300, color: "#458bf3" },
    { category: "Entertainment", amount: 200, color: "#f3d345" },
    { category: "Transport", amount: 150, color: "#FF8042" },
    { category: "Transpsdort", amount: 50, color: "#7c45f3" },
  ];

  const stats = {
    currentBalance: 5000,
    monthlyIncome: 3000,
    monthlyExpenses: 2000,
    budgetUtilization: 72,
  }

  return (
    <>
      <div
        style={{ padding: "24px 16px 8px 16px ", color: "var(--color-accent)" }}
      >
        <h2>Hi, Arsal Naeem</h2>
      </div>
      <Stats
        currentBalance={stats?.currentBalance}
        monthlyIncome={stats?.monthlyIncome}
        monthlyExpenses={stats?.monthlyExpenses}
        budgetUtilization={stats?.budgetUtilization}
      />
      <div style={{ padding: "0 16px" }}>
        <Row gutter={[8, 8]}>
          <Col xs={24} sm={12} lg={12}>
            <MonthlyBalanceTrend data={data} />
          </Col>
          <Col xs={24} sm={12} lg={12}>
            <CategoryBreakdown data={categoryData} />
          </Col>
        </Row>
      </div>
      <TransactionsTable />
      <TransactionModal />
      
    </>
  );
}
