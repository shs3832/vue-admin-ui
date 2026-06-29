import AppShell from '@/components/layout/AppShell.vue'
import DashboardView from '@/views/DashboardView.vue'
import ProductsView from '@/views/ProductsView.vue'
import UsersView from '@/views/UsersView.vue'

import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: AppShell,
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
          path: 'products',
          component: ProductsView,
          name: 'products',
        },
      ],
      redirect: { name: 'dashboard' },
    },
  ],
})

export default router
