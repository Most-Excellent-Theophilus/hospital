import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";
import { useSearchParams } from "next/navigation";
import {
  DashBoardLinksType,
  linksIconMap,
} from "@/components/app-sidebar/config";
const DashBoardHeader = () => {
  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const { icon: Icon, name: title } = linksIconMap[page as DashBoardLinksType] || linksIconMap['home'];

  return (
    <header className="flex h-16 px-5 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
< SidebarTrigger className="sm:hidden" />
      <Icon className="size-7 text-primary" />
      <h1>{title}</h1>
    </header>
  );
};

export default DashBoardHeader;
