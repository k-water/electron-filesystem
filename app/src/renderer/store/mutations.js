import * as types from './mutation-types'

const mutations = {
  [types.GET_FOLDER_INFO] (state, folder) {
    state.folderInfo = folder
  },
  [types.CHANGE_FOLDER_INFO] (state, stat) {
    stat.folderInfo = stat.folderInfo.push(stat)
  }
}

export default mutations
