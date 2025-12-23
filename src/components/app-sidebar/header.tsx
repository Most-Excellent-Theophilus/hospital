"use client"
import { SidebarTrigger } from "../ui/sidebar";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button"
import {
  DashBoardLinksType,
  linksIconMap,
} from "@/components/app-sidebar/config";
import { useRouter } from "next/navigation"
import { Bell, ArrowLeft } from "lucide-react";
const DashBoardHeader = () => {
  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const router = useRouter()
  const { icon: Icon, name: title } = linksIconMap[page as DashBoardLinksType] || linksIconMap['home'];

  return (
    <header className="flex justify-between h-16 px-5 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex space-x-2 items-center">
        <Button onClick={()=> router.back()} variant={'outline'} size="icon" className="rounded-full"> <ArrowLeft/>  </Button>
         < SidebarTrigger className="sm:hidden" />

        <Icon className="size-7 text-primary" />
        <h1 className="text-2xl font-bold">{title}</h1></div>
      <div className="flex flex-row-reverse"> <Button variant="outline" size={'icon-lg'}  className="rounded-full"><Bell /></Button> <Button size={'lg'} variant={'link'}> Dr. Me</Button></div>
    </header>
  );
};

export default DashBoardHeader;
