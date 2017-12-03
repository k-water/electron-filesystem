<template>
  <div class="right-bar" v-show="show">
    <Card class="card-hdd">
      <div class="head-hdd">
        <img :src="imgHdd" class="img-hdd">
        <p>{{data.VolumeName}}</p>
		  	<p>（{{data.Caption}}）</p>
      </div>
      <div class="detail-hdd">
        <label>剩余容量:</label>
        <p>{{data.FreeSpace | toMem}}</p>
        <label>总容量:</label>
        <p>{{data.Size | toMem}}</p>
        <label>使用率:</label>
        <Progress :percent="parseInt((data.Size - data.FreeSpace) / data.Size * 100)" status="active"></Progress>
        <label v-if="data.FileSystem">文件系统:</label>
        <p>{{data.FileSystem}}</p>
        <label v-if="data.Description">描述:</label>
        <p>{{data.Description}}</p>
        <label v-if="data.VolumeSerialNumber">序列号:</label>
        <p>{{data.VolumeSerialNumber}}</p>
      </div>
    </Card>
  </div>
</template>
<script>
  export default {
    props: {
      data: {
        type: Object,
        default: {}
      },
      show: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        imgHdd: require('../../assets/disk-ssd.png')
      }
    }
  }
</script>
<style lang="less" scoped>
  .right-bar {
    width: 100%;
    height: 100%;
    border-right: 1px solid #dddee1;
    overflow-y: auto;
    .card-hdd {
      height: 100%;
      overflow-y: auto;
      .head-hdd {
        text-align: center;
        p {
          line-height: 28px;
          height: 28px;
        }
      }
      .img-hdd {
        max-width: 100%;
        max-height: 100%;
        width: 150px;
        height: 150px;
      }
      .detail-hdd {
        padding: 20px 0 0 20px;
        label {
          padding: 5px 0;
          line-height: 24px;
          height: 24px;
          display: block;
          font-size: 14px;
          color: #bbb;
        }
        p {
          line-height: 24px;
          height: 24px;
        }
      }
    }
  }
</style>
