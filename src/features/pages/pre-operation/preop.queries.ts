import { useQuery } from "@tanstack/react-query"
import { preOpRepository as usersRepository } from "./preop.repository"
import { usersKeys } from "./preop.keys"

export const usePatientsCommand = () =>
  useQuery({
    queryKey: usersKeys.list(),
    queryFn: usersRepository.getAllCommand,
  })

export const usePatient = (id: string) =>
  useQuery({
    queryKey: usersKeys.detail(id),
    queryFn: () => usersRepository.getById(id),
    enabled: !!id,
  })
