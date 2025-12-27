import { useMutation, useQueryClient } from "@tanstack/react-query"
import {  patirntRepository as usersRepository } from "./patient.repository"
import { usersKeys } from "./patient.keys"

export const useCreatePatient = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: usersRepository.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: usersKeys.list() })
    },
  })
}

