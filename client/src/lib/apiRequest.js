import axios from "axios";
const apiRequest = axios.create({
  baseURL: "/api",
  withCredentials: true, // Include cookies in requests
});
export default apiRequest;
