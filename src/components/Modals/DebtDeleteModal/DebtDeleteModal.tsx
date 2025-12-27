"use client";
import React, { useState } from "react";
import { Card, Flex, Modal, message } from "antd";
import dayjs from "dayjs";
import { useCurrency } from '@/hooks/useCurrency';
import { getCurrencySymbol } from '@/utils/formatCurrency';

interface DebtData {
  _id: string;
  title: string;
  totalAmount: number;
  amountPaid: number;
  amountRemaining: number;
  debtType: "given" | "taken";
  date: string;
}

interface DebtDeleteModalProps {
  record: DebtData;
  onClose?: () => void;
}

const DebtDeleteButton: React.FC<DebtDeleteModalProps> = ({
  record,
  onClose,
}) => {
  const { currency } = useCurrency();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = () => {
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/debts?id=${record._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete debt");
      }

      message.success("Debt deleted successfully");
      setDeleteModalVisible(false);

      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Error deleting debt:", error);
      message.error("Failed to delete debt");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <p style={{ width: "100%", textAlign: "center" }} onClick={handleDelete}>
        Delete
      </p>

      <Modal
        title="Confirm Delete"
        open={deleteModalVisible}
        onOk={confirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true, loading: loading }}
        width={400}
        centered
      >
        <p>
          Are you sure you want to delete this debt record and all of it's
          transaction cycles?
        </p>
        <div style={{ margin: "1rem 0" }}>
          <Card>
            <Flex align="center" justify="space-between">
              <Flex>
                <div></div>
                <div>
                  <h4>{record.title}</h4>
                  <p style={{ fontSize: "12px", opacity: 0.75 }}>
                    {dayjs(record.date).format("DD MMM, YYYY h:mm A")}
                  </p>
                </div>
              </Flex>
              <div>{getCurrencySymbol(currency)}{record.totalAmount}</div>
            </Flex>
          </Card>
        </div>
      </Modal>
    </>
  );
};

export default DebtDeleteButton;
