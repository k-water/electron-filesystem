<template>
  <div class="folder">
    <Icon type="arrow-left-c" @click.native="back"></Icon>
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
  // import { readFolder } from '@/common/js/file'

  export default {
    computed: {
      ...mapGetters([
        'folderInfo'
      ])
    },
    created () {
      this.reload()
    },

    data () {
      return {
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
        if (!this.$router.id) {
          this.$router.replace({
            name: 'index'
          })
        }
      },
      back () {
        this.$router.back()
      },
      forwardFolder (row) {
      }
    }
  }
</script>
<style lang="less" scoped>
  .folder {
    height: 100%;
    overflow-y: auto;
    .t-folder {
      height: 100%;
      overflow-y: auto;
    }
  }
  .img-folder {
    width: 16px !important;
    height: 16px !important;
  }
</style>
