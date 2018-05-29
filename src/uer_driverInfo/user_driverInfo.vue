<template>
    <div>
        <headerTitle :titleText="title"></headerTitle>
        <div class="inputContainer">
            <div class="inputWrap">
                <div class="form">
                    <label class="label">订单状态： {{order.status|status}}</label>
                </div>
                <div class="form" v-if="order.status==2||order.status==1">
                    <label class="label">司机： {{order.driver.trueName}}</label>
                    <img src="../uer_driverInfo/male.png" alt="" v-if="order.driver.sex=='1'">
                    <img src="../uer_driverInfo/female.png" alt="" v-if="order.driver.sex=='2'">
                </div>
                <div class="form" v-if="order.status==2||order.status==1">
                    <label class="label">电话： {{order.driver.phoneNumber}}</label>
                    <a href="tel:+order.phoneNumber">
                        <p class="phoneText">拨号</p>
                        <img src="../uer_driverInfo/phone.png" alt="" class="phoneStyle">
                    </a>
                </div>
                <div class="form">
                    <label class="label">你的上车位置： {{order.departure}}</label>

                </div>
                <div class="form">
                    <label class="label">你的目的地： {{order.destination}}</label>
                </div>
                <div class="form">
                    <label class="label">价格： {{order.price}}.00元</label>
                </div>
                <div class="form">
                    <label class="label">预约时间： {{order.appointmentTime|timeMatch}}</label>
                </div>
                <div class="form">
                    <label class="label">备注： {{order.ps|ps}}</label>
                </div>
            </div>

            <button class="summitButton" @click="cancerOrder" v-if="order.status==0||order.status==1">取消订单</button>
            <button class="summitButton" onclick="javascript:void(history.back(-1))">返回上一页</button>
        </div>
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
            title: '订单信息',
            id:{
              id:''
            },
            order:{}

          }
        },
      created(){
        this.id.id=window.sessionStorage.getItem('orderId');

        this.global.postJSON.call(this,'order/getOrderDetail','post',this.global.toJson(this.id))
          .then((data)=>{
            if(data.code==1){
              this.order=data.data;
            }
          },(error)=>{
            this.global.error(this);

          })
      },
      filters:{
        timeMatch:function (value) {
          if(value){
            let a=new Date(value);
            return a.getFullYear()+'-'+(a.getMonth()+1)+'-'+a.getDay()+' '+a.getHours()+':'+a.getMinutes();
          }
        },
        ps:function (value) {
          if(value){
            return value;
          }else{
            return '无'
          }
        },
        status:function (value) {
          switch (value){
            case 0:
              return "等待接单";
            case 1:
              return "已被接单";
            case 2:
              return "订单完成"
            case 3:
              return "订单取消"
            case 4:
              return "订单超时"
            case 5:
              return "订单重置"

          }

        }
      },
      methods:{
        cancerOrder(){
          this.global.postJSON.call(this,'passengerOrder/cancel','post',this.global.toJson(this.id))
            .then((data)=>{
              if(data.code==1){
                this.$alert("取消订单成功！");
                this.$router.push({path:'/sendHistory'})
              }else{
                this.$alert("您的订单当前状态不可取消！")
              }
            },(error)=>{
              this.global.error(this);
            })
        }
      }
    }
</script>


<style lang="stylus" rel="stylesheet/stylus" scoped>
    .inputContainer
        width 100%
        margin-top 20px
        text-align center
        .inputWrap
            width 86%
            margin-left 7%
            text-align left
            .form
                font-size 14px
                margin-top 10px
                border-bottom 1px solid #dedede
                .label
                    width 25%
                    padding-left 5px
                    padding-top 5px
                .phoneStyle
                    width 20px
                    height 20px
                    display inline-block
                    float right
                    padding 3px 5px
                    margin-top -5px
                .phoneText
                    display inline-block
                    float right
                    font-size 14px
                    margin-right 10px
                    line-height 20px
                    margin-top -2px
                    color #d04300
        .summitButton
            width 80%
            height 45px
            color #fef4e9
            margin-top 15px
            border 1px #faac38
            font-size 16px
            font-weight bold
            letter-spacing 2px
            background: -webkit-gradient(linear, left top, right bottom, from(#faac38), to(#d04300));
            background -moz-linear-gradient(top, #faac38, #d04300)

</style>

