import Vue from 'vue'
import Router from 'vue-router'

import routes from './routes'
// import history from './history'

const router = new Router({
  mode: 'hash',
  base: process.env.NODE_ENV === 'development' ? '/' : '/app/',
  routes
})

Vue.use(Router)
// history.install(router)

export default router
