import AppShell from '@/components/layout/AppShell.vue'
import DashboardView from '@/views/DashboardView.vue'
import LoginView from '@/views/LoginView.vue'
import ProductsView from '@/views/products/ProductsView.vue'
import UsersView from '@/views/users/UsersView.vue'
import { useAuthStore } from '@/stores/auth'
import { createRouter, createWebHistory } from 'vue-router'
import UserCreateView from '@/views/users/create/UserCreateView.vue'
import UserEditView from '@/views/users/edit/UserEditView.vue'
import ProductCreateView from '@/views/products/create/ProductCreateView.vue'
import ProductsEditView from '@/views/products/edit/ProductsEditView.vue'
import NotificationsView from '@/views/notifications/NotificationsView.vue'
import ActivityLogsView from '@/views/activity-logs/ActivityLogsView.vue'
import ComponentPreview from '@/component-preview/ComponentPreview.vue'

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
          meta: {
            title: '대시보드',
            description: '주문, 상품, 매출 현황을 요약해 확인합니다.',
          },
        },
        {
          path: 'users',
          component: UsersView,
          name: 'users',
          meta: {
            title: '사용자 관리',
            description: '관리자 계정과 사용자 상태를 조회하고 관리합니다.',
          },
        },
        {
          path: 'users/create',
          component: UserCreateView,
          name: 'userCreate',
          meta: {
            title: '사용자 생성',
            description: '신규 관리자 계정을 생성합니다.',
          },
        },
        {
          path: 'users/:id/edit',
          component: UserEditView,
          name: 'userEdit',
          meta: {
            title: '사용자 수정',
            description: '관리자 계정 정보를 수정합니다.',
          },
        },
        {
          path: 'products',
          component: ProductsView,
          name: 'products',
          meta: {
            title: '상품 관리',
            description: '상품 목록과 판매 상태를 조회하고 관리합니다.',
          },
        },
        {
          path: 'products/create',
          component: ProductCreateView,
          name: 'productCreate',
          meta: {
            title: '상품 생성',
            description: '운영 상품 정보를 등록합니다.',
          },
        },
        {
          path: 'products/:id/edit',
          component: ProductsEditView,
          name: 'productEdit',
          meta: {
            title: '상품 수정',
            description: '운영 상품 정보를 수정합니다.',
          },
        },
        {
          path: 'notifications',
          component: NotificationsView,
          name: 'notifications',
          meta: {
            title: '알림 관리',
            description: '운영 알림 목록과 읽음 상태를 확인합니다.',
          },
        },
        {
          path: 'activity-logs',
          component: ActivityLogsView,
          name: 'activityLogs',
          meta: {
            title: '활동 로그',
            description: '관리자 작업 이력과 주요 변경 내역을 확인합니다.',
          },
        },
        {
          path: 'component-preview',
          component: ComponentPreview,
          name: 'componentPreview',
          meta: {
            title: '컴포넌트 미리보기',
            description: '공통 UI 컴포넌트의 상태와 스타일을 확인합니다.',
          },
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
  const pageTitle = to.meta.title
  document.title = pageTitle ? `${pageTitle} | Vue Admin UI` : 'Vue Admin UI'

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
