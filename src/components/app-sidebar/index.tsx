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
import { X} from "lucide-react"
import { linksIconMap } from "./config";
import { Label } from "../ui/label";
import DashBoardHeader from "./header";
import { Button } from "../ui/button";
const data = {
  navMain: Object.values(linksIconMap).map((item) => item),
};
export function AppSidebarProcider({ children, ...props }: React.ComponentProps<typeof Sidebar> & { children?: React.ReactNode }) {
  const [open, setOpen] = React.useState(true);

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <Sidebar collapsible="icon" {...props}>
        <SidebarContent className="bg-primary">
          <div >
            <SidebarHeader className={cn("flex  rounded-xl mt-4 mb-3 border mx-0.5", open && "mx-3")}  >
              <div className="flex w-full justify-between space-x-4">
                <div className="flex w-full justify-start space-x-4 items-center"><Logo className="text-background " onClick={()=> setOpen(!open)} />
                  {open && <Label className='text-background font-bold tracking-wide text-xl'>Hospital</Label>}</div>

                <Button size={'icon'} onClick={()=> setOpen(!open)}><X/></Button>

              </div>
            </SidebarHeader>

          </div>
          <NavMain items={data.navMain} />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <DashBoardHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
