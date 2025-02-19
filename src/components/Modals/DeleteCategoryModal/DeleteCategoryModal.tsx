"use client";
import React, { useState } from "react";
import { Button, Modal, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

interface CategoryData {
  _id: string;
  categoryName: string;
  budget: number;
  color: string;
}

interface DeleteCategoryButtonProps {
  category: CategoryData;
  onClose?: () => void;
}

const DeleteCategoryButton: React.FC<DeleteCategoryButtonProps> = ({
  category,
  onClose,
}) => {
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = () => {
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/category?id=${category._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete category");
      }

      message.success("Category deleted successfully");

      setDeleteModalVisible(false);

      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      message.error("Failed to delete category");
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
        <p>Are you sure you want to delete this category?</p>
        <div style={{ margin: "1rem 0" }}>
          <p>
            <strong>Category:</strong> {category.categoryName}
          </p>
          <p>
            <strong>Budget:</strong> Rs.{category.budget.toFixed(2)}
          </p>
        </div>
      </Modal>
    </>
  );
};

export default DeleteCategoryButton;
