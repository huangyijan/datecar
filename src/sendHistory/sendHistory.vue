<template>
  <div>
    <headerTitle :titleText="title" ></headerTitle>
    <scroll :on-refresh="refresh" :on-infinite="scrollBottom" :offset="50" :showBottom="order.length">
      <div class="lineStyle"></div>

    <div class="orderWrap " >

      <div class="orderItem " v-for="item in order">
        <div class="title">
          <div class="leftText">司机：<span v-if="item.status==1||item.status==2">{{item.driver.nickName}}</span><span v-if="item.status!=1&&item.status!=2">无</span></div>
          <div class="rightStatus">{{item.status|status}}</div>
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

<div>
  <button class="rightButton" v-if="item.status==1" @click="finish(item.id)">完成</button>
  <button class="rightButton" v-if="item.status==0" @click="cancer(item.id)">取消</button>

  <button class="rightButton" @click="stormId(item.id)">详情</button>
</div>
          </div>
        </div>
        <div class="lineStyle vux-1px-t"></div>
      </div>
      <div v-if="order.length==0" class="withoutStyle"><img src="./imotion.png" alt="">...
        <div>现在还没有车单呢！</div>
      </div>

    </div>

    </scroll>
  </div>
</template>


<script>
  import headerTitle from "../components/header/title.vue"
  import { LoadMore } from 'vux'
  export default {
    components: {
      headerTitle,
      LoadMore
    },
    data () {
      return {
        title: '车单记录',
        imageUrl: 'http://www.diangeyiren.com',
        page: {
          pageSize: 5,
          currPage: 1,
        },
        order: {}

      }
    },
    created(){
this.forReFresh();
    },
    methods: {
      stormId(id){
        window.sessionStorage.setItem('orderId', id);
        this.$router.push({path:'/dirinfo'})
      },
      finish(id){
        this.global.postJSON('passengerOrder/complete', 'post', this.global.toJson({id: id}))
          .then((data)=> {
            if (data.code == 1) {
              this.$alert("订单确认成功！祝您 生活愉快！");
             this.forReFresh();

            } else if (data.code == 0) {
              if (data.msg) {
                this.$alert(data.msg)
              } else {
                this.$alert("操作失败")
              }
            }
          })
      },
      cancer(id){
        this.global.postJSON('passengerOrder/cancel', 'post', this.global.toJson({id: id}))
          .then((data)=> {
            if (data.code == 1) {
              this.$alert("订单取消成功！祝您生活愉快！");
              this.forReFresh();

            }
          })
      },
      scrollBottom(done){
            this.page.currPage++;
            let page = this.global.toJson(this.page);
            this.global.postJSON.call(this,'passengerOrder/getMyOrders', 'post', page)
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
      refresh(done){
        this.forReFresh(true,done)
      },
      forReFresh(IsFresh,done){
        let pageSize=this.page.pageSize*this.page.currPage;
        let page = this.global.toJson({currPage:1,pageSize:pageSize});
        this.global.postJSON.call(this,'passengerOrder/getMyOrders', 'post', page,"加载中")

          .then((data)=> {
            if (data.code == 1) {
              this.order = data.data;
              if(IsFresh){
                this.$toast("更新完成！")
                done();
              }
            }else if(data.code==0&&data.msg){
              this.$alert(data.msg)

            }else {
              this.$alert("操作失败，朋友请重新再来！")
            }
          }, (error)=> {
            if(IsFresh){
              done();
            }
            this.global.error(this);

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
          case 0:

            return "等待接单";
          case 1:
            return "已被接单";
          case 2:
            return "订单完成";
          case 3:
            return "订单取消"
          case 4:
            return "订单超时"
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
            font-size 14px
            letter-spacing 2px
            background #faac38

    .withoutStyle
      margin-top 40px
      text-align center
    .orderLoading
      height 50px
      line-height 50px
      text-align center
      color #faac38
      border-top 1px solid #dedede
      .loadingImg:before
        margin 17px auto 0 auto
        display block
        width 50px
        -webkit-transition-duration 1s
        -moz-transition-property -moz-transform
        -moz-transition-duration 1s
        animation rotation 3s linear infinite
        -moz-animation rotation 3s linear infinite
        -webkit-animation rotation 3s linear infinite
        -o-animation rotation 3s linear infinite
      .bottom
        line-height 50px

</style>
