import api from "./api";

export const getNearbyClinics = async (lat, lng) => {
  const response = await api.get(`/clinics/nearby?lat=${lat}&lng=${lng}`);
  return response.data;
};
