<template>
  <div class="folder">
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
      :data="folderInfo"
      class="t-folder"
      @on-row-dblclick="forwardFolder"
    >
    </Table>
  </div>
</template>
<script>
  import { mapGetters, mapMutations } from 'vuex'
  import { openFile, readFolder } from '@/common/js/file'
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
    watch: {
      '$route' () {
        if (this.$route.name === 'folder') {
          readFolder(this.$route.params.id + '\\\\').then(res => {
            this.getFolderInfo(res)
          })
        }
      }
    },
    data () {
      return {
        allPath: [],
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
