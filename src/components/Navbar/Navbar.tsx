"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState, MouseEvent } from "react";
import styles from "./Navbar.module.css";
import { Tooltip } from "antd";

const Navbar = () => {
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: MouseEvent) => {
    setIsDragging(true);
    if (scrollRef.current) {
      setStartX(e.pageX - scrollRef.current.offsetLeft);
      setScrollLeft(scrollRef.current.scrollLeft);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    if (scrollRef.current) {
      const x = e.pageX - scrollRef.current.offsetLeft;
      const walk = (x - startX) * 2;
      scrollRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <nav className={styles.navbar}>
      <div
        ref={scrollRef}
        className={styles.links}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <Link
          href="/dashboard"
          className={pathname === "/dashboard" ? styles.active : ""}
        >
          Dashboard
        </Link>
        <Link
          href="/transactions"
          className={pathname === "/transactions" ? styles.active : ""}
        >
          Transactions
        </Link>
        <Link
          href="/categories"
          className={pathname === "/categories" ? styles.active : ""}
        >
          Categories
        </Link>
        <Tooltip title="Feature Coming Soon" placement="bottom">
          <span className={styles.disabledLink}>
            Recurring
          </span>
        </Tooltip>
        <Link
          href="/user-profile"
          className={pathname === "/user-profile" ? styles.active : ""}
        >
          User Profile
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
