<template>
  <div class="right-disk" v-show="show">
    <Card class="card-disk">
      <div class="head-disk">
        <img :src="imgDisk" class="img-disk">
        <p> {{diskDetails.Caption}} </p>
        <p> {{diskDetails.Manufacturer}} </p>
      </div>
      <div class="detail-disk">
        <label>接口类型：</label>
				<p>{{diskDetails.InterfaceType}}</p>
				<label>分区数：</label>
				<p>{{diskDetails.Partitions}}</p>
				<label>序列号：</label>
				<p>{{diskDetails.SerialNumber}}</p>
				<label>总柱面数：</label>
				<p>{{diskDetails.TotalCylinders}}</p>
				<label>总磁头数：</label>
				<p>{{diskDetails.TotalHeads}}</p>
				<label>总扇区数：</label>
				<p>{{diskDetails.TotalSectors}}</p>
				<label>总磁道数：</label>
				<p>{{diskDetails.TotalTracks}}</p>
				<label>每柱面的磁道数：</label>
				<p>{{diskDetails.TracksPerCylinder}}</p>
      </div>
    </Card>
  </div>
</template>
<script>
  import wmic from 'node-wmic'
  export default {
    props: {
      show: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        diskDetails: [],
        imgDisk: require('../../assets/disk.png')
      }
    },
    created () {
      wmic.diskdrive().then(data => {
        this.diskDetails = data[0]
      })
    }
  }
</script>
<style lang="less" scoped>
  .right-disk {
    width: 100%;
    height: 100%;
    border-right: 1px solid #dddee1;
    overflow-y: auto;
    .card-disk {
      height: 100%;
      overflow-y: auto;
      .head-disk {
        text-align: center;
        p {
          line-height: 24px;
        }
      }
      .img-disk {
        max-width: 100%;
        max-height: 100%;
        width: 150px;
        height: 150px;
      }
      .detail-disk {
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
