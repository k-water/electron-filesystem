import Vue from 'vue'
import filters from './filters'

export default {
  install () {
    Vue.use(filters)
  }
}
