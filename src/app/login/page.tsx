"use client";

import { Button, Card, Typography, Divider } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { useState } from "react";
import styles from "./login.module.css";

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      // TODO: Implement Google Sign-In logic here
      console.log("Initiating Google Sign-In");
    } catch (error) {
      console.error("Google Sign-In failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.loginCard} bordered={false}>
        <Title level={2} className={styles.title}>
          Welcome to SmartSpend
        </Title>
        <p className={styles.textSecondary}>
          Please sign in with Google to continue
        </p>

        <Button
          type="primary"
          icon={<GoogleOutlined />}
          loading={loading}
          onClick={handleGoogleSignIn}
          className={styles.loginButton}
          block
          size="large"
        >
          Sign in with Google
        </Button>

        <p className={styles.textSecondary}>
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </Card>
    </div>
  );
};

export default Login;
