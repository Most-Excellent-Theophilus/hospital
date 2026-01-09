import { useMutation, useQueryClient } from "@tanstack/react-query"
import {  preOpRepository as usersRepository } from "./preop.repository"
import { usersKeys } from "./preop.keys"

export const useCreatePatient = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: usersRepository.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: usersKeys.list() })
    },
  })
}

