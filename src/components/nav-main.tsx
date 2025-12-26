"use client";

import { IconType } from "react-icons";

import {
  SidebarGroup,
  SidebarMenu,

  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { Label } from "./ui/label";
import { cn } from "@/lib/utils"


import useCreateAction from "@/hooks/use-create-action";
export function NavMain({
  items,
}: {
  items: {
    icon: IconType;
    name: string;
    url: string;
  }[];
}) {
  const [path, setPath] = useCreateAction({ key: 'page', defaultValue: 'home' })
  const [, setAct] = useCreateAction({ key: 'action', defaultValue: '' })


  return (
    <SidebarGroup className="text-background border-t pt-12 ">
      <SidebarMenu className="space-y-1">
        {items.map((item) => (
          <SidebarMenuItem key={item.name} className="  " >

            <button onClick={() => {
              setPath(item.url)
              setAct('')
            }} className={cn(" py-3 px-5 w-full h-full flex space-x-2 border border-primary hover:border-accent  cursor-pointer", item.url.includes(path) && " bg-accent text-secondary-foreground ")}>
              {item.icon && <item.icon className="size-6" />}
              <Label className="">{item.name}</Label>
            </button>

          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
