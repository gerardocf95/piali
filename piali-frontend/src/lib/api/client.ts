import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
});

// Interceptor: adjunta el JWT automáticamente (como un OncePerRequestFilter)
apiClient.interceptors.request.use((config) => {
  // localStorage solo existe en el navegador, no en el servidor
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default apiClient;