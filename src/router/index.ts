import AppShell from '@/components/layout/AppShell.vue'
import DashboardView from '@/views/DashboardView.vue'
import LoginView from '@/views/LoginView.vue'
import ProductsView from '@/views/products/ProductsView.vue'
import UsersView from '@/views/users/UsersView.vue'
import { useAuthStore } from '@/stores/auth'
import { createRouter, createWebHistory } from 'vue-router'
import UserCreateView from '@/views/users/create/UserCreateView.vue'
import UserEditView from '@/views/users/edit/UserEditView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: AppShell,
      redirect: { name: 'dashboard' },
      // 관리자 레이아웃 아래의 route는 로그인한 사용자만 접근한다.
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          component: DashboardView,
          name: 'dashboard',
        },
        {
          path: 'users',
          component: UsersView,
          name: 'users',
        },
        {
          path: 'users/create',
          component: UserCreateView,
          name: 'userCreate',
        },
        {
          path: 'users/:id/edit',
          component: UserEditView,
          name: 'userEdit',
        },
        {
          path: 'products',
          component: ProductsView,
          name: 'products',
        },
      ],
    },
    {
      path: '/login',
      component: LoginView,
      name: 'login',
    },
  ],
})

// 페이지 이동 전에 실행되는 전역 guard.
// to는 이동하려는 목적지 route이며, meta.requiresAuth로 보호 페이지 여부를 확인한다.
router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth) {
    await authStore.checkAuth()

    if (!authStore.isLoggedIn) {
      return { name: 'login' }
    }
  }

  if (to.name === 'login') {
    await authStore.checkAuth()
    if (authStore.isLoggedIn) {
      return { name: 'dashboard' }
    }
  }
})

export default router
