<template>
  <div class="orderTop" :style="{height:height+'px'}">
    <div class="orderWrap">
      <div class="triangle"></div>
      <div class="mainContent">
        <div class="inputItem">
          <p>乘客姓名: {{order.passenger.trueName}}</p>
          <p>联系方式: {{order.passenger.phoneNumber}}</p>
          <p>预约时间: {{order.appointmentTime|timeMatch}}</p>
          <p>上车地点: {{order.departure}}</p>
          <p>下车地点: {{order.destination}}</p>
          <p>价格: {{order.price}}.00元</p>
          <p>备注: {{order.ps|ps}}</p>
        </div>

      </div>
      <div class="ButtonWrap">
        <button class="callButton">拨打乘客</button>
        <button class="callButton" onclick="javascript:void(history.back(-1))">返回上一页</button>
      </div>
    </div>
  </div>
</template>


<script type="text/ecmascript-6">
  export default{
    data () {
      return {
        height:0,
        page: {
          pageSize: 50,
          currPage: 1
        },
        order:{
          passenger:{}
        }
      }

    },
    filters:{
      timeMatch:function (value) {
        if(value){
          let a=new Date(value);
          return (a.getMonth()+1)+'/'+a.getDate()+' '+a.getHours()+':'+a.getMinutes();
        }
      },
      ps:function (value) {
        if(value){
          return value;
        }else{
          return '无'
        }
      }
    },
    created(){
      this.height=window.screen.availHeight-88;
      let page=this.global.toJson(this.page);

      this.global.postJSON.call(this,'driverOrder/getMyOrders','post',page)
        .then((data)=>{
          if(data.code==1){
            if(data.data.length==0){
              this.$alert("您当前还没有接任何车单，请在接单页面去获得订单！");
              this.$router.push({path:'/driverPage/ingOrder'})
            }else{
              this.order=data.data[0];//这里获得当前订单，不应该是一个数组，要小强改
            }
          }else{
            this.$alert("获得进行订单出错");
          }
        },(error)=>{
          this.global.error(this);

        })
    }
  }
</script>


<style lang="stylus" rel="stylesheet/stylus" scoped>
  .orderTop
    width 100%
    height 100%
    position relative
    .orderWrap
      position absolute
      margin auto
      top 0
      bottom 0
      right 0
      left 0
      border 1px solid #dedede
      width 250px
      height 350px
      .triangle
        width 0
        height 0
        border-top 30px solid #faac38
        border-right 30px solid transparent
      .mainContent
        position relative
        font-size 15px
        color #393939
        padding-left 50px
        margin-top 0
        line-height 30px
      .ButtonWrap
        text-align center
        .callButton
          width 70%
          height 30px
          color #fef4e9
          margin-top 15px
          border 1px #faac38
          font-size 15px
          font-weight bold
          letter-spacing 2px
          background: -webkit-gradient(linear, left top, right bottom, from(#faac38), to(#d04300));
          background -moz-linear-gradient(top, #faac38, #d04300)


</style>
