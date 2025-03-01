import React from "react";
import {
  Button,
  Card,
  Dropdown,
  Progress,
  Space,
  Typography,
} from "antd";
import { MoreOutlined, ClockCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// Initialize the relative time plugin
dayjs.extend(relativeTime);

const { Text } = Typography;

interface DebtCardProps {
  title: string;
  totalAmount: number;
  amountPaid: number;
  amountRemaining: number;
  debtType: "given" | "taken";
  date: string;
  notes: string;
}

const DebtCard: React.FC<DebtCardProps> = ({
  title,
  totalAmount,
  amountPaid,
  amountRemaining,
  date,
}) => {
  const progressPercentage = parseFloat(
    ((amountPaid / totalAmount) * 100).toFixed(1)
  );
  return (
    <Card
      title={
        <div>
          <Text strong>{`${title} (Rs.${totalAmount})`}</Text>

          <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
            <ClockCircleOutlined style={{ fontSize: "10px", opacity: 0.7 }} />
            <p
              style={{
                marginTop: "1px",
                fontSize: "10px",
                lineHeight: "11px",
                opacity: 0.7,
              }}
            >
              {dayjs(date).fromNow()}
            </p>
          </div>
        </div>
      }
      bordered={false}
      style={{ width: "100%", maxWidth: "400px" }}
      extra={
        <Dropdown
          menu={{
            items: [
              {
                key: "1",
                label: "Mark as Paid",
              },
              {
                key: "2",
                label: "Pay",
              },
              {
                key: "3",
                label: "Delete",
              },
            ],
          }}
          trigger={["click"]}
        >
          <Button
            type="text"
            icon={<MoreOutlined style={{ color: "#fff" }} />}
          />
        </Dropdown>
      }
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Space
          direction="vertical"
          style={{ width: "100%", marginBottom: "1rem" }}
        >
          <p>Total Debt: Rs.{totalAmount}</p>
          <p>Amount Paid: Rs.{amountPaid}</p>
          <Progress
            percent={progressPercentage}
            status={progressPercentage >= 100 ? "success" : "active"}
            strokeColor={"#CDF345"}
          />
          <p>Amount Remaining: Rs.{amountRemaining}</p>
        </Space>
      </div>
    </Card>
  );
};

export default DebtCard;
