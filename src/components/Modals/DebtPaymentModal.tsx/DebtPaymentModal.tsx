"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  Flex,
  Modal,
  message,
  Form,
  Segmented,
  Input,
  InputNumber,
  DatePicker,
  TimePicker,
  Space,
  Select,
  Button,
} from "antd";
import dayjs from "dayjs";
import EmptyState from "@/components/EmptyState/EmptyState";

interface DebtData {
  _id: string;
  title: string;
  totalAmount: number;
  amountPaid: number;
  amountRemaining: number;
  debtType: "given" | "taken";
  date: string;
  notes: string;
}

interface DebtPaymentModalProps {
  record: DebtData;
  onClose?: () => void;
}

const DebtPaymentButton: React.FC<DebtPaymentModalProps> = ({
  record,
  onClose,
}) => {
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(0);
  const [paymentType, setPaymentType] = useState<"return" | "add">("return");
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<
    { value: string; label: string }[]
  >([]);
  const [calculatedRemaining, setCalculatedRemaining] = useState(
    record.amountRemaining
  );

  const handlePaymentClick = () => {
    const now = dayjs();
    form.setFieldsValue({
      date: now,
      time: now,
    });
    setPaymentModalVisible(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setPaymentModalVisible(false);
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
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
        type: paymentType,
        amount: values.amount,
        date: combinedDateTime,
        notes: values.notes,
        category: values.category,
      };

      // API implementation will go here
      console.log(formattedValues);

      message.success(
        `Payment ${
          paymentType === "return" ? "returned" : "added"
        } successfully`
      );
      setPaymentModalVisible(false);
      form.resetFields();

      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      message.error("Failed to process payment");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/category");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();

        const categoryOptions = data.map((cat: any) => ({
          value: cat.category,
          label: cat.category,
        }));

        setCategories(categoryOptions);
      } catch (error) {
        console.error("Error fetching categories:", error);
        message.error("Failed to load categories");
      }
    };

    if (paymentModalVisible) {
      fetchCategories();
    }
  }, [paymentModalVisible]);

  useEffect(() => {
    if (amount > record.amountRemaining) {
      setCalculatedRemaining(0);
    } else {
      setCalculatedRemaining(record.amountRemaining - amount);
    }
  }, [form, amount, record.amountRemaining]);

  return (
    <>
      <p
        style={{ width: "100%", textAlign: "center" }}
        onClick={handlePaymentClick}
      >
        Pay
      </p>

      <Modal
        title="Debt Payment"
        open={paymentModalVisible}
        onCancel={handleCancel}
        footer={null}
        centered
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="paymentType" initialValue="return">
            <Segmented
              options={[
                { label: "Return Payment", value: "return" },
                { label: "Add to Debt", value: "add" },
              ]}
              onChange={(value) => setPaymentType(value as "return" | "add")}
              block
            />
          </Form.Item>

          {paymentType === "add" && record.debtType === "taken" && (
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: "Please enter title" }]}
            >
              <Input placeholder="Enter title" />
            </Form.Item>
          )}

          <Form.Item
            label="Amount"
            name="amount"
            initialValue={0}
            rules={[
              { required: true, message: "Please enter amount" },
              () => ({
                validator(_, value) {
                  if (
                    paymentType === "return" &&
                    value > record.amountRemaining
                  ) {
                    return Promise.reject(
                      "Amount cannot be greater than remaining amount"
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <InputNumber
              prefix="Rs."
              style={{ width: "100%" }}
              min={0}
              onChange={(value) => setAmount(value ?? 0)}
              onBlur={(e) => {
                const value = e.target.value;
                if (!value) {
                  form.setFieldsValue({ amount: 0 });
                  setAmount(0);
                }
              }}
            />
          </Form.Item>

          <Space.Compact block style={{ width: "100%" }}>
            <Form.Item
              label="Time"
              name="time"
              rules={[{ required: true, message: "Please select time" }]}
              style={{ width: "50%" }}
            >
              <TimePicker
                format="hh:mm A"
                style={{ width: "100%" }}
                use12Hours
              />
            </Form.Item>
            <Form.Item
              label="Date"
              name="date"
              rules={[{ required: true, message: "Please select date" }]}
              style={{ width: "50%" }}
            >
              <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
            </Form.Item>
          </Space.Compact>

          {paymentType === "add" && record.debtType === "taken" && (
            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true, message: "Please select category" }]}
            >
              <Select
                options={categories}
                placeholder="Select Category"
                loading={categories.length === 0}
                notFoundContent={
                  <EmptyState description="No categories found" />
                }
              />
            </Form.Item>
          )}

          <div style={{ margin: "1rem 0 1.5rem 0" }}>
            <Card>
              <Flex align="center" justify="space-between">
                <p>Remaining Amount</p>
                <h3>Rs. {calculatedRemaining}</h3>
              </Flex>
            </Card>
          </div>

          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Space>
              <Button onClick={handleCancel} loading={loading}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {paymentType === "return" ? "Return Payment" : "Add to Debt"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default DebtPaymentButton;
