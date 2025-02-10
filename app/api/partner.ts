import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

// ✅ Fetch all partners
export const fetchPartners = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/partners`);
  return response.data;
};

// ✅ Add a new partner
export const addPartner = async (partnerData: any) => {
  const response = await axios.post(`${API_BASE_URL}/api/partners`, partnerData);
  return response.data;
};

// ✅ Update partner details
export const updatePartner = async (partnerId: string, updateData: any) => {
  const response = await axios.put(`${API_BASE_URL}/api/partners/${partnerId}`, updateData);
  return response.data;
};

export const getPartnersArea = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/partners/getAreas`);
  return response.data;
}