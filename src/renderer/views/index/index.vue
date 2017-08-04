<template>
  <Row class="wrapper">
    <Col span="6">
      <left-bar></left-bar>
    </Col>
    <Col span="14">
      <Table
        size="small" 
        :columns="columns" 
        :data="diskInfo.slice(0,4)"
        @on-row-click="info"
        @on-row-dblclick="forward"
        v-show="$route.name === 'index'"
      >
      </Table>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </Col>
    <Col span="4">
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
      forward (row) {
        if (row.Description === '光盘') return
        let path = row.Name + '\\\\'
        let nextPath
        readFolder(path).then(res => {
          this.getFolderInfo(res)
          let arr = res[0].path.split('\\')
          nextPath = arr[arr.length - 1]
        })
        this.$router.push({
          path: `/computer/${nextPath}`
        })
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
  .wrapper {
    height: 100%;
    overflow-y: auto;
  }
  .ivu-col-span-4 {
    height: 100%;
  }
</style>
