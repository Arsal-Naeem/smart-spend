import type { Metadata } from "next";
import { ConfigProvider, theme } from "antd";
import { Poppins } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/Navbar/Navbar";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SmartSpend - Expense & Income Tracker",
  description: "Track your expenses and incomes with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.variable}>
        <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
          <Navbar />
          <main className="main">{children}</main>
        </ConfigProvider>
      </body>
    </html>
  );
}
