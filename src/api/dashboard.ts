import type { DashboardSummaryResponse } from '@/types/dashboard'
import { apiClient } from './client'

export const fetchDashboardSummaryApi = async (accessToken: string) => {
  return apiClient<DashboardSummaryResponse>(`/dashboard/summary`, { accessToken })
}
