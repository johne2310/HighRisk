import { defineBoot } from '#q-app/wrappers'
import { useAuthStore } from '/src/stores/auth-store'

export default defineBoot(({ router }) => {
  router.beforeEach((to) => {
    const authStore = useAuthStore()

    if (to.path === '/auth/reset-password') {
      return true
    }
    if (to.path === '/change-password') {
      console.log('change password from route guard')
      return true
    }
    //test if user is not logged in and attempting to access other pages
    if (to.path !== '/auth/login' && !authStore.userDetails.id) {
      return '/auth/login'
    }
    //test if user is logged in and trying to get to login in page
    if (to.path === '/auth/login' && authStore.userDetails.id) {
      return false
    }
  })
})
