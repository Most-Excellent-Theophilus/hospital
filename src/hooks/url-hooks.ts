"use client";

import { useEffect } from "react";
import { useQueryState } from "nuqs";

export const useNavigationVariables = () => {
    const [page, setPage] = useQueryState("page", {
        defaultValue: "home",
        shallow: false,
        history: "push",
    });

    const [action, setAction] = useQueryState("act", {
        defaultValue: '',
    });

    const [status, setStatus] = useQueryState("status", {
        defaultValue: '',
    });

    useEffect(() => {
        if (action) setAction(null, { history: "replace" });
        if (status) setStatus(null, { history: "replace" });
    }, [page, action, status, setAction, setStatus]);

    return {
        page,
        setPage,
        action,
        setAction,
        status,
        setStatus,
    };
};
