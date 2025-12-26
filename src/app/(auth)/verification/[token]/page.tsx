import { createCacheActions } from "@/lib/firebase/cached.database"

import { UserMinus2Icon as IconFolderCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import { redirect } from "next/navigation"
import { db as database } from "@/lib/firebase/database"
import CreatePasswordPage from "@/components/form/auth/create-password"
import Link from "next/link"

const Page = async ({ params }: { params: Promise<{ token: string }> }) => {
    const { token } = await params
    const db = await createCacheActions('tokens')
    const data = await db.search('token', token)
    const user = data.data?.[0]
    if (!user) redirect('/login')

    await database.delete({ path: 'tokens', id: user.id })

    const isExpired = new Date(user.expires as Date) < new Date();

    if (isExpired) {
        return <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <IconFolderCode />
                </EmptyMedia>
                <EmptyTitle>Token Has Expired</EmptyTitle>
                <EmptyDescription>
                    Click on the login button below to regenarate token, Or Contact Admin
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <div className="flex gap-2">
                    <Button asChild> <Link href={'/login'}>Login</Link></Button>

                </div>
            </EmptyContent>

        </Empty>
    }
 

    return <CreatePasswordPage email={ user.email} />
}
export default Page