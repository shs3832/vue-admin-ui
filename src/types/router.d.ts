import 'vue-router'
import type { ActiveMenu } from './navigation'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    description?: string
    activeMenu?: ActiveMenu
  }
}
