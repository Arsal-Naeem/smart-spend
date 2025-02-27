"use client";
import {
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Segmented,
  Space,
} from "antd";
import { useState } from "react";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

interface StatementModalProps {
  onClose?: () => void;
}

const StatementModal: React.FC<StatementModalProps> = ({ onClose }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statementType, setStatementType] = useState("monthly");
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
    setStatementType("monthly");
  };

  const handleSubmit = (values: any) => {
    console.log("Form values:", values);
    handleCancel();
  };

  const handleTypeChange = (value: string) => {
    setStatementType(value);
    form.setFieldValue("type", value); // Add this line to sync form state
    form.resetFields(["month", "year", "dateRange"]); // Only reset the date-related fields
  };

  // Generate year options (current year and past 4 years)
  const currentYear = dayjs().year();
  const yearOptions = Array.from({ length: 5 }, (_, index) => ({
    value: currentYear - index,
    label: (currentYear - index).toString(),
  }));

  // Generate month options
  const monthOptions = Array.from({ length: 12 }, (_, index) => ({
    value: index + 1,
    label: dayjs().month(index).format("MMMM"),
  }));

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "0 16px" }}>
        <Button type="primary" onClick={showModal}>
          Get Statement
        </Button>
      </div>

      <Modal
        title="Generate Statement"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        centered
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="type" initialValue="monthly">
            <Segmented
              options={[
                { label: "Monthly", value: "monthly" },
                { label: "Yearly", value: "yearly" },
                { label: "Range", value: "range" },
              ]}
              onChange={handleTypeChange}
              value={statementType}
              block
            />
          </Form.Item>

          <Form.Item
            label="Statement Name"
            name="name"
            rules={[{ required: true, message: "Please enter statement name" }]}
          >
            <Input placeholder="Enter statement name" />
          </Form.Item>

          {statementType === "monthly" && (
            <Space.Compact block style={{ width: "100%" }}>
              <Form.Item
                label="Month"
                name="month"
                rules={[{ required: true, message: "Please select month" }]}
                style={{ width: "50%" }}
              >
                <Select options={monthOptions} placeholder="Select Month" />
              </Form.Item>
              <Form.Item
                label="Year"
                name="year"
                rules={[{ required: true, message: "Please select year" }]}
                style={{ width: "50%" }}
              >
                <Select options={yearOptions} placeholder="Select Year" />
              </Form.Item>
            </Space.Compact>
          )}

          {statementType === "yearly" && (
            <Form.Item
              label="Year"
              name="year"
              rules={[{ required: true, message: "Please select year" }]}
            >
              <Select options={yearOptions} placeholder="Select Year" />
            </Form.Item>
          )}

          {statementType === "range" && (
            <Form.Item
              label="Date Range"
              name="dateRange"
              rules={[{ required: true, message: "Please select date range" }]}
            >
              <RangePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
            </Form.Item>
          )}

          <Form.Item
            className="form-buttons"
            style={{ marginBottom: 0, textAlign: "right" }}
          >
            <Button style={{ marginRight: 8 }} onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Generate
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default StatementModal;
