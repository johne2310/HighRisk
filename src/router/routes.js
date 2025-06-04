// export default routes

const routes = [
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('pages/LoginPage.vue')
      },
      {
        path: 'reset-password',
        name: 'reset-password',
        component: () => import('pages/ResetPasswordPage.vue')
      }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),

    children: [
      {
        path: 'dashboard',
        component: () => import('pages/IndexPage.vue')
      },
      {
        path: 'survey',
        component: () => import('pages/SurveyPage.vue')
      },
      {
        path: 'surveys',
        component: () => import('pages/SurveysListPage.vue')
      },
      {
        path: 'surveys/:id',
        component: () => import('pages/SurveyPage.vue')
      },
      {
        path: 'high-risk',
        component: () => import('pages/HighRiskPage.vue')
      },
      {
        path: 'settings',
        component: () => import('pages/SettingsPage.vue')
      },
      {
        path: 'help',
        component: () => import('pages/HelpPage.vue')
      },
      {
        path: 'change-password',
        name: 'change-password',
        component: () => import('pages/ChangePasswordPage.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
