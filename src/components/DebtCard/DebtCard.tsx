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
import DebtDeleteButton from "../Modals/DebtDeleteModal/DebtDeleteModal";
import DebtPaymentButton from "../Modals/DebtPaymentModal.tsx/DebtPaymentModal";
import DebtDetailDrawer from "../Modals/DebtDetailDrawer.tsx/DebtDetailDrawer";

// Initialize the relative time plugin
dayjs.extend(relativeTime);

const { Text } = Typography;

interface DebtTransaction {
  _id: string;
  type: "return" | "add";
  amount: number;
  date: string;
  notes?: string;
  category?: string;
  title?: string;
}

interface DebtCardProps {
  _id: string;
  title: string;
  totalAmount: number;
  amountPaid: number;
  amountRemaining: number;
  debtType: "given" | "taken";
  date: string;
  notes: string;
  transactions: DebtTransaction[];
}

const DebtCard: React.FC<DebtCardProps> = ({
  _id,
  title,
  totalAmount,
  amountPaid,
  amountRemaining,
  date,
  transactions,
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
                label: (
                  <DebtDetailDrawer
                    record={{
                      _id,
                      title,
                      totalAmount,
                      amountPaid,
                      amountRemaining,
                      debtType,
                      date,
                      notes,
                      transactions,
                    }}
                  />
                ),
              },
              // {
              //   key: "2",
              //   label: "Mark as paid",
              // },
              {
                key: "3",
                label: (
                  <DebtPaymentButton
                    record={{
                      _id,
                      title,
                      totalAmount,
                      amountPaid,
                      amountRemaining,
                      debtType,
                      date,
                      notes,
                    }}
                  />
                ),
              },
              {
                key: "4",
                label: (
                  <DebtDeleteButton
                    record={{
                      _id,
                      title,
                      totalAmount,
                      amountPaid,
                      amountRemaining,
                      debtType,
                      date,
                      notes,
                    }}
                  />
                ),
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
