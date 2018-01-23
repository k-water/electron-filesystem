<template>
  <transition name="slide" mode="out-in">
    <div class="folder" id="folder" @contextmenu="createNewOne($route.params.id)">
     <!--文件重命名dialog-->
      <Modal
        title="重命名"
        v-model="show"
        @on-ok="changeFileName"
      >
        <Input v-model="filename" placeholder="请输入新的文件名"></Input>
      </Modal>
      <!--文件目录-->
      <div class="folder-container" style="margin-bottom: 50px;">
        <div class="back" @click="back">
          <Icon 
            type="ios-arrow-back" 
            size="28"
            color="rgba(51, 174, 252, 0.5)"
          >
          </Icon>
        </div>
        <div class="t-folder ivu-table-wrapper">
          <div class="ivu-table ivu-table-small" style="margin-bottom: 50px;">
            <div class="ivu-table-header">
              <table 
                cellspacing="0" 
                cellpadding="0" 
                border="0" 
                style="width: 100%;"
              >
                <thead>
                  <tr>
                    <th class="" style="width: 35%">
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
                    <th class="" style="width: 15%">
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
                    <td class="" style="width: 35%">
                      <div class="ivu-table-cell">
                        <div>
                          <img :src="item.src" alt="icon" width="16" height="16">
                          <strong>{{item.name}}</strong>
                        </div>
                      </div>
                    </td>
                    <td class="" style="width: 30%">
                      <div class="ivu-table-cell">
                        <span> {{new Date(item.ctime).toLocaleString()}} </span>
                      </div>
                    </td>
                    <td class="" style="width: 20%">
                      <div class="ivu-table-cell">
                        <div>{{item.type}}</div>
                      </div>
                    </td>
                    <td class="" style="width: 15%">
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
      <!--右键文件属性modal-->
      <Modal
        title="文件详情"
        v-model="showFileDetail"
        class-name="vertical-center-modal"
        width="420px"
      >
        <Card class="file-card">
          <p>
            <span class="file-title">文件名：</span>
            <span> {{fileDetail.name}} </span>
          </p>
          <p>
            <span class="file-title">文件类型：</span>
            <span> {{fileDetail.type}} </span>
          </p>
          <p>
            <span class="file-title">文件大小：</span>
            <span> {{this.toMem(fileDetail.size) || '0Kb'}} </span>
          </p>
          <p>
            <span class="file-title">文件创建时间：</span>
            <span> {{new Date(fileDetail.birthtime).toLocaleString()}} </span>
          </p>
          <p>
            <span class="file-title">文件所在目录：</span>
            <span> {{fileDetail.path}} </span>
          </p>
          <p>
            <span class="file-title">文件设备ID号：</span>
            <span> {{fileDetail.dev}} </span>
          </p>
          <p>
            <span class="file-title">文件的权限标志：</span>
            <span> {{fileDetail.mode}} </span>
          </p>
          <p>
            <span class="file-title">文件硬连接数量：</span>
            <span> {{fileDetail.nlink}} </span>
          </p>
          <p>
            <span class="file-title">文件Indoe节点号：</span>
            <span> {{fileDetail.ino}} </span>
          </p>
          <p>
            <span class="file-title">文件所有者用户ID：</span>
            <span> {{fileDetail.uid}} </span>
          </p>
          <p>
            <span class="file-title">文件所有者用户组ID：</span>
            <span> {{fileDetail.gid}} </span>
          </p>
        </Card>
      </Modal>
      <!--饼状图-->
      <Modal
        title="文件磁盘分布"
        v-model="showFilePie"
        class-name="vertical-center-modal"
      >
        <ve-pie :data="chartData" :settings="chartSettings" :events="chartEvents">
        </ve-pie>
      </Modal>
    </div>
  </transition>
