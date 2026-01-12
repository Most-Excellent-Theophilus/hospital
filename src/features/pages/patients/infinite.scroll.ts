import { api } from "@/lib/api";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";

export function usePatientsInfinite({
    global="",
    filters,
    sorting,
    limit = 25,
}: {
    global?: string;
    filters: ColumnFiltersState;
    sorting: SortingState;
    limit?: number;
}) {
    return useInfiniteQuery({
        queryKey: ["patients-search-scroll", global, filters, sorting, limit],
        queryFn: async ({ pageParam = null }) => {
            const params = new URLSearchParams({
                limit: String(limit),
                q: global ?? "",
                filters: JSON.stringify(filters),
                sort: JSON.stringify(sorting),
            });

            if (pageParam) params.set("cursor", pageParam);

            const { data } = await api.get(`/patients/search?${params}`);
            return data;
        },
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
        initialPageParam: null,
    });
}
