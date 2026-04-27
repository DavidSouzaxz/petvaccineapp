import api from "./api";

const ServicePet = {
  listAll: async () => {
    const response = await api.get("/pets");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/pets/${id}`);
    return response.data;
  },

  getPetsByUser: async (id) => {
    const response = await api.get(`/pets/usuario/${id}`)
    return response.data
  },

  update: async (id, petData) => {
    const response = await api.put(`/pets/${id}`, petData);
    return response.data;
  },

  register: async (petData) => {
    const response = await api.post("/pets", petData);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/pets/${id}`);
  },
};

export default ServicePet;
