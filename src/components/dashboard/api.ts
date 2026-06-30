export const fetchDashboardSummaryApi = async (accessToken: string) => {
  const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/dashboard/summary`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  return response
}
