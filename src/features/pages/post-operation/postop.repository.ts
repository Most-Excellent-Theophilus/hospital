import { api } from "@/lib/api";
import { PostopSchema } from "@/lib/firebase/firebase.types";

export type PreOpWithPath = PostopSchema & { path: string }
export const postpRepository = {
    getAll: async (): Promise<PreOpWithPath[]> => {
        const { data } = await api.get("/postop");
        return data as PreOpWithPath[];
    },

    getById: async ({  id }: { id: string }): Promise<PreOpWithPath> => {
        const { data } = await api.get(`/postop/${id}`);
        return data as PreOpWithPath;
    },
    getByIds: async ({  id }: { id: string }): Promise<PreOpWithPath[]> => {
        const { data } = await api.get(`/postop/${id}`);
        return data as PreOpWithPath[];
    },
}