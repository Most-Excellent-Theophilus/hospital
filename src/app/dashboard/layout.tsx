import { AppSidebarProcider } from "@/components/app-sidebar"
import { getSession, SessionUser } from "@/features/auth/auth.session"

import { redirect } from "next/navigation"

const DashBoardLayout = async ({ children }: { children: React.ReactNode }) => {
    const session = await getSession()
    if (!session.email) {
        redirect('/login')
    }
    const { middleName, doctorId, customGender, verified, userType, lastName, gender, firstName, email, browser, browserVersion, city, continent, country, dateOfBirth, host, deviceType, ip, isTouch, timezone, screenWidth, vendor, screenHeight, region, osVersion, os, model, lon, lat, } = session
    return <AppSidebarProcider user={{ middleName, doctorId, customGender, verified, userType, lastName, gender, firstName, email, browser, browserVersion, city, continent, country, dateOfBirth, host, deviceType, ip, isTouch, timezone, screenWidth, vendor, screenHeight, region, osVersion, os, model, lon, lat, } as SessionUser}> {children} </AppSidebarProcider>
}

export default DashBoardLayout