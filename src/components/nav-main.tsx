"use client";

import { IconType } from "react-icons";

import {
  SidebarGroup,
  SidebarMenu,

  SidebarMenuItem,
} from "@/components/ui/sidebar";


import { cn } from "@/lib/utils"
import Link from "next/link";
import { usePathname } from "next/navigation";




export function NavMain({
  items,
}: {
  items: {
    icon: IconType;
    name: string;
    url: string;
  }[];
}) {

  const page = usePathname().split('/')[2]


  return (
    <SidebarGroup className="text-background border-t pt-12 ">
      <SidebarMenu className="space-y-1">
        {items.map((item) => (
          <SidebarMenuItem key={item.name} className="  " >

            <Link href={`/dashboard/${item.url}`} className={cn(" py-3 px-5 w-full h-full flex space-x-2 border border-primary hover:border-accent  cursor-pointer", page?.includes(item.url) && " bg-accent text-secondary-foreground ")}>
              {item.icon && <item.icon className="size-6" />}
              <p className="">{item.name}</p>
            </Link>

          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
