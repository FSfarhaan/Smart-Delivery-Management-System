"use client"; // ✅ Required for Context in Next.js App Router
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Partner {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
  currentLoad: number;
  areas: string[];
  shift: { start: string; end: string };
  metrics: { rating: number; completedOrders: number; cancelledOrders: number };
}

interface PartnerContextType {
  partners: Partner[];
  loading: boolean;
  fetchPartners: () => void;
}

const PartnerContext = createContext<PartnerContextType | undefined>(undefined);

export const PartnerProvider = ({ children }: { children: ReactNode }) => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch partners from API
  const fetchPartners = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/partners");
      const data = await res.json();
      setPartners(data);
    } catch (error) {
      console.error("❌ Error fetching partners:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch partners when component mounts
  useEffect(() => {
    fetchPartners();
  }, []);

  return (
    <PartnerContext.Provider value={{ partners, loading, fetchPartners }}>
      {children}
    </PartnerContext.Provider>
  );
};

// Custom hook to use PartnerContext
export const usePartnerContext = () => {
  const context = useContext(PartnerContext);
  if (!context) throw new Error("usePartnerContext must be used within a PartnerProvider");
  return context;
};
