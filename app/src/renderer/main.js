import Vue from 'vue'
import iView from 'iview'
import VCharts from 'v-charts'
import 'iview/dist/styles/iview.css'

import App from './App'
import router from './router'
import store from './store'
import extend from './extend'

Vue.use(extend)
Vue.use(iView)
Vue.use(VCharts)
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  next()
})

router.afterEach((to, from, next) => {
  iView.LoadingBar.finish()
})

localStorage.setItem('username', 'water')
localStorage.setItem('password', '123456')

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
