"use client";
import * as React from "react";
// import { Switch } from "@/components/ui/switch";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { NavMain } from "@/components/nav-main";
import Logo from "@/components/logo"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger, Sidebar, SidebarContent, SidebarHeader
} from "@/components/ui/sidebar";
import { linksIconMap } from "./config";
import { Label } from "../ui/label";
import DashBoardHeader from "./header";
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
              <div className="flex w-full justify-start space-x-4"><Logo className="text-background " />
                {open && <Label className='text-background'>Hospital</Label>}

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
