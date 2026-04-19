import api from "./api";

const ServiceUser = {
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  infoById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
};

export default ServiceUser;
