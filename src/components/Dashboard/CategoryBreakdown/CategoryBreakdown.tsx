"use client";
import { Card, Spin } from "antd";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Sector,
} from "recharts";
import { useState, useCallback } from "react";

interface CategoryData {
  category: string;
  amount: number;
  color?: string;
}

interface CategoryBreakdownProps {
  data: CategoryData[];
  loading?: boolean;
}

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
    props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="custom-tooltip"
        style={{
          background: "rgba(24, 24, 24, 0.9)",
          backdropFilter: "blur(5px)",
          padding: "12px",
          border: "1px solid #ccc",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <p style={{ margin: 0, fontWeight: "bold" }}>{payload[0].name}</p>
        <p style={{ margin: 0 }}>${payload[0].value.toFixed(2)}</p>
        <p style={{ margin: 0, opacity: 0.7 }}>
          {((payload[0].value / payload[0].payload.total) * 100).toFixed(1)}%
        </p>
      </div>
    );
  }
  return null;
};

const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({
  data,
  loading = false,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | undefined>();
  const total = data.reduce((sum, item) => sum + item.amount, 0);
  const dataWithTotal = data.map((item) => ({ ...item, total }));

  const onPieEnter = useCallback((_: any, index: number) => {
    setActiveIndex(index);
  }, []);

  const onPieLeave = useCallback(() => {
    setActiveIndex(undefined);
  }, []);

  return (
    <Card
      title="Category Breakdown"
      bordered={false}
      className="hover:shadow-lg transition-shadow duration-300"
    >
      {loading ? (
        <div className="h-[300px] flex items-center justify-center">
          <Spin size="large" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart
            margin={{
              top: 0,
              right: 0,
              left: 0,
              bottom: 10,
            }}
          >
            <Pie
              data={dataWithTotal}
              dataKey="amount"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius="55%"
              outerRadius="90%"
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              animationDuration={750}
              animationBegin={0}
            >
              {dataWithTotal.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.color ||
                    `#${Math.floor(Math.random() * 16777215).toString(16)}`
                  }
                  stroke="none"
                  style={{
                    filter:
                      activeIndex === index
                        ? "drop-shadow(0 0 8px rgba(0,0,0,0.2))"
                        : "none",
                    transition: "filter 0.3s",
                  }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value, entry: any) => (
                <span
                  style={{
                    color: entry.color,
                  }}
                >
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
};

export default CategoryBreakdown;
