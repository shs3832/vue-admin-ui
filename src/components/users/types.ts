export type IUser = {
  id: number
  name: string
  email: string
  role: 'admin' | 'manager' | 'editor'
  status: 'active' | 'inactive' | 'pending'
  department: string | null
  createdAt: string
  updatedAt: string
  lastLoginAt: string | null
}

export type IUsersResponse = {
  items: IUser[]
  pagination: PaginationMeta
}

export type ApiErrorResponse = {
  message: string
}

export type UsersQuery = {
  keyword?: string
  role?: IUser['role'] | ''
  status?: IUser['status'] | ''
  page: number
  limit: number
}

export type PaginationMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
}
