import { defineBoot } from '#q-app/wrappers'
import { useAuthStore } from '/src/stores/auth-store'

export default defineBoot(({ router }) => {
  router.beforeEach((to) => {
    const authStore = useAuthStore()

    if (to.path === '/reset-password') {
      return true
    } else if (to.path === '/change-password') {
      return true
    }
    //test if user is not logged in and attempting to access other pages
    else if (to.path !== '/login' && !authStore.userDetails.id) {
      return '/login'
    }
    //test if user is logged in and trying to get to login in page
    else if (to.path === '/login' && authStore.userDetails.id) {
      return false
    }
  })
})
