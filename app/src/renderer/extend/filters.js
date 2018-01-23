import Vue from 'vue'

const filters = {
  toMem (mem) {
    var G = 0
    var M = 0
    var KB = 0
    mem > (1 << 30) && (G = (mem / (1 << 30)).toFixed(2))
    mem > (1 << 20) && (mem < (1 << 30)) && (M = (mem / (1 << 20)).toFixed(2))
    mem > (1 << 10) && (mem > (1 << 20)) && (KB = (mem / (1 << 10)).toFixed(2))
    return G > 0 ? G + 'G' : M > 0 ? M + 'M' : KB > 0 ? KB + 'KB' : mem + 'B'
  }
}
export default {
  install () {
    Object.keys(filters).forEach(key => {
      Vue.filter(key, filters[key])
    })
  }
}

export function toMem (mem) {
  var G = 0
  var M = 0
  var KB = 0
  mem > (1 << 30) && (G = (mem / (1 << 30)).toFixed(2))
  mem > (1 << 20) && (mem < (1 << 30)) && (M = (mem / (1 << 20)).toFixed(2))
  mem > (1 << 10) && (mem > (1 << 20)) && (KB = (mem / (1 << 10)).toFixed(2))
  return G > 0 ? G + 'G' : M > 0 ? M + 'M' : KB > 0 ? KB + 'KB' : mem + 'B'
}
