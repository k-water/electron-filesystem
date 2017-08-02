<template>
  <Row :gutter="16" class="wrapper">
    <Col span="6">
      <left-bar></left-bar>
    </Col>
    <Col span="12">
      
    </Col>
    <Col span="6">
    
    </Col>
  </Row>
</template>
<script>
  import LeftBar from '@/views/siderBar/leftBar'
  export default {
    components: {
      LeftBar
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
