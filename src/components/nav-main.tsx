"use client";

import { IconType } from "react-icons";

import {
  SidebarGroup,
  SidebarMenu,

  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";


import { cn } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";




export function NavMain({
  items,
}: {
  items: {
    icon: IconType;
    name: string;
    url: string;
  }[];
}) {
  const { setOpenMobile } = useSidebar()
  const router = useRouter()
  const paths = usePathname().split('/')
  const page = paths[2]
  const handleNavigation = (id: string) => {
    toast.loading('Please Wait...')
    if (paths.length > 3) {

      router.back()
    } else {
      router.replace(`/dashboard/${id}`)

    }
    setOpenMobile(false)
  }

  return (
    <SidebarGroup className="text-background border-t pt-12 ">
      <SidebarMenu className="space-y-1">
        {items.map((item) => (
          <SidebarMenuItem key={item.name} className="  " >

            <button onClick={() => {
              handleNavigation(item.url)
            }} className={cn(" py-3 px-5 cursor-pointer w-full h-full flex space-x-2 border border-primary hover:border-accent  ", page?.includes(item.url) && " bg-accent text-secondary-foreground ")}>
              {item.icon && <item.icon className="size-6" />}
              <p className="">{item.name}</p>
            </button>

          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
