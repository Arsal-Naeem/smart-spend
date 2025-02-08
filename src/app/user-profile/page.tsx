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
      <p>User Profile</p>
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
    </MainLayout>
  );
}
