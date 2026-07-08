export type AuthRole = 'admin' | 'manager' | 'editor'

export type AuthStatus = 'active' | 'inactive' | 'pending'

export type AuthPermissions = Record<string, boolean>

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
