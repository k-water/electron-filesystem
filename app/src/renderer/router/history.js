/**
 * router hook
 */

export default {
  install (router) {
    router.beforeEach((to, from, next) => {
      if (to.meta.auth) {
        next({
          path: '/login',
          query: {
            redirect: to.fullPath
          }
        })
      } else {
        next()
      }
    })
  }
}
