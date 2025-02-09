"use client";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Card,
  Modal,
  Form,
  Input,
  Button,
  InputNumber,
  ColorPicker,
  message,
} from "antd";
import { useEffect, useState } from "react";

interface CategoryModalProps {
  isEdit?: boolean;
  initialValues?: {
    _id?: string;
    categoryName: string;
    budget: number;
    color: string;
  };
  onClick?: () => void;
  onSuccess?: () => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isEdit = false,
  initialValues,
  onClick,
  onSuccess,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues && isModalOpen) {
      form.setFieldsValue(initialValues);
    }
  }, [form, initialValues, isModalOpen]);

  const showModal = () => {
    setIsModalOpen(true);
    onClick?.();
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const handleSubmit = async (values: {
    categoryName: string;
    budget: number;
    color: string | { toHexString: () => string };
  }) => {
    try {
      setLoading(true);
      const url = "/api/category";
      const method = isEdit ? "PUT" : "POST";

      const formattedValues = {
        ...values,
        color:
          typeof values.color === "string"
            ? values.color
            : values.color.toHexString(),
      };

      const body = isEdit
        ? { ...formattedValues, _id: initialValues?._id }
        : formattedValues;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Failed to save category");
      }

      message.success(
        `Category ${isEdit ? "updated" : "created"} successfully`
      );
      form.resetFields();
      setIsModalOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error saving category:", error);
      message.error("Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!isEdit ? (
        <Card
          style={{
            width: 300,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
          hoverable
          bordered={false}
          onClick={showModal}
        >
          <PlusOutlined style={{ fontSize: "24px", color: "#8c8c8c" }} />
        </Card>
      ) : (
        <Button
          type="text"
          onClick={showModal}
          icon={<EditOutlined style={{ color: "#fff", fontSize: "16px" }} />}
          aria-label="Edit category"
        />
      )}

      <Modal
        title={isEdit ? "Edit Category" : "Add New Category"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        centered
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="categoryName"
            label="Category Name"
            rules={[
              {
                required: true,
                message: "Please input the category name!",
              },
            ]}
          >
            <Input placeholder="Enter category name" />
          </Form.Item>
          <Form.Item
            label="Budget"
            name="budget"
            initialValue={0}
            rules={[{ required: true, message: "Please enter amount" }]}
          >
            <InputNumber prefix="$" style={{ width: "100%" }} min={0} />
          </Form.Item>
          <Form.Item
            label="Color"
            name="color"
            rules={[{ required: true, message: "Please select a color" }]}
          >
            <ColorPicker format="hex" />
          </Form.Item>
          <Form.Item>
            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Save
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CategoryModal;
