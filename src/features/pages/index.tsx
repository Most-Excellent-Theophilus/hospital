"use client"
import { isValidAction, isValidModule, Module } from "@/components/app-sidebar/config";
import LoadingPage from "@/components/loadingpage";
import NotFoundPage from "@/components/not-found";

import { lazy, Suspense } from "react";

const ModuleGate = ({ md, }: { md: Module, }) => {
    if (!isValidModule(md)) return <NotFoundPage />

    const Comp = lazy(() => import(`@/features/pages/${md}`))
    if (!Comp) {
        return <NotFoundPage />
    }

    return <Suspense fallback={<LoadingPage />}> <Comp /></Suspense>;
}

const ResourceGate = ({ md, smd }: { md: Module, smd: string }) => {
     if (!isValidModule(md) || !isValidAction(smd)) return <NotFoundPage />
 
    const Comp = lazy(() => import(`@/features/pages/${md}/${smd}`))
    if (!Comp) {
        return <NotFoundPage />
    }

    return <Suspense fallback={<LoadingPage />}> <Comp /></Suspense>;
}


export { ModuleGate, ResourceGate };