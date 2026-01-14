export const preopKeys = {
  all: ["preopKeys"] as const,
  list: () => [...preopKeys.all, "list"] as const,
  detail: (id: string) => [...preopKeys.all, "detail", id] as const,
}
