import Vue from 'vue'
import Router from 'vue-router'

import routes from './routes'
// import history from './history'

const router = new Router({
  routes
})

Vue.use(Router)
// history.install(router)

export default router
