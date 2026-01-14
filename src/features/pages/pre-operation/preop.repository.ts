import { api } from "@/lib/api";
import { PreopSchema } from "@/lib/firebase/firebase.types";

export type PreOpWithPath = PreopSchema & { path: string }
export const preopRepository = {
    getAll: async (): Promise<PreOpWithPath[]> => {
        const { data } = await api.get("/preop");
        return data as PreOpWithPath[];
    },

    getById: async (id: string): Promise<PreOpWithPath> => {
        const { data } = await api.get(`/preop/${id}`);
        return data as PreOpWithPath;
    },
    getByIds: async (id: string): Promise<PreOpWithPath[]> => {
        const { data } = await api.get(`/preop/${id}`);
        return data as PreOpWithPath[];
    },
}