import { api } from "@/lib/api"
import { User } from "./users.types"

export const usersRepository = {
  getAll: async (): Promise<User[]> => {
    const { data } = await api.get("/users")
    return data
  },

  getById: async (id: string): Promise<User> => {
    const { data } = await api.get(`/users/${id}`)
    return data
  },

  create: async (payload: Partial<User>): Promise<User> => {
    const { data } = await api.post("/users", payload)
    return data
  },

  update: async (id: string, payload: Partial<User>): Promise<User> => {
    const { data } = await api.put(`/users/${id}`, payload)
    return data
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`)
  },
}
