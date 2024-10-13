import axios from "axios";

const apiRequest = axios.create({
  baseURL: "https://real-estate-uysi.vercel.app/api",
  withCredentials: true, // Include cookies in requests
});

export default apiRequest;
