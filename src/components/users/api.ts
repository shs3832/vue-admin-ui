export const fetchUsersApi = async (accessToken: string) => {
  const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/users`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response
}
