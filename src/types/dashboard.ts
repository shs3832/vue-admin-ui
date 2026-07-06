export type DashboardSummary = {
  users: {
    total: number
    active: number
  }
  products: {
    total: number
    selling: number
    soldout: number
  }
  orders: {
    today: number
    weekly: number
  }
  revenue: {
    today: number
    monthly: number
  }
}

export type SummaryCardItem = {
  title: string
  value: string | number
  description: string
}

export type DashboardSummaryResponse = {
  data: DashboardSummary
}
