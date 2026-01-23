import { useQuery } from "@tanstack/react-query"
import { patirntRepository as usersRepository } from "./patient.repository"
import { usersKeys } from "./patient.keys"

export const usePatients = () =>
  useQuery({
    queryKey: usersKeys.list(),
    queryFn: usersRepository.getAll,
  })

export const usePatient = ({ id,  }: { id: string, }) =>
  useQuery({
    queryKey: usersKeys.detail(id),
    queryFn: () => usersRepository.getById({ id}),
    enabled: !!id,
  })
export const usePatientIds = ({ id, }: { id: string, }) =>
  useQuery({
    queryKey: usersKeys.detail(id),
    queryFn: () => usersRepository.getByIds({ id, }),
    enabled: !!id,
  })
