import axios from "axios";



// ✅ Fetch all assignments
export const fetchAssignments = async () => {
  const response = await axios.get(`/api/assignments`);
  return response.data;
};

// ✅ Fetch assignment metrics
export const fetchAssignmentMetrics = async () => {
  const response = await axios.get(`/api/assignments/metrics`);
  return response.data;
};

export const createManually = async (data: any) => {
  const response  = await axios.post(`/api/assignments/manuallyAssign`, data);
  return response.data;
}