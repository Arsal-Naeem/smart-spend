"use client";
import { useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "authenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading" || status !== "authenticated") {
    return null;
  }

  return (
    <>
      <Navbar />
      <main className="main">{children}</main>
    </>
  );
}
