import api from "./api";

const ServiceOccurrences = {
  create: async () => {
    const response = await api.post("/occurrences");
    return response.data;
  },

  getByIdPet: async (id) => {
    const response = await api.get(`/occurrences/pet/${id}`);
    return response.data;
  },

  update: async (id, occurrence) => {
    const response = await api.put(`/occurrences/${id}`, occurrence);
    return response.data;
  },

  register: async (petData) => {
    const response = await api.post("/occurrences", petData);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/pets/${id}`);
  },
};

export default ServiceOccurrences;
