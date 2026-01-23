import { useQuery } from "@tanstack/react-query"
import { usersRepository } from "./users.repository"
import { usersKeys } from "./users.keys"

export const useUsers = () =>
  useQuery({
    queryKey: usersKeys.list(),
    queryFn: usersRepository.getAll,
  })

export const useUser = ({ id, }: { id: string, }) =>
  useQuery({
    queryKey: usersKeys.detail(id),
    queryFn: () => usersRepository.getById({ id, }),
    enabled: !!id,
  })
