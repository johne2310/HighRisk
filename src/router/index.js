import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'
import supabase from 'src/stores/supabase/index'

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

  // Handle magic link authentication
  Router.beforeEach(async (to, from, next) => {
    // Check if the URL contains Supabase auth parameters
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const queryParams = new URLSearchParams(window.location.search)

    // Look for auth parameters in both hash and query parameters
    const accessToken = hashParams.get('access_token') || queryParams.get('access_token')
    const refreshToken = hashParams.get('refresh_token') || queryParams.get('refresh_token')
    const type = hashParams.get('type') || queryParams.get('type')

    // If we have auth parameters, handle the magic link authentication
    if (accessToken && refreshToken && type === 'magiclink') {
      try {
        // Set the session in Supabase
        await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        })

        // Clear the URL parameters to avoid issues with refreshing
        if (window.history.replaceState) {
          window.history.replaceState({}, document.title, window.location.pathname + '#/dashboard')
        }

        // Redirect to dashboard
        next({ path: '/dashboard', replace: true })
        return
      } catch (error) {
        console.error('Error setting session from magic link:', error)
        next({ path: '/login' })
        return
      }
    }

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
