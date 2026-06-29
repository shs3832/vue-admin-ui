import AboutView from '@/views/AboutView.vue'
import HomeView from '@/views/HomeView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomeView,
      name: 'home',
    },
    {
      path: '/about',
      component: AboutView,
      name: 'about',
    },
  ],
})

export default router
