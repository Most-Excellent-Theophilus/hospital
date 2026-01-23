"use client";

import * as React from "react";

import { cn } from "@/lib/utils"
import { NavMain } from "@/components/nav-main";
import Logo from "@/components/logo"
import {
  SidebarInset,
  SidebarProvider,
  Sidebar, SidebarContent, SidebarHeader,

} from "@/components/ui/sidebar";

import { linksIconMap } from "./config";

import DashBoardHeader from "./header";
import { useSharedState } from "../providers/dashboard-context";
import { setAuthToken } from "@/lib/api";



const data = {
  navMain: Object.values(linksIconMap).map((item) => item),
};
export function AppSidebarProcider({ children, ...props }: React.ComponentProps<typeof Sidebar> & { children?: React.ReactNode, }) {

  const { value } = useSharedState()
  React.useEffect(() => {
    const token = value?.password as string | undefined;
    if (token) {
      setAuthToken(token);
    }
  }, []);


  return (
    <SidebarProvider >
      <Sidebar collapsible="icon" {...props}>
        <SidebarContent className="bg-primary">
          <div >
            <SidebarHeader className={cn("flex  rounded-xl  ")}  >
              <div className="flex w-full justify-between ">
                <div className="flex w-full justify-start space-x-4 items-center"><Logo className="p-6 bg-background" />
                </div>



              </div>
            </SidebarHeader>

          </div>


          <NavMain items={data.navMain} />


        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <DashBoardHeader />
        <div className=" h-full  px-5"> {children}</div>

      </SidebarInset>
    </SidebarProvider>
  );
}
