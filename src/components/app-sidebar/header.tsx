"use client"
import { SidebarTrigger } from "../ui/sidebar";

import { Button } from "@/components/ui/button"
import {
  DashBoardLinksType,
  linksIconMap,
} from "@/components/app-sidebar/config";
import { usePathname, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react";


import { capitalizeFirstLetter } from "@/lib/utils";


import { logoutNow } from "@/features/auth/auth.actions";
import { useSharedState } from "@/components/providers/dashboard-context"
import Link from "next/link";
const DashBoardHeader = () => {

  const { value: {  firstName,  }} = useSharedState();

  const page = usePathname().split('/')


  const router = useRouter()
  const { icon: Icon, name: title } = linksIconMap[page[2] as DashBoardLinksType] || linksIconMap['home'];
  const logout = () => {
    logoutNow()
  }
  return (
    <header className="flex justify-between h-16 px-5 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex space-x-2 items-center">
        <SidebarTrigger className="sm:hidden" />

        {page.length > 3 && <Button onClick={() => router.back()} variant={'secondary'}  > <ArrowLeft />  Back </Button>}


        <Icon className="size-7 text-primary" />
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      <div className="flex flex-row-reverse">           <Button variant="link"> <Link href={'/dashboard/account'}>Dr. {capitalizeFirstLetter(firstName)}</Link></Button>
      </div>
    </header>
  );
};

export default DashBoardHeader;
