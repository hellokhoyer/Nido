import axios from "axios";

import { env } from "@/lib/env";

// Creates a base axios instance that connects to your Express server
const api = axios.create({
  baseURL: env.BASE_URL,
  withCredentials: false, // Enable cookies for authentication
});

export default api;
