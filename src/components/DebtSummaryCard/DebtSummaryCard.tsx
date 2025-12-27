"use client";
import { Card, Col, Divider, Flex, Row, Skeleton, message } from "antd";
import { useEffect, useState } from "react";
import { useCurrency } from '@/hooks/useCurrency';
import { getCurrencySymbol } from '@/utils/formatCurrency';

interface DebtSummary {
  outstandingDebt: number;
  outstandingCredit: number;
  takenCount: number;
  givenCount: number;
}

const DebtSummaryCard = () => {
  const { currency } = useCurrency();
  const [loading, setLoading] = useState(true);
  const [debtSummary, setDebtSummary] = useState<DebtSummary>({
    outstandingDebt: 0,
    outstandingCredit: 0,
    takenCount: 0,
    givenCount: 0,
  });

  useEffect(() => {
    const fetchDebtSummary = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/debt-payments");
        if (!response.ok) {
          throw new Error("Failed to fetch debt summary");
        }
        const data = await response.json();
        setDebtSummary(data);
      } catch (error) {
        console.error("Error fetching debt summary:", error);
        message.error("Failed to load debt summary");
      } finally {
        setLoading(false);
      }
    };

    fetchDebtSummary();
  }, []);

  const LoadingSkeleton = () => (
    <Card bordered={false} style={{ width: "100%" }}>
      <Skeleton active paragraph={{ rows: 2 }} />
    </Card>
  );

  return (
    <div style={{ margin: "0 16px 24px 16px" }}>
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <Card bordered={false} style={{ width: "100%" }}>
          <Row gutter={16}>
            <Col span={11}>
              <Flex vertical align="center" justify="center" gap={8}>
                <p style={{ opacity: 0.75 }}>Outstanding Debt</p>
                <h3>{getCurrencySymbol(currency)} {debtSummary.outstandingDebt}</h3>
              </Flex>
            </Col>
            <Col span={2}>
              <Flex
                align="center"
                justify="center"
                gap={8}
                style={{ height: "100%" }}
              >
                <Divider type="vertical" style={{ height: "100%" }} />
              </Flex>
            </Col>
            <Col span={11}>
              <Flex vertical align="center" justify="center" gap={8}>
                <p style={{ opacity: 0.75 }}>Outstanding Credit</p>
                <h3>{getCurrencySymbol(currency)} {debtSummary.outstandingCredit}</h3>
              </Flex>
            </Col>
          </Row>
        </Card>
      )}
    </div>
  );
};

export default DebtSummaryCard;
