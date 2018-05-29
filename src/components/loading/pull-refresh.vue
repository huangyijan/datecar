<template lang="html">
  <div class="yo-scroll" :style="{top:offset+'px'}" :class="{'down':(state==0),'up':(state==1),refresh:(state===2),touch:touching}" @touchstart="touchStart($event)"
       @scroll="scrollIng($event)"
       @touchmove="touchMove($event)" @touchend="touchEnd($event)">
    <section class="inner" :style="{ transform: 'translate3d(0, ' + top + 'px, 0)' }">
      <header class="pull-refresh">
        <slot name="pull-refresh">
          <span class="down-tip">再下点刷新</span>
          <span class="up-tip">松开刷新</span>
          <span class="refresh-tip">
            <span class="icon-spinner2 loadingImg"></span>
          </span>
        </slot>
      </header>
      <slot>
      </slot>
      <footer class="load-more" v-if="showBottom">
        <span class="icon-spinner2 loadingImg" v-if="loading===true"></span>
        <span v-if="loading===false">-----到底部了！------</span>

      </footer>
    </section>
  </div>
</template>
<style lang="less">
  @import url("./pull-refresh.less");
</style>
<script>
  export default {
    props: {
      offset: {
        type: Number,
        default: 50 //距离底部高度
      },
      onRefresh: {
        type: Function,//上拉刷新函数
        default: undefined,
        required: false
      },
      onInfinite: {
        type: Function,//底部加载函数
        default: undefined,
        require: false
      },
      showBottom: {
        type: Number,//底部加载函数
        default: undefined,
        require: false
      },
      check: {
        type: Function,//底部加载函数
        default: undefined,
        require: false
      }
    },
    data() {
      return {
        top: 0,
        state: 0,
        startY: 0,
        touching: false,
        loading: true
      }
    },
    methods: {
      touchStart(e) {
        this.startY = e.targetTouches[0].pageY;//获得当前屏幕的Y轴偏移量
        this.startScroll = this.$el.scrollTop || 0;//获得当前元素滚动的垂直像素数
        this.touching = true; //是否在点击中

      },
      touchMove(e) {
        if (!this.touching) {
          return
        }
        let diff = e.targetTouches[0].pageY - this.startY - this.startScroll;//手指触摸屏幕期间的Y轴偏移量与刚开始屏幕的
        if (diff > 0) e.preventDefault();//阻止事件冒泡触发微信的原生拉伸动作
        this.top = Math.pow(diff, 0.8) + (this.state === 2 ? this.offset : 0);
        if (this.state === 2) { // in refreshing
          return
        }
        if (this.top >= this.offset) {
          this.state = 1
        } else {
          this.state = 0
        }

      },
      touchEnd() {

        this.touching = false;
        if (this.state === 2) { // 在refresh的时候，如果往下拖动屏幕
          this.state = 2;
          this.top = this.offset;
          return
        }
        if (this.top >= this.offset) { //当往下滑动屏幕的距离大于我们加载内容的高度的时候执行刷新的操作
          this.refresh()
        } else { // cancel refresh
          this.state = 0;
          this.top = 0
        }
//底部距离
        let outerHeight = this.$el.clientHeight,
          innerHeight = this.$el.querySelector('.inner').clientHeight,
          scrollTop = this.$el.scrollTop,
          ptrHeight = this.onRefresh ? this.$el.querySelector('.pull-refresh').clientHeight : 0,
          bottom = innerHeight - outerHeight - scrollTop - ptrHeight;

        if (bottom <= this.offset + 200) {
          if (this.loading === true) {//阻止重复加载，出现加载完成后就不让再次加载了
            this.infinite();
          }

        }

      },
      refresh() {
        this.state = 2;
        this.top = this.offset;
        setTimeout(()=>{
          this.onRefresh(this.refreshDone)
        },1000)
      },
      refreshDone() {
        this.top = 0;
        this.state = 0
      },

      infinite() {
        this.onInfinite(this.infiniteDone);
      },
      infiniteDone() {
        this.loading = false;
      },
      scrollIng(e){
        let outerHeight = this.$el.clientHeight,
          innerHeight = this.$el.querySelector('.inner').clientHeight,
          scrollTop = this.$el.scrollTop,
          ptrHeight = this.onRefresh ? this.$el.querySelector('.pull-refresh').clientHeight : 0,
          bottom = innerHeight - outerHeight - scrollTop - ptrHeight;

        if (bottom == 0) {
          if (this.loading === false) {
            return;//如果已经显示没有了，就不让他再加载了
          }
          this.infinite();
        } else {
        }
      }
    },
    created(){
this.infinite();//加载两页吧，防止有个加载的符号一直在转。因为数据有点短，自己写的组件就是有点问题，那个刷新的icon是默认存在
    }

  }
</script>
