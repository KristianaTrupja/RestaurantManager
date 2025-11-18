export function handleApiError(error: any) {
  if (error?.status === 0) {
    return "Server not reachable";
  }
  if (error?.status === 401) {
    return "Unauthorized";
  }

  if (error?.status === 403) {
    return "Forbidden";
  }
  if (error?.status === 404) {
    return "Item not found";
  }

  return error?.data?.message || "An unexpected error occurred";
}
