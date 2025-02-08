"use client";
import { Row, Col, Card } from "antd";
import { WalletOutlined, RiseOutlined, FallOutlined, BankOutlined } from "@ant-design/icons";
import CountUp from "react-countup";
import { useEffect, useState } from "react";

interface StatsProps {
  currentBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  budgetUtilization: number;
}

const Stats: React.FC<StatsProps> = ({
  currentBalance,
  monthlyIncome,
  monthlyExpenses,
  budgetUtilization
}) => {
  return (
    <div style={{ padding: "0 16px", marginBottom: "8px" }}>
      <Row gutter={[8, 8]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <div>
              <div
                style={{
                  fontSize: "14px",
                  color: "#8c8c8c",
                  textTransform: "uppercase",
                }}
              >
                Current Balance
              </div>
              <div style={{ color: "#cdf345", fontSize: "24px" }}>
                <WalletOutlined style={{ marginRight: "5px" }} /> Rs.
                <CountUp end={currentBalance} separator="," duration={1} />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={12} sm={12} lg={6}>
          <Card bordered={false}>
            <div>
              <div
                style={{
                  fontSize: "14px",
                  color: "#8c8c8c",
                  textTransform: "uppercase",
                }}
              >
                Income
              </div>
              <div style={{ color: "#45bcf3", fontSize: "24px" }}>
                <RiseOutlined style={{ marginRight: "5px" }} /> Rs.
                <CountUp end={monthlyIncome} separator="," duration={1} />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={12} sm={12} lg={6}>
          <Card bordered={false}>
            <div>
              <div
                style={{
                  fontSize: "14px",
                  color: "#8c8c8c",
                  textTransform: "uppercase",
                }}
              >
                Expenses
              </div>
              <div style={{ color: "#f34545", fontSize: "24px" }}>
                <FallOutlined style={{ marginRight: "5px" }} /> Rs.
                <CountUp end={monthlyExpenses} separator="," duration={1} />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <div>
              <div
                style={{
                  fontSize: "14px",
                  color: "#8c8c8c",
                  textTransform: "uppercase",
                }}
              >
                Budget Utilization
              </div>
              <div
                style={{
                  color: budgetUtilization <= 75 ? "#cdf345" : "#f34545",
                  fontSize: "24px",
                }}
              >
                <BankOutlined style={{ marginRight: "5px" }} />
                <CountUp end={budgetUtilization} decimals={1} duration={1} />%
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Stats;
