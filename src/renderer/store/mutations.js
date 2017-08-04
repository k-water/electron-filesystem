import * as types from './mutation-types'

const mutations = {
  [types.GET_FOLDER_INFO] (state, folder) {
    state.folderInfo = folder
  }
}

export default mutations
