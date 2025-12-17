import { AppSidebarProcider } from "@/components/app-sidebar"
import { Suspense} from "react"
const DashBoardLayout = ({children}:{children: React.ReactNode})=>{
    return  <Suspense fallback={<p> Loading ...</p>} >  <AppSidebarProcider> {children}</AppSidebarProcider></Suspense>
}

export default DashBoardLayout