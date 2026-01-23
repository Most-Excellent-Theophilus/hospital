
import { useQuery } from "@tanstack/react-query"
import { logKeys } from "./preop.keys"
import { logRepository } from "./preop.repository"



export const useLogs = () =>
    useQuery({
        queryKey: logKeys.list(),
        queryFn:  logRepository.getAll,
    })

export const useLog = ({ id, }: { id: string, auth: string }) =>
    useQuery({
        queryKey: logKeys.detail(id),
        queryFn: () => logRepository.getById({ id }),
        enabled: !!id,
    })
