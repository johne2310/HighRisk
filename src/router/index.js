import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  // Navigation guard to check authentication
  Router.beforeEach(async (to, from, next) => {
    // Import auth store dynamically to avoid circular dependency
    const authStoreModule = await import('src/stores/auth-store')
    const { useAuthStore } = authStoreModule
    const authStore = useAuthStore()

    // Check if the route requires authentication
    if (to.matched.some((record) => record.meta.requiresAuth)) {
      // If auth store is still loading, wait for it
      if (authStore.loading) {
        // This will be handled by App.vue's loading state
        next()
        return
      }

      // Check if user is authenticated using the auth store
      if (!authStore.isAuthenticated) {
        // User is not authenticated, redirect to login
        console.log('user is not authenticated: ')
        next({ path: '/login' })
      } else {
        // User is authenticated, proceed
        next()
      }
    } else {
      // Route does not require authentication
      next()
    }
  })

  return Router
})
