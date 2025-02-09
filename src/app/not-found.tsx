import Link from "next/link";
import styles from "./styles/notfoundPage.module.css";
import { Button } from "antd";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <h1 className={styles.errorCode}>404</h1>
      <p className={styles.messageHeader}>Sorry We Can't Find That Page!</p>
      <p className={styles.message}>
        The page you are looking for was moved, removed, renamed or never
        existed.
      </p>
      <Link href="/dashboard" className={styles.homeButton}>
        <Button type="primary" size="large">
          Back to Home
        </Button>
      </Link>
    </div>
  );
}
