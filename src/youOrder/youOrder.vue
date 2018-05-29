<template>
  <div>
    <div class="lineStyle"></div>
    <scroll :on-refresh="refresh" :on-infinite="scrollBottom" :offset="101" :showBottom="order.length">

    <div class="orderWrap">
      <div class="orderItem " v-for="item in order">
        <div class="title vux-1px-b">
          <div class="leftText">乘客：<span>{{item.passenger.trueName}}</span></div>
          <div class="rightStatus1" v-if="item.status==1">{{item.status|status}}</span></div>
          <div class="rightStatus" v-if="item.status!=1">{{item.status|status}}</span></div>
        </div>
        <div class="middle">
          <div class="ImageDiv">
            <img :src="item.passenger.headimgurl" alt="" class="imageStyle"
                 onerror="this.onerror=null;this.src='http://192.168.2.162:8080/src/sendHistory/1.png'">
          </div>
          <div class="infoWrap">
            <p class="textStyle">你的起点：{{item.departure}}</p>
            <p class="textStyle">你的终点：{{item.destination}}</p>
            <p class="textStyle">预约时间：{{item.appointmentTime|timeMatch}}</p>
            <p class="textStyle">备注：{{item.ps|ps}}</p>
          </div>
          <div class="priceWrap">
            <p><span style="font-size: 15px">￥</span>{{item.price|price}}</p>
          </div>
        </div>
        <div class="bottom">
          <div class="container vux-1px-t">
            <p class="timeStyle">发布于：{{item.createTime|timeMatch}}</p>

              <button class="rightButton" @click="stormId(item.id)">详情</button>
          </div>
        </div>
        <div class="lineStyle vux-1px-t"></div>
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
        imageUrl: 'http://www.diangeyiren.com',
        page: {
          pageSize: 10,
          currPage: 1
        },
        order: {}

      }
    },
    created(){
      this.refresh();
    },
    methods: {
      stormId(id){
        window.sessionStorage.setItem('orderId', id);
        this.$router.push({path:'/orderDetail'})
      },
      refresh(done){
        let pageSize = this.page.pageSize * this.page.currPage;
        let page = this.global.toJson({currPage: 1, pageSize: pageSize});
        this.global.postJSON.call(this,'driverOrder/getMyOrders', 'post', page,'加载中')
          .then((data)=> {
            if (data.code == 1) {
              if (data.data.length == 0) {
                this.$alert("您当前还没有接任何车单，请在接单页面去获得订单！");
                this.$router.push({path: '/driverPage/ingOrder'})
              } else {
                this.order = data.data;
                if(done) {
                  this.$toast("更新成功")
                  done();}
              }
            } else {
              this.$alert("获得进行订单出错");
            }
          }, (error)=> {
            this.global.error(this);

          })
      },
      scrollBottom(done){
        this.page.currPage++;
        let page = this.global.toJson(this.page);
        this.global.postJSON.call(this,'driverOrder/getMyOrders', 'post', page)
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
      },

    },
    filters: {
      timeMatch: function (value) {
        if (value) {
          let a = new Date(value);
          return (a.getMonth() + 1) + '/' + a.getDate() + ' ' + a.getHours() + ':' + (a.getMinutes()<10?"0"+a.getMinutes():a.getMinutes());
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

          case 1:
            return "进行订单";
          case 2:
            return "已完成订单";
          case 3:
            return "订单取消";
          case 4:
            return "订单超时";

        }

      },
      price:function (value) {
        if((value+'').indexOf('.')!=-1){
          return value
        }else {
          return value+'.00'
        }
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .lineStyle
    width 100%
    height 10px
    background #f4f4f4

  .orderWrap
    width 100%
    .orderItem
      position relative
      .title
        display flex
        justify-content space-between
        height 50px
        line-height 50px
        .leftText
          margin-left 12px
          font-size 14px
          color #656565
        .rightStatus
          font-size 15px
          margin-right 12px
          color #faac38
        .rightStatus1
          font-size 15px
          margin-right 12px
          color #9cd000
      .middle
        display flex
        flex-wrap: wrap;
        margin 0 12px
        height 120px
        .ImageDiv
          flex 0 0 15%
          width 40px
          height 40px
          margin 40px 12px
          .imageStyle
            background black
            height 40px
            border-radius 50%
            width 40px
        .infoWrap
          flex 1
          padding-top 10px
          .textStyle
            font-size 14px
            color #393939
            letter-spacing 1px
        .priceWrap
          flex 0 0 10%
          font-size 20px
          font-weight bold
          margin-top 12px

      .bottom
        width 100%
        height 50px
        .container
          display flex
          width 80%
          margin 0 10%
          justify-content space-between
          font-size 14px
          .timeStyle
            line-height 50px
          .rightButton
            width 50px
            height 30px
            margin-top 10px
            border-radius 5px
            color #fef4e9
            border 1px #faac38
            font-size 16px
            letter-spacing 2px
            background #faac38


</style>
