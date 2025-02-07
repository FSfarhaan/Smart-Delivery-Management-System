"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Order {
  _id: string;
  orderNumber: string;
  customer: { name: string; phone: string; address: string };
  area: string;
  items: { name: string; quantity: number; price: number }[];
  status: "pending" | "assigned" | "picked" | "delivered";
  assignedTo?: string;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface OrderContextType {
  orders: Order[];
  loading: boolean;
  fetchOrders: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch orders from API
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("❌ Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders when component mounts
  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <OrderContext.Provider value={{ orders, loading, fetchOrders }}>
      {children}
    </OrderContext.Provider>
  );
};

// Custom hook to use OrderContext
export const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error("useOrderContext must be used within an OrderProvider");
  return context;
};
