import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://192.168.162.209:3000";

// ✅ Fetch all assignments
export const fetchAssignments = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/assignments`);
  return response.data;
};

// ✅ Fetch assignment metrics
export const fetchAssignmentMetrics = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/assignments/metrics`);
  return response.data;
};

export const createManually = async (data: any) => {
  const response  = await axios.post(`${API_BASE_URL}/api/assignments/manuallyAssign`, data);
  return response.data;
}