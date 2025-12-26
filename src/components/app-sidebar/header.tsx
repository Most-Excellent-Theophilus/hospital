"use client"
import { SidebarTrigger } from "../ui/sidebar";

import { Button } from "@/components/ui/button"
import {
  DashBoardLinksType,
  linksIconMap,
} from "@/components/app-sidebar/config";
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react";
import { User } from "@/features/users/users.types";
import { useQueryState } from "nuqs";
import { capitalizeFirstLetter } from "@/lib/utils";
const DashBoardHeader = ({ user }: { user: Omit<User, "password"> }) => {


  const [action] = useQueryState('action')
  const [page] = useQueryState('page')
  const router = useRouter()
  const { icon: Icon, name: title } = linksIconMap[page as DashBoardLinksType] || linksIconMap['home'];

  return (
    <header className="flex justify-between h-16 px-5 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex space-x-2 items-center">
        < SidebarTrigger className="sm:hidden" />
        <Button onClick={() => router.back()} variant={'outline'} size="icon" className="rounded-full"> <ArrowLeft />  </Button>

        <Icon className="size-7 text-primary" />
        <h1 className="text-2xl font-bold">{title}</h1>
        </div>
      <div className="flex flex-row-reverse">  <Button size={'lg'} variant={'link'}> Dr. {capitalizeFirstLetter(user.firstName)}</Button></div>
    </header>
  );
};

export default DashBoardHeader;
