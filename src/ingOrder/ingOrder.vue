<template>
  <div>
    <scroll :on-refresh="refresh" :offset="100" :showBottom="order.length" :on-infinite="scrollBottom" >
      <div class="orderWrap">
        <div v-if="order.length==0" class="withoutStyle"><img src="../sendHistory/imotion.png" alt="">...
          <div>现在还没有车单呢！</div>
        </div>
        <div class="orderItem  vux-1px-b" v-for="item in order">
          <div class="mainContent vux-1px-b">
            <div class="HeadImageWrap">
              <img :src="item.passenger.headimgurl" class="HeadImage" alt="">
            </div>
            <div class="orderContent">
              <p class="orderPerson">{{item.passenger.trueName}}</p>
              <p class="order">预约时间：{{item.appointmentTime|timeMatch}}</p>
              <div class="routeStyle">
                <p class="orderStart">起车：{{item.departure}}</p>
                <img src="./right.png" alt="" class="right">

                <p class="orderTarget">下车：{{item.destination}}</p>
              </div>
              <p class="order">备注：{{item.ps|ps}}</p>

            </div>
            <div class="orderPrice">
              <p>￥{{item.price|price}}</p>
            </div>
          </div>
          <div class="bottomContent">
            <p class="upTime"> 发布于：{{item.createTime|timeMatch}}</p>
            <router-link to="/driverinfo">

              <button class="receiveButton" @click="stormId(item.id)"> 接单</button>
            </router-link>
          </div>
          <div class="lineStyle"></div>
        </div>

      </div>
    </scroll>
  </div>
</template>


<script type="text/ecmascript-6">
  import headerTitle from "../components/header/title.vue"
  export default {
    components: {
      headerTitle
    },
    data () {
      return {
        title: '订单页面',
        page: {
          pageSize: 10,
          currPage: 1,
        },
        order: {}
      }
    },
    created(){
      this.refresh();
    },
    filters: {
      timeMatch: function (value) {
        if (value) {
          let a = new Date(value);
          return (a.getMonth() + 1) + '/' + a.getDate() + ' ' + a.getHours() + ':' + (a.getMinutes()<10?"0"+a.getMinutes():a.getMinutes());;
        }
      },
      ps: function (value) {
        if (value) {
          return value;
        } else {
          return '无'
        }
      },
      status: function (value) {
        switch (value) {
          case 0:
            return "等待接单";
          case 1:
            return "已被接单";
          case 2:
            return "订单完成";
          case 3:
            return "订单取消";
          case 4:
            return "订单超时";
          case 5:
            return "订单重置"

        }

      },
      price:function (value) {
        if((value+'').indexOf('.')!=-1){
          return value
        }else {
          return value+'.00'
        }}
    },
    methods: {
      stormId(id){
        window.sessionStorage.setItem('orderId', id);
      },
      refresh(done){
        let pageSize = this.page.pageSize * this.page.currPage;
        let page = this.global.toJson({currPage: 1, pageSize: pageSize});
        this.global.postJSON.call(this,'driverOrder/getValidOrders', 'post', page,'加载中')
          .then((data)=> {
            if (data.code == 1) {
              this.order = data.data;
              if (done) {
                this.$toast("刷新成功");
                done();
              }
            } else {
              this.$alert("获取订单列表失败，请尝试刷新页面重新获取");
              if(done) done();
            }
          }, (error)=> {
            this.global.error(this);

          })
      },
      scrollBottom(done){
        this.page.currPage++;
        let page = this.global.toJson(this.page);
        this.global.postJSON.call(this,'driverOrder/getValidOrders', 'post', page)
          .then((data)=> {
            if (data.code = 1) {
              if (data.data.length > 0) {
                let order = data.data;
                //这里可以直接使用this.order.concat(order)方法，可以直接返回一个合并后的数组，只是我老是忘记，记得赋值，不然不会有变化的
                for (let i in order) {
                  this.order.push(order[i]);
                }
              } else {
                done();
              }
            } else if (data.code == 0) {
              if (data.msg) {
                this.$alert(data.msg);
              } else {
                this.$alert("操作失败")
              }
            }
          })
      }
    }
  }
</script>


<style lang="stylus" rel="stylesheet/stylus" scoped>
  .withoutStyle {
    margin-top: 40px;
    text-align: center;
  }

  .orderWrap
    width 100%
    .mainContent
      display flex
      margin 12px 12px 0 12px
      .HeadImageWrap
        flex 0 0 20%
        .HeadImage
          width 50px
          height 50px
          border-radius 50%
      .orderContent
        flex 1
        font-size 15px
        color #393939
        .routeStyle
          display flex
          .orderStart
            margin-right 10px
          .right
            width 40px
            height 16px
          .orderTarget
            margin-left 10px

      .orderPrice
        position absolute
        right 12px
    .bottomContent
      display flex
      justify-content space-between
      height 40px
      .upTime
        font-size 14px
        color #656565
        line-height 40px
        margin-left 12px
      .receiveButton
        height 30px
        margin-top 5px
        margin-right 12px
        background #faac38
        border-radius 5px
        outline 0
        border 0
        color white
        width 80px
    .lineStyle
      width 100%
      height 10px
      background #f4f4f4

</style>
