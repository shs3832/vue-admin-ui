export type AuthRole = 'admin' | 'manager' | 'editor'

export type AuthStatus = 'active' | 'inactive' | 'pending'

export type AuthPermissions = {
  dashboard: {
    read: boolean
  }
  users: {
    read: boolean
    create: boolean
    update: boolean
    delete: boolean
    updateStatus: boolean
    bulkUpdateStatus: boolean
  }
  products: {
    read: boolean
    create: boolean
    update: boolean
    delete: boolean
    updateStatus: boolean
    bulkUpdateStatus: boolean
  }
  notifications: {
    read: boolean
    readAll: boolean
  }
  activityLogs: {
    read: boolean
  }
}

export type AuthUser = {
  id: number
  email: string
  name: string
  role: AuthRole
  status: AuthStatus
  permissions: AuthPermissions
}

export type LoginPayload = {
  email: string
  password: string
}

export type LoginResponse = {
  data: {
    accessToken: string
    user: AuthUser
  }
}

export type MeResponse = {
  data: AuthUser
}

export type RefreshResponse = {
  data: {
    accessToken: string
    user: AuthUser
  }
}
