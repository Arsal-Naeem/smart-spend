"use client";

import { Button, Card, Typography} from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import styles from "./login.module.css";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const { Title } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading" || status === "authenticated") {
    return null;
  }

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
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
