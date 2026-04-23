import api from "./api";

const ServiceVaccine = {
  listAll: async () => {
    const response = await api.get("/vacinas");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/vacinas/${id}`);
    return response.data;
  },

  register: async (vaccineData) => {
    const response = await api.post("/vacinas", vaccineData);
    return response.data;
  },

  vaccineIsApplied: async (id) => {
    const response = await api.post(`/vacinas/isApplied/${id}`)
    return response.data
  },

  delete: async (id) => {
    await api.delete(`/vacinas/${id}`);
  },
};

export default ServiceVaccine;
