import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost/GiftHub/backend/",
  withCredentials: true,
});

export default api;
