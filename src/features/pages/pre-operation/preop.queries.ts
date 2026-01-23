
import { useQuery } from "@tanstack/react-query"
import { preopKeys } from "./preop.keys"
import { preopRepository } from "./preop.repository"


export const usePreops = () =>
    useQuery({
        queryKey: preopKeys.list(),
        queryFn: preopRepository.getAll,
    })

export const usePreop = ({ id, }: { id: string, }) =>
    useQuery({
        queryKey: preopKeys.detail(id),
        queryFn: () => preopRepository.getById({ id, }),
        enabled: !!id,
    })
export const usePreopIds = ({ id,  }: { id: string,  }) =>
    useQuery({
        queryKey: preopKeys.detail(id),

        queryFn: () => preopRepository.getByIds({ id, }),
        enabled: !!id,
    })
