<template>
  <Row class="wrapper">
    <Col span="6">
      <left-bar></left-bar>
    </Col>
    <Col span="12" class="container">
      <div class="header">
        <header>文件管理器</header>
      </div>
      <Table
        size="small" 
        :columns="columns" 
        :data="normalize(diskInfo)"
        @on-row-click="info"
        @on-row-dblclick="forward"
        v-show="$route.name === 'index'"
        class="t-folder"
      >
      </Table>

      <transition name="fade">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </transition>

    </Col>
    <Col span="6">
      <right-bar 
        :data="diskDetail" 
        :show="diskDetail.Access !== undefined"
      >
      </right-bar>
      <right-disk 
        :show="diskDetail.Access === undefined"
      >
      </right-disk>
    </Col>
  </Row>
</template>
<script>
  import LeftBar from '@/views/siderBar/leftBar'
  import RightBar from '@/views/siderBar/rightBar'
  import RightDisk from '@/views/siderBar/rightDisk'
  import wmic from 'node-wmic'
  import { toMem } from '@/extend/filters'
  import { readFolder } from '@/common/js/file'
  import { mapMutations } from 'vuex'
  export default {
    components: {
      LeftBar,
      RightBar,
      RightDisk
    },
    data () {
      return {
        diskInfo: [],
        folderInfo: [],
        columns: [
          {
            title: '盘符名',
            key: 'Name',
            render: (h, params) => {
              return h('div', [
                h('Icon', {
                  props: {
                    type: 'social-windows',
                    color: '#33aefc'
                  }
                }),
                h('strong', `${params.row.VolumeName} (${params.row.Name})`)
              ])
            }
          },
          {
            title: '文件系统',
            key: 'FileSystem'
          },
          {
            title: '剩余总量',
            key: 'FreeSpace',
            render: (h, params) => {
              return h('div', [
                toMem(params.row.FreeSpace)
              ])
            }
          },
          {
            title: '总容量',
            key: 'Size',
            render: (h, params) => {
              return h('div', [
                toMem(params.row.Size)
              ])
            }
          }
        ],
        diskDetail: {}
      }
    },
    methods: {
      toMem: toMem,
      ...mapMutations({
        getFolderInfo: 'GET_FOLDER_INFO'
      }),
      info (row) {
        this.diskDetail = row
      },
      async forward (row) {
        if (row.Description === '光盘') return
        let path = row.Name + '\\\\'
        await readFolder(path).then(res => {
          this.getFolderInfo(res)
        })
        this.$router.replace({
          path: `/computer/${path}`
        })
      },
      normalize (arr) {
        let ret = []
        arr.forEach((item, index) => {
          if (arr[index].FileSystem) {
            ret.push(arr[index])
          }
        })
        return ret
      }
    },
    watch: {
      '$route' () {
      }
    },
    created () {
      wmic.disk().then(disk => {
        this.diskInfo = disk
      })
    }
  }
</script>
<style lang="less" scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .4s
  }
  .fade-enter,
  .fade-leave {
    opacity: 0
  }
  .wrapper {
    height: 100%;
    overflow-y: auto;
  }
  .ivu-col-span-6 {
    height: 100%;
  }
  .header {
    padding: 10px;
    header {
      font: bold 20px/150% 'Microsoft Yahei';
    }
  }
  .container {
    position: relative;
    height: 100%;
    .footer-bread {
      position: fixed;
      left: 26%;
      top: 10px;
      z-index: 100;
    }
  }
  .ivu-table-wrapper {
    border: none !important;
  }
</style>
