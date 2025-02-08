"use client";
import React, { useState } from "react";
import { Button, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

interface TransactionData {
  key: string;
  date: string;
  type: "Income" | "Expense";
  title: string;
  amount: number;
  category: string;
  notes?: string;
}

interface DeleteTransactionButtonProps {
  record: TransactionData;
  onDelete: (record: TransactionData) => void;
}

const DeleteTransactionButton: React.FC<DeleteTransactionButtonProps> = ({
  record,
  onDelete,
}) => {
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const handleDelete = () => {
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    onDelete(record);
    setDeleteModalVisible(false);
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
        okButtonProps={{ danger: true }}
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
