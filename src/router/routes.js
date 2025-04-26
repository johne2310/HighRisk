const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'survey', component: () => import('pages/SurveyPage.vue') },
      { path: 'surveys', component: () => import('pages/SurveysListPage.vue') },
      { path: 'surveys/:id', component: () => import('pages/SurveyPage.vue') },
      { path: 'high-risk', component: () => import('pages/HighRiskPage.vue') },
      { path: 'reports', component: () => import('pages/ReportsPage.vue') },
      { path: 'settings', component: () => import('pages/SettingsPage.vue') },
      { path: 'help', component: () => import('pages/HelpPage.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
