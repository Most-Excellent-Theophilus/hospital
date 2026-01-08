import { AppSidebarProcider } from "@/components/app-sidebar"
import { SharedProvider } from "@/components/providers/dashboard-context"
import { getSession, SessionUser } from "@/features/auth/auth.session"

import { redirect } from "next/navigation"

const DashBoardLayout = async ({ children }: { children: React.ReactNode }) => {
    const session = await getSession()
    if (!session.email) {
        redirect('/login')
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { save, updateConfig, destroy, ...rest } = session


    return <SharedProvider value={rest as SessionUser}>  <AppSidebarProcider >  {children} </AppSidebarProcider></SharedProvider>
}

export default DashBoardLayout