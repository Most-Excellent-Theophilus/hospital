"use client"
import { SessionUser } from "@/features/auth/auth.session";
import { createContext, useContext,  } from "react";

type SharedState = {
    value: SessionUser;

};

const SharedContext = createContext<SharedState | null>(null);

export const SharedProvider = ({ children, value }: { children: React.ReactNode, value: SessionUser }) => {
    return (
        <SharedContext.Provider value={{ value }}>
            {children}
        </SharedContext.Provider>
    );
};

export const useSharedState = () => {
    const ctx = useContext(SharedContext);
    if (!ctx) throw new Error("useSharedState must be used within provider");
    return ctx;
};
