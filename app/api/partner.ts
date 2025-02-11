import axios from "axios";



// ✅ Fetch all partners
export const fetchPartners = async () => {
  const response = await axios.get(`/api/partners`);
  return response.data;
};

// ✅ Add a new partner
export const addPartner = async (partnerData: any) => {
  const response = await axios.post(`/api/partners`, partnerData);
  return response.data;
};

// ✅ Update partner details
export const updatePartner = async (partnerId: string, updateData: any) => {
  const response = await axios.put(`/api/partners/${partnerId}`, updateData);
  return response.data;
};

export const getPartnersArea = async () => {
  const response = await axios.get(`/api/partners/getAreas`);
  return response.data;
}