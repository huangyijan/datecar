<template>
  <div id="app">
    <transition name="slide-fade">

      <router-view keep-alive @onShow="showMenu" @onFade="FadeMenu"></router-view>
    </transition>

    <tabbar style="position: fixed" slot="bottom" v-show="MenuShow&&MenuShow1" ref="tab">

      <tabbar-item :selected="ActiveOrderMenu" link="/sendOrder">
        <img slot="icon" src="./assets/send.png">
        <img slot="icon-active" src="./assets/send_hover.png">
        <span slot="label">发布订单</span>
      </tabbar-item>
      <tabbar-item :selected="!ActiveOrderMenu" link="/sendHistory">
        <img slot="icon" src="./assets/history.png">
        <img slot="icon-active" src="./assets/history_hover.png">
        <span slot="label">订单记录</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script type="text/ecmascript-6">
  import {Tabbar, TabbarItem} from 'vux'
  export default {
    name: 'app',
    components: {
      Tabbar,
      TabbarItem
    },
    methods: {
      showMenu(){
        this.MenuShow = true

      },
      FadeMenu(){
        this.MenuShow = false
      }
    },
    data(){
      return {
        MenuShow: true,
        MenuShow1: true,
        tab:[1],
        ActiveOrderMenu:true
      }
    },
    created(){

      this.MenuShow = true;


    },
    mounted(){
      window.onresize = ()=> {
//        console.log(this.$refs.tab.$el.offsetTop);
//        this.MenuShow1=true;
//        console.log(this.MenuShow1)
//
////        alert(parseInt(this.$refs.tab.$el.offsetTop)<parseInt(window.screen.availHeight)*0.7);//这里本来做软键盘的监听，但是由于我犯了一个错误导致底部导航的div的display变成了none，导致后面的监听的高度都变成了0，以后再想办法解决
////        console.log((parseInt(this.$refs.tab.$el.offsetTop)));
////        console.log(parseInt(window.screen.availHeight)*0.7);
//        if(parseInt(this.$refs.tab.$el.offsetTop)<parseInt(window.screen.availHeight)*0.7){
//          this.MenuShow1=false;
////          console.log(this.MenuShow1)
//        }
//        console.log(this.MenuShow1)
        if(parseInt(this.$refs.tab.$el.offsetTop)==0){//尝试解决上面的问题，因为v-show会给属性添加一个display:none属性（false），距离顶部的距离可能就是0了，但是总觉得有bug，难呀，再想想
          this.MenuShow1=true;
        }else if(parseInt(this.$refs.tab.$el.offsetTop)<parseInt(window.screen.availHeight)*0.7){
          this.MenuShow1=false;
        }else {
          this.MenuShow1=true;
        }
//        this.MenuShow1 = !this.MenuShow1;//下选之策！毕竟导致屏幕resize的事件太多（比如旋转屏幕），都会触发

      }
    },
    watch:{
      '$route':function (value) {

        if(value.path==='/sendOrder'){
          this.ActiveOrderMenu=true;
        }else if(value.path==='/sendHistory'){
           this.ActiveOrderMenu=false;
        }else {
          return;
        }
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import '~vux/src/styles/reset.less';
  @import '~vux/src/styles/1px.less';
  @import "common/stylus/style.styl";

  body {
    background-color: white;
  }

  .tabbarButtom {
    height: 50px;
  }

  .slide-fade-enter-active {
    transition: all 1.2s ease;
  }

  .slide-fade-leave-active {

    transition: all .1s cubic-bezier(2.0, 0.5, 0.8, 1.0);
  }

  .slide-fade-enter, .slide-fade-leave-to {
    transform: translateX(50px);
    opacity: 0;
  }

  a:-webkit-any-link {
    color: #aaaaaa;
  }

  .loading {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 121;
    width: 100%;
    height: 100%;
    background: rgba(249, 164, 78, 0.28);
    display: table-cell;
    vertical-align: middle;
    text-align: center;
  }

  .loading img {
    margin: 15rem auto;
  }

  @-webkit-keyframes rotation {
    from {
      -webkit-transform: rotate(0deg)
    }
    to {
      -webkit-transform: rotate(360deg)
    }
  }

  @-moz-keyframes rotation {
    from {
      -moz-transform: rotate(0deg)
    }
    to {
      -moz-transform: rotate(359deg)
    }
  }

  @-o-keyframes rotation {
    from {
      -o-transform: rotate(0deg)
    }
    to {
      -o-transform: rotate(359deg)
    }
  }

  @keyframes rotation {
    from {
      transform: rotate(0deg)
    }
    to {
      transform: rotate(359deg)
    }
  }
</style>
