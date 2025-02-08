"use client";
import {
  Button,
  Modal,
  Form,
  Input,
  Switch,
  DatePicker,
  InputNumber,
  Select,
  App,
  Tooltip,
  Segmented,
  TimePicker,
  Space,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import styles from "./TransactionModal.module.css";
import { useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const TransactionModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState("expense");
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
    setTransactionType("expense");
  };

  const handleSubmit = (values: any) => {
    const combinedDateTime =
      values.date && values.time
        ? dayjs(values.date)
            .hour(values.time.hour())
            .minute(values.time.minute())
            .second(0)
            .millisecond(0)
            .utc()
            .toISOString()
        : null;

    const formattedValues = {
      ...values,
      datetime: combinedDateTime,
    };

    console.log("Form values:", formattedValues);
    message.success("Transaction added successfully");
    setIsModalOpen(false);
    form.resetFields();
    setTransactionType("expense");
    message.success("Transaction added successfully");
  };

  const handleTypeChange = (value: string) => {
    setTransactionType(value);
    if (value === "income") {
      form.setFieldValue("category", undefined);
    }
  };

  const categories = [
    { value: "food", label: "Food" },
    { value: "transport", label: "Transport" },
    { value: "utilities", label: "Utilities" },
    { value: "entertainment", label: "Entertainment" },
    { value: "salary", label: "Salary" },
  ];

  return (
    <>
      <div className={styles.floatingButton}>
        <Button
          type="primary"
          icon={<PlusOutlined style={{ color: "#121212" }} />}
          onClick={showModal}
          shape="circle"
          size="large"
        />
      </div>
      <Modal
        title="Add Transaction"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        centered
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="type" initialValue="expense">
            <Segmented
              options={[
                { label: "Expense", value: "expense" },
                { label: "Income", value: "income" },
              ]}
              onChange={handleTypeChange}
              block
            />
          </Form.Item>

          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter title" }]}
          >
            <Input placeholder="Enter title" />
          </Form.Item>

          <Space.Compact block style={{ width: "100%" }}>
            <Form.Item
              label="Time"
              name="time"
              rules={[{ required: true, message: "Please select time" }]}
              style={{ width: "50%" }}
            >
              <TimePicker format="HH:mm" style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              label="Date"
              name="date"
              rules={[{ required: true, message: "Please select date" }]}
              style={{ width: "50%" }}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Space.Compact>

          <Form.Item
            label="Amount"
            name="amount"
            initialValue={0}
            rules={[{ required: true, message: "Please enter amount" }]}
          >
            <InputNumber prefix="$" style={{ width: "100%" }} />
          </Form.Item>

          {transactionType === "expense" && (
            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true, message: "Please select category" }]}
            >
              <Select options={categories} placeholder="Select Category" />
            </Form.Item>
          )}

          <Form.Item label="Notes" name="notes">
            <Input.TextArea placeholder="Enter notes" />
          </Form.Item>

          <Form.Item
            className="form-buttons"
            style={{ marginBottom: 0, textAlign: "right" }}
          >
            <Button style={{ marginRight: 8 }} onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TransactionModal;
