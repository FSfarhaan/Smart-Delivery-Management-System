"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Assignment {
  _id: string;
  orderId: string;
  partnerId: string;
  timestamp: Date;
  status: "success" | "failed";
  reason?: string;
}

interface AssignmentContextType {
  assignments: Assignment[];
  loading: boolean;
  fetchAssignments: () => void;
}

const AssignmentContext = createContext<AssignmentContextType | undefined>(undefined);

export const AssignmentProvider = ({ children }: { children: ReactNode }) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch assignments from API
  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/assignments");
      const data = await res.json();
      setAssignments(data);
    } catch (error) {
      console.error("❌ Error fetching assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch assignments when component mounts
  useEffect(() => {
    fetchAssignments();
  }, []);

  return (
    <AssignmentContext.Provider value={{ assignments, loading, fetchAssignments }}>
      {children}
    </AssignmentContext.Provider>
  );
};

// Custom hook to use AssignmentContext
export const useAssignmentContext = () => {
  const context = useContext(AssignmentContext);
  if (!context) throw new Error("useAssignmentContext must be used within an AssignmentProvider");
  return context;
};
