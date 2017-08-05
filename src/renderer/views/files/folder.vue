<template>
  <div class="folder" id="folder" @contextmenu="createNewOne($route.params.id)">
    <div class="back" @click="back">
      <Icon 
        type="ios-arrow-back" 
        size="28"
        color="rgba(51, 174, 252, 0.5)"
      >
      </Icon>
    </div>
    <Table 
      highlight-row 
      :columns="columns" 
      :data="tableData"
      class="t-folder"
      @on-row-dblclick="forwardFolder"
    >
    </Table>
  </div>
</template>
<script>
  import { mapGetters, mapMutations } from 'vuex'
  import { openFile, readFolder, createNewFolder, createNewTxt } from '@/common/js/file'
  export default {
    computed: {
      ...mapGetters([
        'folderInfo'
      ]),
      disk () {
        let path = this.$route.fullPath.split('/')
        let realPath = path[path.length - 1].split('\\')
        return realPath[0]
      }
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
        this.tableData = this.folderInfo
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
      toMem (size) {
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
        // let rightClickPosition = null
        // let FILE = document.getElementById('folder')
        // FILE.window.addEventListener('contextmenu', e => {
        //   e.preventDefault()
        //   menu1.popup(this.$electron.remote.getCurrentWindow())
        //     // rightClickPosition = {x: e.x, y: e.y}
        //     // let selectedElement = document.elementFromPoint(rightClickPosition.x, rightClickPosition.y).parentNode
        //     // let id = selectedElement.attributes.id && +selectedElement.attributes.id.nodeValue
        // }, false)
      }
    }
  }
</script>
<style lang="less" scoped>
  .folder {
    height: 100%;
    overflow-y: auto;
    position: relative;
    .t-folder {
      height: 100%;
      // margin-top: 4%;
    }
  }
  .back {
    padding: 0 5px 0 5px;
    cursor: pointer;
    width: 48px;
    height: 48px;
    line-height: 32px;
    position: absolute;
    top: 8px;
    z-index: 100;
  }
  .img-folder {
    width: 16px !important;
    height: 16px !important;
  }
</style>
