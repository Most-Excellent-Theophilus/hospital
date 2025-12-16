"use client";

import { IconType } from "react-icons";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";


export function NavMain({
  items,
}: {
  items: {
    icon: IconType;
    name: string;
    url: string;
  }[];
}) {
  return (
    <SidebarGroup className="text-background">
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.name}  className="h-10  ">
            <SidebarMenuButton tooltip={item.name}  asChild className="h-full" >
              <Link href={item.url} className="h-full">
                {item.icon && <item.icon className="size-20"  />}
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
