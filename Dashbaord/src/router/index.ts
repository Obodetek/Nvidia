import Dashboard from '../views/Dashboard.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { title: 'Login' }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { title: 'Dashboard' }
  },
  {
    path: '/devices',
    name: 'Devices',
    component: () => import('../views/Devices.vue'),
    meta: { title: 'Devices' }
  },
  {
    path: '/ai-insights',
    name: 'AIInsights',
    component: () => import('../views/AIInsights.vue'),
    meta: { title: 'AI Insights' }
  },
  {
    path: '/alerts',
    name: 'Alerts',
    component: () => import('../views/Alerts.vue'),
    meta: { title: 'Alerts' }
  },
  {
    path: '/analytics',
    name: 'Analytics',
    component: () => import('../views/Analytics.vue'),
    meta: { title: 'Analytics' }
  },
 
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: { title: 'Page Not Found' }
  }
]

import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Global auth guard
router.beforeEach((to, _from, next) => {
  const isLoggedIn = localStorage.getItem('auth') === 'true'

  if (!isLoggedIn && to.path !== '/login') {
    next('/login')  // redirect to login if not authenticated
  } else if (isLoggedIn && to.path === '/login') {
    next('/') // redirect logged-in users away from login
  } else {
    next()
  }
})


export default router
