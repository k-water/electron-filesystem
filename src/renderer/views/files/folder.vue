<template>
  <transition name="slide" mode="out-in">
    <div class="folder" id="folder" @contextmenu="createNewOne($route.params.id)">
      <div class="folder-container">
        <div class="back" @click="back">
          <Icon 
            type="ios-arrow-back" 
            size="28"
            color="rgba(51, 174, 252, 0.5)"
          >
          </Icon>
        </div>
        <div class="t-folder ivu-table-wrapper">
          <div class="ivu-table ivu-table-small">
            <div class="ivu-table-header">
              <table 
                cellspacing="0" 
                cellpadding="0" 
                border="0" 
                style="width: 100%;"
              >
                <thead>
                  <tr>
                    <th class="" style="width: 30%">
                      <div class="ivu-table-cell" style=""><span>名称</span>
                      </div>
                    </th>
                    <th class="" style="width: 30%">
                      <div class="ivu-table-cell"><span>修改时间</span>
                      </div>
                    </th>
                    <th class="" style="width: 20%">
                      <div class="ivu-table-cell"><span>类型</span>
                      </div>
                    </th>
                    <th class="" style="width: 20%">
                      <div class="ivu-table-cell"><span>大小</span>
                      </div>
                    </th>
                  </tr>
                </thead>
              </table>
            </div>
            <div class="ivu-table-body">
              <table 
                cellspacing="0" 
                cellpadding="0" 
                border="0" 
                style="width: 100%;"
              >
                <tbody class="ivu-table-tbody">
                  <tr class="ivu-table-row" 
                    v-for="(item, index) in tableData"
                    :key="item.uid"
                    @contextmenu.stop="handlerFiles(item, index)"
                    @dblclick="forwardFolder(item)"
                  >
                    <td class="" style="width: 30%">
                      <div class="ivu-table-cell">
                        <div>
                          <img :src="item.src" alt="icon" width="16" height="16">
                          <strong>{{item.name}}</strong>
                        </div>
                      </div>
                    </td>
                    <td class="" style="width: 30%">
                      <div class="ivu-table-cell">
                        <span> {{new Date(item.atime).toLocaleString()}} </span>
                      </div>
                    </td>
                    <td class="" style="width: 20%">
                      <div class="ivu-table-cell">
                        <div>{{item.type}}</div>
                      </div>
                    </td>
                    <td class="" style="width: 20%">
                      <div class="ivu-table-cell">
                        <div>{{ item.size === 0 ? '' : formatMem(item.size) }}</div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
  import { mapGetters, mapMutations } from 'vuex'
  import {
    openFile,
    readFolder,
    createNewFolder,
    createNewTxt,
    deleteFile,
    deleteFolder
  } from '@/common/js/file'
  export default {
    computed: {
      ...mapGetters([
        'folderInfo'
      ])
    },
    created () {
      this.reload()
    },
    mounted () {
      this.tableData = this.folderInfo
    },
    watch: {
      '$route' () {
        if (this.$route.name === 'folder') {
          readFolder(this.$route.params.id + '\\\\').then(res => {
            this.getFolderInfo(res)
          })
        }
        setTimeout(() => {
          this.tableData = this.folderInfo.slice()
        }, 200)
      }
    },
    data () {
      return {
        tableData: [],
        columns: [
          {
            title: '名称',
            align: 'left',
            key: 'name',
            render: (h, params) => {
              return h('div', [
                h('img', {
                  attrs: {
                    src: params.row.src,
                    width: '16px',
                    height: '16px'
                  }
                }),
                h('strong', params.row.name)
              ])
            }
          },
          {
            title: '修改时间',
            key: 'atime',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                new Date(params.row.atime).toLocaleString()
              ])
            }
          },
          {
            title: '类型',
            key: 'type',
            align: 'center'
          },
          {
            title: '大小',
            key: 'size',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                params.row.size === 0 ? '' : this.toMem(params.row.size)
              ])
            }
          }
        ]
      }
    },
    methods: {
      ...mapMutations({
        getFolderInfo: 'GET_FOLDER_INFO'
      }),
      formatMem (size) {
        let kb = 1024
        let mb = 1024 * 1024
        let gb = mb * 1024
        size = +size
        if (!size) return 0
        if (size > gb) return (size / gb).toFixed(2) + 'GB'
        else if (size > mb) return (size / mb).toFixed(2) + 'MB'
        else if (size > kb) return (size / kb).toFixed(2) + 'KB'
        else return size.toFixed(2) + 'B'
      },
      reload () {
        if (this.$route.params.id) {
          this.$router.replace({
            name: 'index'
          })
        }
      },
      back () {
        this.$router.go(-1)
      },
      async forwardFolder (row) {
        if (row.type === '文件夹') {
          await readFolder(row.path + '\\\\').then(res => {
            this.getFolderInfo(res)
          })
          this.$router.push({
            path: `/computer/${row.path}`
          })
        } else {
          openFile(row.path)
        }
      },
      createNewOne (path) {
        const MenuItem = this.$electron.remote.MenuItem
        const Menu = this.$electron.remote.Menu
        const menu1 = new Menu()
        let me = this
        let newFile = new MenuItem({
          label: '新建',
          accelerator: 'CmdOrCtrl+N',
          submenu: [{
            label: '文件夹',
            click () {
              createNewFolder(path + '\\\\').then(stat => {
              })
            }
          }, {
            label: '文件',
            click () {
              createNewTxt(path + '\\\\').then(stat => {
                me.tableData.push(stat)
              })
            }
          }]
        })

        menu1.append(newFile)
        menu1.popup(this.$electron.remote.getCurrentWindow())
      },

      handlerFiles (row, index) {
        const MenuItem = this.$electron.remote.MenuItem
        const Menu = this.$electron.remote.Menu
        const dialog = this.$electron.remote.dialog
        const menu1 = new Menu()
        let me = this
        let deleteMenu = new MenuItem({
          label: '删除',
          accelerator: 'CmdOrCtrl+D',
          click () {
            if (row.type !== '文件夹') {
              deleteFile(row.path, dialog, true).then(() => {
                me.tableData.splice(index, 1)
              })
            } else {
              deleteFolder(row.path, dialog, true).then(() => {
                me.tableData.splice(index, 1)
              })
            }
          }
        })
        menu1.append(deleteMenu)
        menu1.popup(this.$electron.remote.getCurrentWindow())
      }
    }
  }
</script>
<style lang="less" scoped>
  .folder {
    height: 100%;
    width: 50%;
    overflow-y: auto;
    position: fixed;
    z-index: 100;
    top: 50px;
    left: 25%;
    bottom: 0;
    right: 0;
    .t-folder {
      height: 100%;
    }
  }
  .back {
    padding: 0 5px 0 5px;
    cursor: pointer;
    width: 20px;
    height: 20px;
    line-height: 20px;
    position: absolute;
    top: 4px;
    z-index: 100;
  }
  .img-folder {
    width: 16px !important;
    height: 16px !important;
  }
  .slide-enter-active, .slide-leave-active {
    transition: all .5s cubic-bezier(.55,0,.1,1);
  }
  .slide-enter, .slide-leave-to {
    transform: translate3d(0, 100%, 0)
  }
  .ivu-table-row:hover td{
    background-color:#ebf7ff !important;
  }
</style>
