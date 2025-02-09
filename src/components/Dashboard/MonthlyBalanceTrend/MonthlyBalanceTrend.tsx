"use client";
import { Card } from "antd";
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type MonthlyBalanceData = {
  month: string;
  balance: number;
};

const MonthlyBalanceTrend: React.FC = () => {
  const [data, setData] = useState<MonthlyBalanceData[]>([]);
  const [loading, setLoading] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(true);

  useEffect(() => {
    setShouldAnimate(false);

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/analytics/monthly-balance");
        const data = await response.json();
        setData(data);
        setLoading(false);
        setShouldAnimate(true);
      } catch (error) {
        console.error("Failed to fetch monthly balance data:", error);
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      setLoading(true);
      setShouldAnimate(false);
    };
  }, []);

  return (
    <Card
      title="Monthly Balance Trend"
      bordered={false}
      loading={loading}
      style={{ height: "100%" }}
    >
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{
            top: 0,
            right: 10,
            left: -20,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f0f0f0"
          />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            style={{ fontSize: "12px" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            style={{ fontSize: "12px" }}
          />
          <Tooltip
            contentStyle={{
              background: "rgba(24, 24, 24, 0.9)",
              backdropFilter: "blur(5px)",
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "12px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
          />
          <Legend iconType="circle" />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#cdf345"
            strokeWidth={3}
            dot={{ r: 4, fill: "#6366F1" }}
            activeDot={{ r: 6, fill: "#6366F1" }}
            animationDuration={shouldAnimate ? 1500 : 0}
            animationBegin={0}
            fill="url(#balanceGradient)"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default MonthlyBalanceTrend;
