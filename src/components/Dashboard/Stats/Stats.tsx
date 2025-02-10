"use client";
import { Row, Col, Card } from "antd";
import { WalletOutlined, RiseOutlined, FallOutlined, BankOutlined } from "@ant-design/icons";
import CountUp from "react-countup";
import { useEffect, useState } from "react";

interface StatsData {
  currentBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  budgetUtilization: number;
}

const Stats: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatsData>({
    currentBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    budgetUtilization: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/analytics/monthly-stats');
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div style={{ padding: "0 16px", marginBottom: "8px" }}>
      <Row gutter={[8, 8]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} loading={loading}>
            <div>
              <div style={{ fontSize: "14px", color: "#8c8c8c", textTransform: "uppercase" }}>
                Current Balance
              </div>
              <div style={{ color: "#cdf345", fontSize: "24px" }}>
                <WalletOutlined style={{ marginRight: "5px" }} /> $
                <CountUp end={stats.currentBalance} separator="," duration={1} />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={12} sm={12} lg={6}>
          <Card bordered={false} loading={loading}>
            <div>
              <div style={{ fontSize: "14px", color: "#8c8c8c", textTransform: "uppercase" }}>
                Income
              </div>
              <div style={{ color: "#45bcf3", fontSize: "24px" }}>
                <RiseOutlined style={{ marginRight: "5px" }} /> $
                <CountUp end={stats.monthlyIncome} separator="," duration={1} />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={12} sm={12} lg={6}>
          <Card bordered={false} loading={loading}>
            <div>
              <div style={{ fontSize: "14px", color: "#8c8c8c", textTransform: "uppercase" }}>
                Expenses
              </div>
              <div style={{ color: "#f34545", fontSize: "24px" }}>
                <FallOutlined style={{ marginRight: "5px" }} /> $
                <CountUp end={stats.monthlyExpenses} separator="," duration={1} />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} loading={loading}>
            <div>
              <div style={{ fontSize: "14px", color: "#8c8c8c", textTransform: "uppercase" }}>
                Budget Utilization
              </div>
              <div style={{ color: stats.budgetUtilization <= 75 ? "#cdf345" : "#f34545", fontSize: "24px" }}>
                <BankOutlined style={{ marginRight: "5px" }} />
                <CountUp end={stats.budgetUtilization} decimals={1} duration={1} />%
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Stats;
