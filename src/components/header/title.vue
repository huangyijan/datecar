<template>
  <div class="titleWrap vux-1px-b">
    <div class="tip"></div>
    <p class="title">{{titleText}}</p>
    <router-link to="/">
      <span class="icon-home locationHome"></span>
    </router-link>
    <router-link to="/feedback">
      <span class="icon-document-edit locationHome"></span>
    </router-link>
  </div>
</template>

<style lang="stylus" rel="stylesheet/stylus">
  divHeight = 50px
  .titleWrap
    width 100%
    height divHeight
    position relative
    background-color #ffffff
    text-align center
    border-top 1px solid #dedede
    color #393939
    .tip
      position absolute
      width 4px
      height 16px
      left 0
      background-color #faac38
      top 17px
    .title
      font-family "楷体", "华文宋体", sans-serif
      font-size 16px
      line-height divHeight
      margin-left 12px
      float left
    .locationHome
      line-height 50px
      font-size 18px
      color #faac38
      margin-right 20px
      padding 0 5px
      float right
</style>

<script>
  export default{
    props: {
      titleText: String
    },
    data () {
      return {}

    },
    created(){

    }
  }
</script>
