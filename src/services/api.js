import axios from "axios";

const api = axios.create({
  // Colocar a url que estiver no teu pc.
  baseURL: "http://localhost:8080/api" || process.env.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
