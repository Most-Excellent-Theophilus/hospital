import { AppSidebarProcider } from "@/components/app-sidebar"

const DashBoardLayout = ({children}:{children: React.ReactNode})=>{
    return <AppSidebarProcider> {children}</AppSidebarProcider>
}

export default DashBoardLayout