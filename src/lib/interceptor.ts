"use client";



import { toast } from "sonner";
import { api } from "./api";

let isInterceptorRegistered = false;

export function registerAxiosInterceptors() {
  // const 
  // const [, setQuery] = useQueryState('res')
  if (isInterceptorRegistered) return;
  isInterceptorRegistered = true;

  api.interceptors.response.use(
    (response) =>{
      
      
      return response},
   async (error) => {
      // setQuery(JSON.stringify(error))
      // Network error (offline, DNS, CORS)
      if (!error.response) {
        toast.error("Network error. Please check your connection.", {
          duration: Infinity,
          dismissible: true
        });
        return Promise.reject(error);
      }

      const status = error.response.status;
      const message =
        error.response.data?.message ||
        error.response.data?.error ||
        "Something went wrong";

      // Match behavior like NetworkListener
      if (status === 401) {

        toast.error("Invalid credentials or session expired");
    
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
