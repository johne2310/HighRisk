// export default routes

const routes = [
  {
    path: '/login',
    component: () => import('layouts/AuthLayout.vue'),
    children: [{ path: '', component: () => import('pages/LoginPage.vue') }],

    // Redirect to home if already authenticated
    beforeEnter: async (to, from, next) => {
      console.log('Route guard execution login', to.path, from.path)

      const authStoreModule = await import('src/stores/auth-store')
      const { useAuthStore } = authStoreModule
      const authStore = useAuthStore()
      if (authStore.isAuthenticated) {
        console.log('authenticated: ')
        next('/dashboard')
      } else {
        console.log('not authenticated: ')
        next()
      }
    },
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),

    children: [
      {
        path: 'dashboard',
        component: () => import('pages/IndexPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'survey',
        component: () => import('pages/SurveyPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'surveys',
        component: () => import('pages/SurveysListPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'surveys/:id',
        component: () => import('pages/SurveyPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'high-risk',
        component: () => import('pages/HighRiskPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'settings',
        component: () => import('pages/SettingsPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'help',
        component: () => import('pages/HelpPage.vue'),
        meta: { requiresAuth: true },
      },

    ],
  },
  {
    path: '/',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: 'reset-password',
        component: () => import('pages/ResetPasswordPage.vue'),
        meta: { requiresAuth: false },
      },
      {
        path: 'change-password',
        component: () => import('pages/ChangePasswordPage.vue'),

      },

    ],
  },

  {
    path: '',
    redirect: '/login', // Default redirect
    beforeEnter: async (to, from, next) => {
      console.log('Route guard execution empty path', to.path, from.path)
      const authStoreModule = await import('src/stores/auth-store')
      const { useAuthStore } = authStoreModule
      const authStore = useAuthStore()

      if (authStore.isAuthenticated && !authStore.loading) {
        console.log('authenticated: ')
        next('/dashboard')
      } else {
        next()
      }
    },
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
