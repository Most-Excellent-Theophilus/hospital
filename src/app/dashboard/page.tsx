

import ACCOUNT from "@/app/dashboard/_pages/account/index"
import HOME from "@/app/dashboard/_pages/home"
import POSTOP from "@/app/dashboard/_pages/postOp"
import PREOP from "@/app/dashboard/_pages/preOp"
import STS from "@/app/dashboard/_pages/system"
import DOCTORS from "@/app/dashboard/_pages/users"
import { DashBoardLinksType } from "@/components/app-sidebar/config"

type PageProps = {
  searchParams: Promise<{
    page?: string
    action?: string
    id?: string
  }>
}

const PageMap: Record<
  DashBoardLinksType,
  React.ComponentType<{ action?: string, id?: string }>
> = {
  account: ACCOUNT,
  home: HOME,
  postOp: POSTOP,
  preOp: PREOP,
  system: STS,
  users: DOCTORS,
}
export default async function Page({ searchParams }: PageProps) {

  const { action, id, page } = await searchParams


  const PageComponent = PageMap[page as DashBoardLinksType||'home']

  return <PageComponent action={action||"view"} id={id||''} />
}
