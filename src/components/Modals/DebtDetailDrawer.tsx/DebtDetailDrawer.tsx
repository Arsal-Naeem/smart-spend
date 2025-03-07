import React, { useState } from "react";
import {
  Drawer,
  Timeline,
  Typography,
  Descriptions,
  Flex,
  Button,
  Progress,
} from "antd";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { pdf } from "@react-pdf/renderer";
import DebtReport from "@/components/PDFTemplates/DebtReport";

const { Text, Title } = Typography;

interface DebtTransaction {
  _id: string;
  type: "return" | "add";
  amount: number;
  date: string;
  notes?: string;
  reason?: string;
  category?: string;
}

interface DebtDetailProps {
  record: {
    _id: string;
    title: string;
    totalAmount: number;
    amountPaid: number;
    amountRemaining: number;
    debtType: "given" | "taken";
    date: string;
    notes: string;
    transactions: DebtTransaction[];
  };
}

const DebtDetailDrawer: React.FC<DebtDetailProps> = ({ record }) => {
  const [pdfLoading, setPdfLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const generatePDF = async () => {
    try {
      setPdfLoading(true);
      const blob = await pdf(
        <DebtReport record={record} session={session} />
      ).toBlob();

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${record.title}-debt-report.pdf`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setPdfLoading(false);
    }
  };

  const progressPercentage = parseFloat(
    ((record.amountPaid / record.totalAmount) * 100).toFixed(1)
  );

  const getTransactionDescription = (transaction: DebtTransaction, record: DebtDetailProps['record'], userName?: string) => {
    const amount = `Rs.${transaction.amount.toFixed(2)}`;
    const reasonText = transaction.reason ? ` for ${transaction.reason}` : '';
    
    if (record.debtType === "given") {
      return transaction.type === "return"
        ? `${record.title} gave ${amount} to ${userName}${reasonText}`
        : `${record.title} borrowed ${amount} from ${userName}${reasonText}`;
    } else {
      return transaction.type === "return"
        ? `${userName} gave ${amount} to ${record.title}${reasonText}`
        : `${userName} borrowed ${amount} from ${record.title}${reasonText}`;
    }
  };

  return (
    <>
      <div onClick={showDrawer}>View details</div>
      <Drawer
        title={`Debt Details - ${record.title}`}
        placement="right"
        onClose={onClose}
        open={open}
        width={600}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div>
            <Flex align="center" justify="space-between">
              <Title level={5}>Overview</Title>
              <Button
                type="primary"
                loading={pdfLoading}
                size="small"
                onClick={generatePDF}
              >
                Generate Report
              </Button>
            </Flex>

            <Descriptions
              size="small"
              column={1}
              bordered
              style={{ marginTop: "16px" }}
            >
              <Descriptions.Item
                label="Total Amount"
                labelStyle={{ fontWeight: "bold" }}
              >
                <Text style={{ color: "#FF9D00" }} strong>
                  Rs.{record.totalAmount.toFixed(2)}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item
                label="Amount Paid"
                labelStyle={{ fontWeight: "bold" }}
              >
                <Text style={{ color: "#CDF345" }} strong>
                  Rs.{record.amountPaid.toFixed(2)}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item
                label="Remaining"
                labelStyle={{ fontWeight: "bold" }}
              >
                <Text style={{ color: "#F34545" }} strong>
                  Rs.{record.amountRemaining.toFixed(2)}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item
                label="Type"
                labelStyle={{ fontWeight: "bold" }}
              >
                <Text
                  style={{
                    color: record.debtType === "given" ? "#CDF345" : "#CDF345",
                  }}
                >
                  {record.debtType === "given" ? "You gave" : "You took"}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item
                label="Created"
                labelStyle={{ fontWeight: "bold" }}
              >
                {dayjs(record.date).format("DD MMM YYYY, hh:mm A")}
              </Descriptions.Item>
            </Descriptions>
          </div>

          <Progress
            percent={progressPercentage}
            status={progressPercentage >= 100 ? "success" : "active"}
            strokeColor={"#CDF345"}
          />

          {/* {record.notes && (
            <div>
              <Title level={5}>Notes</Title>
              <Text>{record.notes}</Text>
            </div>
          )} */}

          {record.transactions && record.transactions.length > 0 && (
            <div>
              <Title level={5}>Transaction History</Title>
              <Timeline
                items={record.transactions.map((transaction) => ({
                  color: transaction.type === "return" ? "green" : "blue",
                  children: (
                    <div>
                      <Text strong>
                        {getTransactionDescription(transaction, record, session?.user?.name)}
                      </Text>
                      <br />
                      <p style={{ fontSize: "12px", opacity: 0.75 }}>
                        {dayjs(transaction.date).format("DD MMM YYYY, hh:mm A")}
                      </p>
                      {transaction.notes && (
                        <div style={{ marginTop: "4px" }}>
                          <Text italic>{transaction.notes}</Text>
                        </div>
                      )}
                    </div>
                  ),
                }))}
                style={{ marginTop: "24px" }}
              />
            </div>
          )}
        </div>
      </Drawer>
    </>
  );
};

export default DebtDetailDrawer;
