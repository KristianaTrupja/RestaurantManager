import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/app/store";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
  prepareHeaders: (headers, { getState }) => {
    // Get token from Redux state first, then fallback to localStorage
    let token = (getState() as RootState).auth.token;
    
    // Fallback to localStorage if Redux state not yet initialized
    if (!token && typeof window !== "undefined") {
      token = localStorage.getItem("token");
    }
    
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    
    return headers;
  },
  credentials: "include",
});

// Wrapper to handle token refresh and error handling
const baseQueryWithReauth: typeof baseQuery = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  
  // If we get a 401, try to refresh the token
  if (result.error && result.error.status === 401) {
    // Clear auth state - user will need to login again
    // You could implement token refresh logic here
    api.dispatch({ type: "auth/logout" });
  }
  
  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Category", "MenuItem", "Table", "Session", "Order", "Bill"],
  endpoints: () => ({}),
});
