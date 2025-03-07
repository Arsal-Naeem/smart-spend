"use client";
import { Button, Space } from "antd";
import Link from "next/link";
import styles from "./styles/landingPage.module.css";
import Image from "next/image";

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.title}>Hi, we're SmartSpend.</h2>
        <p className={styles.description}>
          Take control of your finances with our intelligent expense tracking
          and budgeting solution.
        </p>

        <Space size="large">
          <Link href="/login">
            <Button type="primary" size="large">
              Get Started
            </Button>
          </Link>
        </Space>
      </div>
      <div className={styles.image}>
        <Image
          src="/phone.png"
          alt="Landing Page"
          width={400}
          height={400}
          priority
          className={styles.img}
        />
      </div>
    </div>
  );
}
