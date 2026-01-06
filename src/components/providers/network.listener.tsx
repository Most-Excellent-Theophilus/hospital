"use client";

import { useNetwork } from "@/hooks/use-network";

import { useEffect } from "react";
import { toast } from "sonner";


export function NetworkListener() {
  const { isOnline } = useNetwork();

  useEffect(() => {
    if (!isOnline) {
      toast.error("You are offline", { duration: Infinity, dismissible: false });
    } else {
      toast.dismiss();
      // toast.success("Back online");

      // 🔄 Refetch all queries when back online

    }
  }, [isOnline]);

  return null;
}
