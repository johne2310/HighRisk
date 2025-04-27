const routes = [
  {
    // path: '/login',
    // component: () => import('pages/LoginPage.vue'),

    path: '/login',
    component: () => import('layouts/AuthLayout.vue'),
    children: [{ path: '', component: () => import('pages/LoginPage.vue') }],

    // Redirect to home if already authenticated
    beforeEnter: async (to, from, next) => {
      console.log('Route guard execution', to.path, from.path)

      const authStoreModule = await import('src/stores/auth-store')
      const { useAuthStore } = authStoreModule
      const authStore = useAuthStore()
      authStore.signOut()
      if (authStore.isAuthenticated) {
        next('/')
      } else {
        next()
      }
    },
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'survey', component: () => import('pages/SurveyPage.vue') },
      { path: 'surveys', component: () => import('pages/SurveysListPage.vue') },
      { path: 'surveys/:id', component: () => import('pages/SurveyPage.vue') },
      { path: 'high-risk', component: () => import('pages/HighRiskPage.vue') },
      { path: 'settings', component: () => import('pages/SettingsPage.vue') },
      { path: 'help', component: () => import('pages/HelpPage.vue') },
    ],
  },

  // Redirect root to login if not authenticated
  // {
  //   path: '',
  //   redirect: async () => {
  //     const authStoreModule = await import('src/stores/auth-store')
  //     const { useAuthStore } = authStoreModule
  //     const authStore = useAuthStore()
  //
  //     return authStore.isAuthenticated ? '/' : '/login'
  //   },
  // },
  {
    path: '',
    redirect: '/login', // Default redirect
    beforeEnter: async (to, from, next) => {
      const authStoreModule = await import('src/stores/auth-store')
      const { useAuthStore } = authStoreModule
      const authStore = useAuthStore()

      if (authStore.isAuthenticated && !authStore.loading) {
        next('/')
      } else {
        next('/login')
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
