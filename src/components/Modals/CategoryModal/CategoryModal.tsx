"use client";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Card, Modal, Form, Input, Button, InputNumber } from "antd";
import { useEffect, useState } from "react";

interface CategoryModalProps {
  isEdit?: boolean;
  initialValues?: {
    categoryName: string;
    budget: number;
  };

  onClick?: () => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isEdit = false,
  initialValues,

  onClick,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleSubmit = (values: { name: string }) => {
    console.log("Submitted values:", values);
    // Add your category creation logic here
    form.resetFields();
    setIsModalOpen(false);
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
        title="Add New Category"
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

          <Form.Item>
            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type="primary" htmlType="submit">
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
