"use client"
import { SidebarTrigger } from "../ui/sidebar";

import { Button } from "@/components/ui/button"
import {
  DashBoardLinksType,
  linksIconMap,
} from "@/components/app-sidebar/config";
import { usePathname, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react";


import { capitalizeFirstLetter, cn } from "@/lib/utils";


import { useSharedState } from "@/components/providers/dashboard-context"
import Link from "next/link";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
const DashBoardHeader = () => {
  const [ids] = useQueryState('id', parseAsArrayOf(parseAsString).withDefault([]))
  const { value: { firstName, } } = useSharedState();

  const page = usePathname().split('/')


  const router = useRouter()
  const { icon: Icon, name: title } = linksIconMap[page[2] as DashBoardLinksType] || linksIconMap['home'];
  const opts = ['delete', 'create', 'update', 'view']
  const option = opts?.filter((f) => page.includes(f))
  return (
    <header suppressHydrationWarning className={cn("flex justify-between h-16 px-5 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12", page.length > 3 && " sticky top-0 z-50 bg-muted ")}>
        <SidebarTrigger className="sm:hidden" />
      <Button onClick={() => router.back()} variant={'secondary'} size={'icon-lg'} className="hidden sm:flex"  > <ArrowLeft />  </Button>

      <div className="flex space-x-2 items-center flex-1">



        <Icon className="size-7 text-primary" />
        <h1 className="text-sm sm:text-2xl font-bold"suppressHydrationWarning>{option[0] && <span suppressHydrationWarning>{ capitalizeFirstLetter(option[0])} : {ids?.length}</span>} {title} </h1>
      </div>
      <div className="flex flex-row-reverse">           <Button variant="link"> <Link href={'/dashboard/account'}>Dr. {capitalizeFirstLetter(firstName)}</Link></Button>
      </div>
    </header>
  );
};

export default DashBoardHeader;
