import type { Metadata } from "next";
import { ConfigProvider, theme } from "antd";
import { Poppins } from "next/font/google";
import "@ant-design/v5-patch-for-react-19";
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
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#cdf345",
              colorText: "#ffffff",
              colorTextPlaceholder: "#8c8c8c",
              colorIcon: "#fff",
              colorBgContainer: "#1e1e1f",
              colorFillSecondary: "#1e1e1f",
              colorFillTertiary: "#1e1e1f",
              colorFillQuaternary: "#1e1e1f",
              colorTextLightSolid: "#2e2d2d",
            },
            components: {
              Input: {
                colorBgContainer: "#1e1e1f",
              },
              Select: {
                colorBgContainer: "#1e1e1f",
                colorBgElevated: "#1e1e1f",
                colorIcon: "#fff",
                optionSelectedBg: "#2e2d2d",
                optionActiveBg: "#2e2d2d75",
                controlItemBgHover: "#2e2d2d75",
              },
              DatePicker: {
                colorBgContainer: "#1e1e1f",
                colorBgElevated: "#1e1e1f",
                colorIcon: "#fff",
                activeBg: "#2e2d2d",
              },
              Table: {
                headerBg: "#2F2F2F",
                headerColor: "#ffffff",
              },
              Button: {
                primaryColor: "#000",
                textTextColor: "#000",
                colorTextDisabled: "#8c8c8c",
              },
            },
            algorithm: theme.darkAlgorithm,
          }}
        >
          <Navbar />
          <main className="main">{children}</main>
        </ConfigProvider>
      </body>
    </html>
  );
}
