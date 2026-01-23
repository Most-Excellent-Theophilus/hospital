"use client";

import { toast } from "sonner";
import { api } from "./api";


let interceptorId: number | null = null;

export function registerAxiosInterceptors(
 
) {
  if (interceptorId !== null) return;

  interceptorId = api.interceptors.response.use(
    (response) => response,
    async (error) => {
      // Network error
      if (!error.response) {
        toast.error("Network error. Please check your connection.", {
          duration: Infinity,
          dismissible: true,
        });
        return Promise.reject(error);
      }

      const status = error.response.status;
      const message =
        error.response.data?.message ||
        error.response.data?.error ||
        "Something went wrong";

      if (status === 401) {
        toast.error("Session expired. Please log in again.");
        window.location.assign("/login");
      } else if (status === 403) {
        toast.error("You are not allowed to perform this action");
      } else if (status >= 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error(message);
      }

      return Promise.reject(error);
    }
  );
}
