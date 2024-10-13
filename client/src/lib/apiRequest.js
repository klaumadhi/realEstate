import axios from "axios";
const apiRequest = axios.create({
  baseURL: "https://realestate-bx27.onrender.com/api",
  withCredentials: true, // Include cookies in requests
});
export default apiRequest;
