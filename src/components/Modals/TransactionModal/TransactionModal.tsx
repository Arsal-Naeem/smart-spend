"use client";
import {
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Select,
  App,
  Segmented,
  TimePicker,
  Space,
} from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import styles from "./TransactionModal.module.css";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

interface TransactionModalProps {
  isEdit?: boolean;
  record?: {
    _id: string;
    date: string;
    type: "income" | "expense";
    title: string;
    amount: number;
    category: string;
    notes?: string;
  };
  onClose?: () => void;
}

// Add interface for category data
interface CategoryOption {
  value: string;
  label: string;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  isEdit = false,
  record,
  onClose,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState("expense");
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { message } = App.useApp();
  const [categories, setCategories] = useState<CategoryOption[]>([]);

  useEffect(() => {
    if (isEdit && record) {
      const datetime = dayjs(record.date);
      const normalizedType = record.type.toLowerCase() as "income" | "expense";
      form.setFieldsValue({
        type: normalizedType,
        title: record.title,
        amount: record.amount,
        date: datetime,
        time: datetime,
        category: record.category,
        notes: record.notes,
      });
      setTransactionType(normalizedType);
    }
  }, [isEdit, record, form, isModalOpen]);

  // Add useEffect to fetch categories when modal opens
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/category");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        
        // Transform the category data into the format needed for Select
        const categoryOptions = data.map((cat: any) => ({
          value: cat.category,
          label: cat.category
        }));
        
        setCategories(categoryOptions);
      } catch (error) {
        console.error("Error fetching categories:", error);
        message.error("Failed to load categories");
      }
    };

    if (isModalOpen) {
      fetchCategories();
    }
  }, [isModalOpen, message]);

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
    setTransactionType("expense");
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
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
        type: values.type,
        title: values.title,
        amount: values.amount,
        date: combinedDateTime,
        category: values.category,
        notes: values.notes,
      };

      if (isEdit && record) {
        const response = await fetch(`/api/transactions`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            _id: record._id,
            ...formattedValues,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update transaction");
        }

        // message.success("Transaction updated successfully");
      } else {
        // Create new transaction
        const response = await fetch("/api/transactions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedValues),
        });

        if (!response.ok) {
          throw new Error("Failed to create transaction");
        }

        // message.success("Transaction added successfully");
      }

      setIsModalOpen(false);
      form.resetFields();
      setTransactionType("expense");

      if (onClose) {
        onClose();
        console.log("is it hitting");
      }
    } catch (error) {
      console.error("Error creating/updating transaction:", error);
      // message.error(
      //   error instanceof Error ? error.message : "An error occurred"
      // );
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (value: string) => {
    setTransactionType(value);
  };

  return (
    <>
      {isEdit ? (
        <Button
          type="text"
          icon={<EditOutlined style={{ color: "#fff", fontSize: "18px" }} />}
          onClick={showModal}
        />
      ) : (
        <div className={styles.floatingButton}>
          <Button
            type="primary"
            icon={<PlusOutlined style={{ color: "#121212" }} />}
            onClick={showModal}
            shape="circle"
            size="large"
          />
        </div>
      )}

      <Modal
        title={isEdit ? "Edit Transaction" : "Add Transaction"}
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
              value={transactionType}
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
            <InputNumber prefix="$" style={{ width: "100%" }} min={0} />
          </Form.Item>

          {transactionType === "expense" && (
            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true, message: "Please select category" }]}
            >
              <Select 
                options={categories} 
                placeholder="Select Category"
                loading={categories.length === 0}
              />
            </Form.Item>
          )}

          <Form.Item label="Notes" name="notes">
            <Input.TextArea placeholder="Enter notes" />
          </Form.Item>

          <Form.Item
            className="form-buttons"
            style={{ marginBottom: 0, textAlign: "right" }}
          >
            <Button
              style={{ marginRight: 8 }}
              loading={loading}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button type="primary" loading={loading} htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TransactionModal;
