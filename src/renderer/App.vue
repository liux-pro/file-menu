<template>
  <div id="app">
    <main-page></main-page>
  </div>
</template>

<script>
  import MainPage from '@/components/MainPage'

  export default {
    name: 'file-menu',
    components: {
      MainPage
    }
  }
</script>

<style>
  .el-tree{
    color: black;
  }
  /* CSS */
</style>
