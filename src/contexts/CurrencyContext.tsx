"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface CurrencyContextType {
  currency: string;
  setCurrency: (currency: string) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session } = useSession();
  const [currency, setCurrencyState] = useState<string>("USD");

  useEffect(() => {
    // Try to get currency from localStorage first
    const storedCurrency = localStorage.getItem("userCurrency");
    if (storedCurrency) {
      setCurrencyState(storedCurrency);
    }

    // Fetch user currency from API if user is logged in
    if (session?.user?.userId) {
      fetch(`/api/users?userId=${session.user.userId}`)
        .then((res) => res.json())
        .then((user) => {
          if (user?.currency) {
            setCurrencyState(user.currency);
            localStorage.setItem("userCurrency", user.currency);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch user currency:", error);
        });
    }
  }, [session?.user?.userId]);

  const setCurrency = (newCurrency: string) => {
    setCurrencyState(newCurrency);
    localStorage.setItem("userCurrency", newCurrency);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};
