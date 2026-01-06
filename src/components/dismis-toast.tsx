"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function DismissToastOnRouteChange() {
  const location = usePathname();

  useEffect(() => {
    toast.dismiss();
  }, [location]);

  return null;
}