</template>
<script>
  import { mapGetters, mapMutations } from 'vuex'
  import { toMem } from '@/extend/filters'
  import {
    openFile,
    readFolder,
    createNewFolder,
    createNewTxt,
    deleteFile,
    deleteFolder,
    rename,
    copyFile,
    copyFolder
  } from '@/common/js/file'
  import wmic from 'node-wmic'
  export default {
    computed: {
      ...mapGetters([
        'folderInfo'
      ])
    },
    created () {
      this.reload()
      let self = this
      this.chartEvents = {
        click: function (e) {
          if (e.name === self.fileDetail.path.substr(6)) {
            self.showFilePie = false
            self.showFileDetail = true
          }
        }
      }
    },
    mounted () {
      this.tableData = this.folderInfo
    },
    watch: {
      '$route' () {
        this.getDisk()
        if (this.$route.name === 'folder') {
          readFolder(this.$route.params.id + '\\\\').then(res => {
            this.getFolderInfo(res)
          })
        }

        // 从下一层文件夹复制到上一层

        if (this.copyParams.dist.length > this.copyParams.src.length) {
          this.copyParams.src = this.copyParams.dist
        }

        // 复制到下一层的文件夹
        this.copyParams.dist = this.$route.params.id + '\\\\' + this.copyParams.name
        setTimeout(() => {
          this.tableData = JSON.parse(JSON.stringify(this.folderInfo))
        }, 200)
      }
    },
    data () {
      return {
        tableData: [],
        show: false,
        filename: '',
        fileInfo: {},
        fileIndex: 0,
        showFileDetail: false,
        showFilePie: false,
        fileDetail: {},
        cut: {
          path: '',
          index: '',
          type: ''
        },
        copyParams: {
          src: '',
          dist: '',
          name: '',
          type: '文件夹'
        },
        chartData: {},
        chartSettings: {},
        currentDisk: {},
        chartEvents: {}
      }
    },
    methods: {
      toMem: toMem,
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
        if (this.$route.params.id.length > 4) {
          this.$router.replace({
            name: 'index'
          })
        }
      },
      back () {
        if (this.$route.params.id.length <= 4) {
          this.$router.replace({
            path: '/computer'
          })
        } else {
          this.$router.back(-1)
        }
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
      initFilePie (row) {
        this.fileDetail = row
        this.chartData = {
          columns: ['使用量', '字节'],
          rows: [
            {
              '使用量': this.toMem(this.currentDisk.Size - this.currentDisk.FreeSpace) + ' 已使用',
              '字节': this.currentDisk.Size - this.currentDisk.FreeSpace - this.currentDisk.FreeSpace / 50
            },
            {
              '使用量': this.toMem(this.currentDisk.FreeSpace) + ' 未使用',
              '字节': this.currentDisk.FreeSpace
            },
            {
              '使用量': row.path.substr(6),
              '字节': row.type === '文件夹' ? 0 : this.currentDisk.FreeSpace / 50
            }
          ]
        }
        this.chartSettings = {
          dimension: '使用量',
          metrics: '字节',
          dataType: 'KMB',
          selectedMode: 'single',
          hoverAnimation: false,
          radius: 100,
          offsetY: 200
        }
      },
      getDisk () {
        wmic.disk().then(disk => {
          disk.map((item, index) => {
            if (item.Caption[0] === this.tableData[0].path[0]) {
              this.currentDisk = Object.assign({}, item)
            }
          })
        })
      },
      createNewOne (path) {
        const MenuItem = this.$electron.remote.MenuItem
        const Menu = this.$electron.remote.Menu
        const dialog = this.$electron.remote.dialog
        const menu1 = new Menu()
        let me = this
        let newMenu = new MenuItem({
          label: '新建',
          accelerator: 'CmdOrCtrl+N',
          submenu: [{
            label: '文件夹',
            click () {
              createNewFolder(path + '\\\\').then(stat => {
                me.tableData.push(stat)
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

        let pasteMenu = new MenuItem({
          label: '粘贴',
          accelerator: 'CmdOrCtrl+V',
          click () {
            if (me.copyParams.type === '文件夹') {
              if (me.cut.path) {
                copyFolder(me.copyParams.src, me.copyParams.dist, dialog).then(result => {
                  if (me.copyParams.dist.length < me.copyParams.src.length) {
                    return
                  }
                  me.tableData.push(result)
                })
                setTimeout(() => {
                  me.cutFile()
                }, 1000)
              } else {
                copyFolder(me.copyParams.src, me.copyParams.dist, dialog).then(result => {
                  me.tableData.push(result)
                })
              }
            } else {
              if (me.cut.path) {
                console.log('src：' + me.copyParams.src)
                console.log('dist：' + me.copyParams.dist)
                copyFile(me.copyParams.src, me.copyParams.dist, dialog).then(result => {
                  me.tableData.push(result)
                })
                setTimeout(() => {
                  me.cutFile()
                }, 1000)
              } else {
                copyFile(me.copyParams.src, me.copyParams.dist, dialog).then(result => {
                  if (me.copyParams.dist.length < me.copyParams.src.length) {
                    return
                  }
                  me.tableData.push(result)
                })
              }
            }
          }
        })

        menu1.append(pasteMenu)
        menu1.append(newMenu)
        menu1.popup(this.$electron.remote.getCurrentWindow())
      },
      changeFileName () {
        if (!this.filename) {
          this.show = false
          return this.$Notice.error({
            title: '文件名不能为空',
            duration: 2
          })
        }
        let dist
        if (this.fileInfo.type === 'TXT文档') {
          dist = this.fileInfo.location + this.filename + '.txt'
        } else {
          dist = this.fileInfo.location + this.filename
        }
        rename(this.fileInfo.path, dist).then(stat => {
        })
        if (this.fileInfo.type === 'TXT文档') {
          this.tableData[this.fileIndex].name = this.filename + '.txt'
        } else {
          this.tableData[this.fileIndex].name = this.filename
        }
        this.tableData[this.fileIndex].path = dist
        this.filename = ''
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

        let renameMenu = new MenuItem({
          'label': '重命名',
          accelerator: 'CmdOrCtrl+R',
          click () {
            me.show = true
            me.fileInfo = Object.assign({}, row)
            me.fileIndex = index
          }
        })

        let copyMenu = new MenuItem({
          label: '复制',
          accelerator: 'CmdOrCtrl+C',
          click () {
            me.copyParams.src = row.path
            me.copyParams.dist = row.path
            me.copyParams.name = row.name
            me.copyParams.type = row.type
            console.log(`fuzhi: ${me.copyParams.src}`)
          }
        })

        let fileInfoMenu = new MenuItem({
          label: '查看文件信息',
          accelerator: 'CmdOrCtrl+J',
          click () {
            me.fileDetail = Object.assign({}, row)
            me.showFileDetail = true
          }
        })

        let filePieMenu = new MenuItem({
          label: '文件磁盘分布',
          accelerator: 'CmdOrCtrl+T',
          click () {
            me.initFilePie(row)
            me.showFilePie = true
          }
        })

        let cutMenu = new MenuItem({
          label: '剪切',
          accelerator: 'CmdOrCtrl+X',
          click () {
            me.cut.path = row.path
            me.cut.index = index
            me.cut.type = row.type
            me.copyParams.src = row.path
            me.copyParams.dist = row.path
            me.copyParams.name = row.name
            me.copyParams.type = row.type
          }
        })
        menu1.append(copyMenu)
        menu1.append(deleteMenu)
        menu1.append(renameMenu)
        menu1.append(cutMenu)
        menu1.append(fileInfoMenu)
        menu1.append(filePieMenu)
        menu1.popup(this.$electron.remote.getCurrentWindow())
      },
      cutFile () {
        const dialog = this.$electron.remote.dialog
        if (this.cut.type === '文件夹') {
          deleteFolder(this.cut.path, dialog, false).then(() => {
          })
        } else {
          deleteFile(this.cut.path, dialog, false).then(() => {
          })
        }
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
    bottom: 0px;
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
  .vertical-center-modal{
    display: flex;
    align-items: center;
    justify-content: center;

    .ivu-modal{
      top: 0;
    }
  }
  .file-card {
    box-shadow: 0 1px 6px rgba(0,0,0,.2);
    border-color: #eee;
    p {
      padding-bottom: 5px;
    }
    .file-title {
      display: inline-block;
      width: 150px;
      text-align: right;
    }
  }
  .slide-enter-active, .slide-leave-active {
    transition: opacity .4s;
  }
  .slide-enter, .slide-leave {
    opacity: 0;
  }
  .ivu-table-row:hover td{
    background-color:#ebf7ff !important;
  }
  .ivu-table-row td {
    height: 30px !important;
    line-height: 150%;
  }
  .ivu-table-cell {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
</style>
