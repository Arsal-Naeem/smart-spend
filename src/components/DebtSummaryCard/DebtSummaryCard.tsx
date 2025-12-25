"use client";
import { Card, Col, Divider, Flex, Row, Skeleton } from "antd";
import { useEffect, useState } from "react";

interface DebtSummary {
  outstandingDebt: number;
  outstandingCredit: number;
}

const debtSummary: DebtSummary = {
  outstandingDebt: 0,
  outstandingCredit: 6040,
};

const DebtSummaryCard = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
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
                <h3>Rs. {debtSummary.outstandingDebt}</h3>
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
                <h3>Rs. {debtSummary.outstandingCredit}</h3>
              </Flex>
            </Col>
          </Row>
        </Card>
      )}
    </div>
  );
};

export default DebtSummaryCard;
