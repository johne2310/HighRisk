import { defineBoot } from '#q-app/wrappers'
import { useAuthStore } from '/src/stores/auth-store'

export default defineBoot(({ router }) => {
  router.beforeEach((to) => {
    const authStore = useAuthStore()

    //test if user is not logged in and attempting to access other pages
    if (to.path !== '/login' && !authStore.userDetails.id) {
      return '/login'
    }
    //test if user is logged in and trying to get to login in page
    if (to.path === '/login' && authStore.userDetails.id) {
      return false
    }
  })
})
