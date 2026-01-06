"use client"

import { Button } from "@/components/ui/button"
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import Logo, { LogoIcon } from "@/components/logo"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function NotFoundPage() {
    const router = useRouter()
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <LogoIcon className="fill-primary " />

                </EmptyMedia>
                <EmptyTitle>Page Not Found</EmptyTitle>
                <EmptyDescription>
                    The Resource Your are looking for was not found.
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <div className="flex gap-2">
                    <Button ><Link href={'/'}>Go Home</Link> </Button>
                    <Button variant="outline" onClick={() => router.back()}> <p>Go Back</p> </Button>
                </div>
            </EmptyContent>

        </Empty>
    )
}
