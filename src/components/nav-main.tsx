"use client";

import { IconType } from "react-icons";

import {
  SidebarGroup,
  SidebarMenu,

  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils"

import { useQueryState } from "nuqs";
export function NavMain({
  items,
}: {
  items: {
    icon: IconType;
    name: string;
    url: string;
  }[];
}) {
    const [path] = useQueryState('page')

  
  return (
    <SidebarGroup className="text-background border-t pt-12 ">
      <SidebarMenu className="space-y-1">
        {items.map((item) => (
          <SidebarMenuItem key={item.name} className="  " >

            <Link href={item.url} className={cn(" py-3 px-5  h-full flex space-x-2 border border-primary hover:border-accent  ", item.url.includes(path || 'home') && " bg-accent text-secondary-foreground ")}>
              {item.icon && <item.icon className="size-6" />}
              <Label className="">{item.name}</Label>
            </Link>

          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
