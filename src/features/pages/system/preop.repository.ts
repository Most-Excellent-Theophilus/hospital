import { api } from "@/lib/api";
import { LogsShema, } from "@/lib/firebase/firebase.types";

type PreOpWithPath = LogsShema
export const logRepository = {
    getAll: async (): Promise<PreOpWithPath[]> => {
        const { data } = await api.get("/dblogs");
        return data as PreOpWithPath[];
    },

    getById: async ({  id }: { id: string, }): Promise<PreOpWithPath> => {
        const { data } = await api.get(`/dblogs/${id}`);
        return data as PreOpWithPath;
    },
}