<template>
    <div>
        <headerTitle :titleText="title"></headerTitle>

        <div class="orderSort">
            <div class="orderWrap vux-1px-b">
              <div class="sortItem">
                <router-link to="/driverPage/ingOrder">
                <p class="orderText">等待订单</p>
                    <div class="bottomShow" ></div>
              </router-link>
            </div>
                <div class="sortItem">
                  <router-link to="/driverPage/youOrder">
                  <p class="orderText" >你的订单</p>
                    <div class="bottomShow" ></div>
                  </router-link>
                </div>
            </div>
        </div>
      <transition name="slide-fade">
      <router-view></router-view>
        </transition>
    </div>
</template>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .orderSort
        width 100%
        .orderWrap
            display flex
            justify-content flex-start
        .sortItem
            flex 1
            position relative
            text-align center
            color #aaaaaa
            border-right 1px solid #dedede
            margin-top 5px
            .orderText
                display block
                font-size 15px
                line-height 30px
                height 30px

    .slide-fade-enter-active {
      transition: all 1.2s ease;
    }
    .slide-fade-leave-active {

      transition: all .1s cubic-bezier(2.0, 0.5, 0.8, 1.0);
    }
    .slide-fade-enter, .slide-fade-leave-to
    {
      transform: translateX(50px);
      opacity: 0;
    }
  .router-link-active{
    color:#393939

  }
  .router-link-active .bottomShow{
    color:#393939;
    width:80px;
    height:3px;
    background:#faac38;
    margin:0 auto;
  }


</style>
<script>
    import headerTitle from "../components/header/title.vue"
    export default {
        components: {
            headerTitle
        },
        data () {
            return {
                title: '订单页面',
            }
        },
        created(){
            this.$emit("onFade")
        }
    }
</script>
