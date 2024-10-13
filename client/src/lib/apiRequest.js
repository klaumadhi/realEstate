const apiRequest = axios.create({
  baseURL: "https://real-estate-uysi.vercel.app/api", // Ensure /api is added to match your routes
  withCredentials: true, // Include cookies
});
