
const routes = [
  {
    path: '/',
    component: () => import('layouts/Default.vue'),
    children: [{ path: '', component: () => import('components/Notifications.vue') }],
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/statistics',
    component: () => import('layouts/Default.vue'),
    children: [{ path: '', component: () => import('components/Statistics.vue') }],
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('pages/Login.vue')
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('layouts/Default.vue'),
    children: [{ path: '', component: () => import('pages/Error404.vue') }]
  })
}

export default routes
