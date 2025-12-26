"use client";

import { useEffect } from "react";
import { useQueryState } from "nuqs";

const useNavigationVariables = () => {
    const [page, setPage] = useQueryState("page", {
        defaultValue: "home",
        shallow: false,
        history: "push",
    });

    const [action, setAction] = useQueryState("action", {
        defaultValue: "",

    });

    const [status, setStatus] = useQueryState("status", {
        defaultValue: "",
    });

    /* ---------------------------------- */
    /* Reset action + status when page changes */
    /* ---------------------------------- */

    useEffect(() => {
        setAction("", { history: "replace" });
        setStatus("", { history: "replace" });
    }, [page, setAction, setStatus]);

    return {
        page,
        setPage,
        action,
        setAction,
        status,
        setStatus,
    };
};

export { useNavigationVariables };
