"use client";
import MainLayout from "@/components/MainLayout/MainLayout";
import { Button } from "antd";
import { signOut, useSession } from "next-auth/react";

export default function UserProfile() {
  const { data: session } = useSession();

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
        <h2 style={{ textAlign: "center" }}>User Profile</h2>
      </div>
      <div
        style={{
          marginTop: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {session && (
          <Button
            onClick={(e) => {
              e.preventDefault();
              handleSignOut();
            }}
            danger
          >
            Sign Out
          </Button>
        )}
      </div>
    </MainLayout>
  );
}
