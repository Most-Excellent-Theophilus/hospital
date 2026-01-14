export const postOpKeys = {
    all: ["ppostOpKeys"] as const,
    list: () => [...postOpKeys.all, "list"] as const,
    detail: (id: string) => [...postOpKeys.all, "detail", id] as const,
}
