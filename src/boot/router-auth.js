import { defineBoot } from '#q-app/wrappers'
import { useAuthStore } from '/src/stores/auth-store'

export default defineBoot(({ router }) => {
  router.beforeEach((to) => {
    const authStore = useAuthStore()
    if (to.path !== '/login' && !authStore.userDetails.id) {
      // router.push('/login')
      return '/login'
    }
    if (to.path === '/login' && authStore.userDetails.id) {
      return false
    }
    // Now you need to add your authentication logic here, like calling an API endpoint
  })
})
