import { createContext, useContext, useState, ReactNode } from "react";

export interface PaymentData {
  amount: string;
  name: string;
}

interface PaymentContextType {
  payment: PaymentData | null;
  setPayment: (data: PaymentData) => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider = ({ children }: { children: ReactNode }) => {
  const [payment, setPayment] = useState<PaymentData | null>(null);

  return (
    <PaymentContext.Provider value={{ payment, setPayment }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const ctx = useContext(PaymentContext);
  if (!ctx) {
    throw new Error("usePayment must be used inside PaymentProvider");
  }
  return ctx;
};
