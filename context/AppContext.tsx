"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { fetchOrders } from "@/app/api/order"
import { fetchPartners } from "@/app/api/partner";
import { fetchAssignments } from "@/app/api/assignments";

const AppContext = createContext<any>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState([]);
  const [partners, setPartners] = useState([]);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    fetchOrders().then(setOrders);
    fetchPartners().then(setPartners);
    fetchAssignments().then(setAssignments);
  }, []);

  return (
    <AppContext.Provider value={{ orders, setOrders, partners, setPartners, assignments, setAssignments }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
