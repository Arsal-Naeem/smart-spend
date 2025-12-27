"use client";
import MainLayout from "@/components/MainLayout/MainLayout";
import { Button, Form, Input, Select, Card, message, Divider } from "antd";
import { useCurrency } from "@/hooks/useCurrency";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const CURRENCIES = [
  { value: "USD", label: "USD - US Dollar" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "JPY", label: "JPY - Japanese Yen" },
  { value: "AUD", label: "AUD - Australian Dollar" },
  { value: "CAD", label: "CAD - Canadian Dollar" },
  { value: "CHF", label: "CHF - Swiss Franc" },
  { value: "CNY", label: "CNY - Chinese Yuan" },
  { value: "INR", label: "INR - Indian Rupee" },
  { value: "PKR", label: "PKR - Pakistani Rupee" },
];

export default function UserProfile() {
  const { data: session } = useSession();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const { setCurrency } = useCurrency();
  const [fetchingUser, setFetchingUser] = useState(true);

  useEffect(() => {
    if (session?.user?.email) {
      fetchUserData();
    }
  }, [session]);

  const fetchUserData = async () => {
    try {
      setFetchingUser(true);
      const response = await fetch(
        `/api/users?userId=${session?.user?.userId}`
      );
      if (response.ok) {
        const userData = await response.json();
        form.setFieldsValue({
          name: userData.name,
          currency: userData.currency || "USD",
        });
      }
    } catch (error) {
      message.error("Failed to fetch user data");
    } finally {
      setFetchingUser(false);
    }
  };

  const handleUpdateProfile = async (values: {
    name: string;
    currency: string;
  }) => {
    try {
      setLoading(true);
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session?.user?.userId,
          name: values.name,
          currency: values.currency,
        }),
      });

      setCurrency(values.currency);
      localStorage.setItem("userCurrency", values.currency);

      if (response.ok) {
        message.success("Profile updated successfully!");
      } else {
        message.error("Failed to update profile");
      }
    } catch (error) {
      message.error("An error occurred while updating profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <MainLayout>
      <div
        style={{
          padding: "16px",
          color: "var(--color-accent)",
        }}
      >
        <h2 style={{ fontSize: "24px", textAlign: "center" }}>Settings</h2>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Card
          style={{ width: "100%", maxWidth: "600px" }}
          loading={fetchingUser}
        >
          <h3 style={{ marginBottom: "24px" }}>Profile Settings</h3>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpdateProfile}
            autoComplete="off"
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[
                { required: true, message: "Please enter your name" },
                { min: 2, message: "Name must be at least 2 characters" },
              ]}
            >
              <Input placeholder="Enter your name" />
            </Form.Item>

            <Form.Item
              label="Currency"
              name="currency"
              rules={[{ required: true, message: "Please select a currency" }]}
            >
              <Select
                placeholder="Select your preferred currency"
                options={CURRENCIES}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                block
              >
                Save Changes
              </Button>
            </Form.Item>
          </Form>

          <Divider />

          <div style={{ textAlign: "center" }}>
            <h3 style={{ marginBottom: "16px" }}>Account Actions</h3>
            {session && (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  handleSignOut();
                }}
                danger
                size="large"
              >
                Sign Out
              </Button>
            )}
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
