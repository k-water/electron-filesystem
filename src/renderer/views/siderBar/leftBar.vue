<template>
  <div class="left-bar">
    <article class="base">
      <header class="head">
        <Icon type="monitor" size="32" color="rgb(51, 174, 252)"></Icon>
        <span class="title">系统</span>
      </header>
      <section class="info">
        <p>操作系统：<span>{{os}}</span></p>
        <p>操作系统内核：<span>{{kernel}}</span></p>
        <p>平台：<span>{{platform}}</span></p>
        <p>用户名：<span>{{username}}</span></p>
      </section>
    </article>

    <article class="cpus">
      <header class="head">
        <Icon type="planet" size="32" color="rgb(51, 174, 252)"></Icon>
        <span class="title">CPU</span>
      </header>
      <section class="info">
        <p>CPU型号：<span>{{model}}</span></p>
        <p>核心数：<span>{{NumberOfCores}}</span></p>
        <p>频率：<span>{{CurrentClockSpeed}} MHZ</span></p>
        <p>L2缓存：<span>{{L2CacheSize || 0}} KB</span></p>
        <p>L3缓存：<span>{{L3CacheSize || 0}} KB</span></p>
      </section>
    </article>

    <article class="ram">
      <header class="head">
        <Icon type="leaf" size="32" color="rgb(51, 174, 252)"></Icon>
        <span class="title">内存RAM</span>
      </header>
      <section class="info">
        <p>已用内存：<span>{{usedmem | toMem}}</span></p>
        <p>空闲内存：<span>{{freemem | toMem}}</span></p>
        <p>总内存：<span>{{totalmem | toMem}}</span></p>
      </section>
    </article>

    <article class="used">
      <header class="head">
        <Icon type="ios-pie" size="32" color="rgb(51, 174, 252)"></Icon>
        <span class="title">使用情况</span>
      </header>
      <section class="info">
        <div class="bar membar">
          <p>内存使用：</p>
          <Progress :percent="percentMem" status="active"></Progress>
        </div>
        <div class="bar cpubar">
          <p>CPU使用：</p>
          <Progress :percent="LoadPercentage" status="active"></Progress>
        </div>
      </section>
    </article>
  </div>
</template>
<script>
  import os from 'os'
  import wmic from 'node-wmic'
  export default {
    data () {
      return {
        os: '',
        model: '',
        NumberOfCores: '',
        CurrentClockSpeed: '',
        L2CacheSize: '',
        L3CacheSize: '',
        LoadPercentage: 0,
        percentMem: parseInt((os.totalmem() - os.freemem()) / os.totalmem() * 100),
        free: os.freemem()
      }
    },
    computed: {
      kernel () {
        return os.type()
      },
      platform () {
        return os.platform()
      },
      username () {
        return os.hostname()
      },
      usedmem () {
        return os.totalmem() - os.freemem()
      },
      freemem () {
        return os.freemem()
      },
      totalmem () {
        return os.totalmem()
      }
    },
    created () {
      this.getOSInfo()
    },
    methods: {
      getOSInfo () {
        wmic.os().then(data => {
          this.os = data.Caption
        })
        wmic.cpu().then(data => {
          this.model = data.Name
          this.NumberOfCores = data.NumberOfCores
          this.CurrentClockSpeed = data.CurrentClockSpeed
          this.L2CacheSize = data.L2CacheSize
          this.L3CacheSize = data.L3CacheSize
          this.LoadPercentage = parseInt(data.LoadPercentage)
        })
      }
    },
    watch: {
      LoadPercentage () {
        wmic.cpu().then(data => {
          this.LoadPercentage = parseInt(data.LoadPercentage)
        })
      },
      free () {
        this.percentMem = parseInt((os.totalmem() - os.freemem()) / os.totalmem() * 100)
      }
    }
  }
</script>
<style lang="less" scoped>
  .left-bar {
    width: 100%;
    height: 100%;
    border-right: 1px solid #dddee1;
    overflow-y: auto;
    .base {
      padding-top: 10px;
    }
    .head {
      display: flex;
      width: 100%;
      padding: 0 20px 0 5px;
      .title {
        line-height: 32px;
        padding-left: 10px;
        font-size: 20px;
        font-weight: bold;
      }
    }
    .info {
      padding: 10px 0 10px 20px;
      p {
        line-height: 24px;
        font-size: 14px;
      }
    }
    .cpubar {
      padding-top: 10px;
    }
  }

</style>
