<template>
  <Row class="wrapper">
    <Col span="6">
      <left-bar></left-bar>
    </Col>
    <Col span="12">
      <Table
        size="small" 
        :columns="columns" 
        :data="diskInfo.slice(0,4)"
        @on-row-click="info"
      >
      </Table>
    </Col>
    <Col span="6">
      <right-bar :data="diskDetail" :show="diskDetail.Access !== undefined"></right-bar>
      <right-disk :show="diskDetail.Access === undefined"></right-disk>
    </Col>
  </Row>
</template>
<script>
  import LeftBar from '@/views/siderBar/leftBar'
  import RightBar from '@/views/siderBar/rightBar'
  import RightDisk from '@/views/siderBar/rightDisk'
  import wmic from 'node-wmic'
  import { toMem } from '@/extend/filters'
  export default {
    components: {
      LeftBar,
      RightBar,
      RightDisk
    },
    data () {
      return {
        diskInfo: [],
        columns: [
          {
            title: '盘符名',
            key: 'Name',
            render: (h, params) => {
              return h('div', [
                h('Icon', {
                  props: {
                    type: 'social-windows',
                    color: '#6095d9'
                  }
                }),
                h('strong', `${params.row.VolumeName}(${params.row.Name})`)
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
      info (row) {
        this.diskDetail = row
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
  }
  .ivu-col-span-6 {
    height: 100%;
  }
</style>
