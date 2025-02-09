"use client";
import React, { useState } from "react";
import { Button, Modal, message } from "antd"; // Add message from antd
import { DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

interface TransactionData {
  _id: string;
  date: string;
  type: "income" | "expense";
  title: string;
  amount: number;
  category: string;
  notes?: string;
}

interface DeleteTransactionButtonProps {
  record: TransactionData;
  onDelete: (record: TransactionData) => void;
  onClose?: () => void;
}

const DeleteTransactionButton: React.FC<DeleteTransactionButtonProps> = ({
  record,
  onDelete,
  onClose
}) => {
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = () => {
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/transactions?id=${record._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete transaction');
      }

      message.success('Transaction deleted successfully');
      onDelete(record);
      setDeleteModalVisible(false);
      
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      message.error('Failed to delete transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        type="text"
        danger
        icon={<DeleteOutlined style={{ fontSize: "18px" }} />}
        onClick={handleDelete}
      />

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
        <p>Are you sure you want to delete this transaction?</p>
        <div style={{ margin: "1rem 0" }}>
          <p>
            <strong>Title:</strong> {record.title}
          </p>
          <p>
            <strong>Amount:</strong> ${record.amount.toFixed(2)}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {dayjs(record.date).format("hh:mm A, DD/MM/YYYY")}
          </p>
        </div>
      </Modal>
    </>
  );
};

export default DeleteTransactionButton;
