import { useMutation, useQueryClient } from "@tanstack/react-query"
import { usersRepository } from "./users.repository"
import { usersKeys } from "./users.keys"

export const useCreateUser = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: usersRepository.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: usersKeys.list() })
    },
  })
}
