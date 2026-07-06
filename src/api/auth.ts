export const fetchMeApi = async (accessToken: string) => {
  const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response
}
