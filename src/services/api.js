import axios from "axios";

const api = axios.create({
  // Colocar a url que estiver no teu pc.
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
