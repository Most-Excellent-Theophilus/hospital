export const logKeys = {
  all: ["systemLogs"] as const,
  list: () => [...logKeys.all, "list"] as const,
  detail: (id: string) => [...logKeys.all, "detail", id] as const,
}
