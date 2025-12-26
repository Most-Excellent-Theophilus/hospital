"use client";

import { IconType } from "react-icons";

import {
  SidebarGroup,
  SidebarMenu,

  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { Label } from "./ui/label";
import { cn } from "@/lib/utils"
import { useNavigationVariables } from "@/hooks/url-hooks";



export function NavMain({
  items,
}: {
  items: {
    icon: IconType;
    name: string;
    url: string;
  }[];
}) {


  const { setPage, page } = useNavigationVariables()

  return (
    <SidebarGroup className="text-background border-t pt-12 ">
      <SidebarMenu className="space-y-1">
        {items.map((item) => (
          <SidebarMenuItem key={item.name} className="  " >

            <button onClick={() => {
              setPage(item.url)

            }} className={cn(" py-3 px-5 w-full h-full flex space-x-2 border border-primary hover:border-accent  cursor-pointer", item.url.includes(page) && " bg-accent text-secondary-foreground ")}>
              {item.icon && <item.icon className="size-6" />}
              <Label className="">{item.name}</Label>
            </button>

          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
