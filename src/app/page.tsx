"use client";
import { Button, Typography, Space } from "antd";
import { LoginOutlined, UserAddOutlined } from "@ant-design/icons";
import Link from "next/link";
import styles from "./styles/landingPage.module.css";

const { Title, Paragraph } = Typography;

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Title level={1}>Welcome to SmartSpend</Title>
        <Paragraph style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>
          Take control of your finances with our intelligent expense tracking
          and budgeting solution.
        </Paragraph>

        <Space size="large">
          <Link href="/login">
            <Button type="primary" size="large" icon={<LoginOutlined />}>
              Login
            </Button>
          </Link>
        </Space>

        <div className={styles.features}>
          <div className={styles.featureItem}>
            <Title level={4}>Track Expenses</Title>
            <Paragraph>Monitor your spending habits with ease</Paragraph>
          </div>
          <div className={styles.featureItem}>
            <Title level={4}>Budget Smart</Title>
            <Paragraph>Create and manage budgets effectively</Paragraph>
          </div>
          <div className={styles.featureItem}>
            <Title level={4}>Insights</Title>
            <Paragraph>Get detailed analytics of your spending</Paragraph>
          </div>
        </div>
      </div>
    </div>
  );
}
