import { AppSidebarProcider } from "@/components/app-sidebar"
import { getSession } from "@/features/auth/auth.session"
import { User } from "@/features/users/users.types"
import { redirect } from "next/navigation"

const DashBoardLayout = async ({ children }: { children: React.ReactNode }) => {
    const session = await getSession()
    if (!session.email) {
        redirect('/login')
    }
    const { middleName, doctorId, customGender, verified, userType, lastName, gender, firstName, email } = session
    return <AppSidebarProcider user={{ middleName, doctorId, customGender, verified, userType, lastName, gender, firstName, email } as User}> {children} </AppSidebarProcider>
}

export default DashBoardLayout