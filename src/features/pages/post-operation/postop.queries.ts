
import { useQuery } from "@tanstack/react-query"
import { postOpKeys } from "./postop.keys"
import { postpRepository } from "./postop.repository"



export const usePostOps = () =>
    useQuery({
        queryKey: postOpKeys.list(),
        queryFn: postpRepository.getAll,
    })

export const usePostOp = ({ id, }: { id: string, auth: string }) =>
    useQuery({
        queryKey: postOpKeys.detail(id),
        queryFn: () => postpRepository.getById({ id }),
        enabled: !!id,
    })
export const usePostOpIds = ({ id, }: { id: string,}) =>
    useQuery({
        queryKey: postOpKeys.detail(id),

        queryFn: () => postpRepository.getByIds({ id }),
        enabled: !!id,
    })
