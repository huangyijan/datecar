<template>
  <div>
    <div v-if="loading">
      <loading></loading>
    </div>
    <headerTitle :titleText="title"></headerTitle>


    <div class="inputContainer">
      <form class="inputWrap">
        <div class="form">
          <label class="label">姓名：</label>
          <input type="text" class="input_style" required placeholder="请输入您的姓名" v-model="order.passenger.trueName" pattern="[\u4e00-\u9fa5]{2,}"
                 @invalid="showValid($event,'真实姓名必须是中文，且长度不小于2')"/>
          <span class="icon-warning LocationStyle" style="color: red" v-show="!order.passenger.trueName"
                v-if="name"></span>
        </div>
        <div class="form">
          <label class="label">电话：</label>
          <input type="tel" class="input_style" placeholder="请输入您的联系方式" v-model="order.passenger.phoneNumber" required  pattern="1[34578]\d{9}$"  @invalid="showValid($event,'电话只能是11位数字')" />
          <span class="icon-warning LocationStyle" style="color: red" v-show="!order.passenger.phoneNumber"
                v-if="name"></span>

        </div>
        <div class="form">
          <label class="label">位置：</label>
          <input type="text" class="input_style" placeholder="请输入你的上车位置" v-model="order.departure" required />
          <router-link to="/map">
          <span class="icon-location2 LocationStyle"></span>

          </router-link>

        </div>
        <div class="form">
          <label class="label">目的地：</label>
          <input type="text" class="input_style" placeholder="请输入你要到达的位置" v-model="order.destination" required/>
          <span class="icon-warning LocationStyle" style="color: red" v-show="!order.destination" v-if="name"></span>
        </div>
        <div class="form">
          <label class="label">价格：</label>
          <input type="number" pattern="[0-9]*" class="input_style" placeholder="请输入你预期的乘车价格(元)" v-model="order.price" required/>
          <span class="icon-warning LocationStyle" style="color: red" v-show="!order.price" v-if="name"></span>

        </div>
        <div class="form">
          <cell title="上车时间:" :inline-desc="appointmentTime1" primary="content">
            <range :min="0" :max="TIMEUP"  v-model="appointmentTime"></range>
          </cell>
        </div>
        <div class="form" style="height: 27px">
          <label class="label">保留时间：</label>
          <!--<input type="text" class="input_style" placeholder="请选择你保留订单的时间(小时)" v-model="validTime" required @click="showPick"/>-->

          <select name="saveTime" id="saveTime" class="input_style selectStyle" v-model="validTime[0]"  @touchstart="showPick" disabled >
            <option value="0">请选择您保留订单的时间</option>
            <option value="0.05">3分钟</option>
            <option value="0.1">6分钟</option>
            <option value="0.5">30分钟</option>
            <option value="1">1个小时</option>
            <option value="2">2个小时</option>
            <option value="3">3个小时</option>
            <option value="4">4个小时</option>
            <option value="5">5个小时</option>
            <option value="8">8个小时</option>
            <option value="12">12个小时</option>
          </select>

        </div>

        <div class="form">
          <label class="label">备注：</label>
          <input type="text" class="input_style" placeholder="这个可选，你有什么要对司机说的？" v-model="order.ps"/>

        </div>
      </form>
      <button class="summitButton" @click="sendOrder" >确认发布</button>
      <div class="textWrap"  >
        <p class="tipText">
          ps:为了保护您的隐私，<br/>
          我们将会在司机接单后,<br/>
          再向司机推送你的的电话号码.<br/>
        </p>
      </div>
    </div>
    <picker :show="showPopupPicker" :data="saveTime" v-model="validTime" @on-show="onShow" @on-hide="onHide" @on-change="onChange" v-show="false"></picker>


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
        title: '发布车单',
        order: {
          passenger: {
            trueName:'',
            phoneNumber:''
          },
          departure:'',
          destination:'',
          price:null
        },
        showPopupPicker:false,//显示时间显示
        name: false,
        appointmentTime: 0,
        validTime: ['0'],
        loading:false,
        appointmentTime1:'现在',
        TIMEUP:0,//这里写用来限制晚上12点之后不能发单
        saveTime:[[{
          name: '三分钟',
          value: '0.05'
        }, {
          name: '六分钟',
          value: '0.1'
        }, {
          name: '30分钟',
          value: '0.5'
        }, {
          name: '1个小时',
          value: '1'
        }, {
          name: '2个小时',
          value: '2'
        }, {
          name: '3个小时',
          value: '3'
        }, {
          name: '4个小时',
          value: '4'
        }, {
          name: '5个小时',
          value: '5'
        }, {
          name: '8个小时',
          value: '8'
        },{
          name: '12个小时',
          value: '12'
        }
        ]]
      }
    },
    created(){
      let TIME = new Date();
      this.TIMEUP=24-parseInt(TIME.getHours());
      this.appointmentTime1="现在:"+TIME.getHours()+':'+(TIME.getMinutes()<10?"0"+TIME.getMinutes():TIME.getMinutes());
      this.$emit("onShow");
      if(window.sessionStorage.getItem('goAddress')){
        this.order.departure=window.sessionStorage.getItem('goAddress');
      }
      this.global.postJSON.call(this, '/getUserInfo','get',null,"获取信息中")
        .then((data)=>{
          if(data.code==1){
            this.order.passenger.trueName=data.data.trueName;
            this.order.passenger.phoneNumber=data.data.phoneNumber;
          }else {
            return;
          }
        },(error)=>{
          this.global.error(this);
      })
    },
    methods: {
      sendOrder(){
        //获得订单倒计时
        this.order.validTime = this.validTime[0]* 3600;
        //获得预约时间
        let TIME = new Date();
        TIME.setHours(parseInt(TIME.getHours()) + parseInt(this.appointmentTime));
        TIME.setMinutes(parseInt(TIME.getMinutes()) + 3);
        this.order.appointmentTime = TIME.getTime();
        //判断表单不能为空
        if (this.order.passenger.trueName && this.order.passenger.phoneNumber && this.order.departure
          && this.order.appointmentTime && this.order.validTime && this.order.price) {
          //序列化成JSON对象
          let order = this.global.toJson(this.order);
          //提交请求
          this.global.postJSON.call(this,'passengerOrder/add', 'post', order)
            .then((data)=> {
              if (data.code == 1) {
                this.$toast("发送订单成功！")
                this.$router.push({path: '/sendHistory'})
              }else if (data.code == 0) {
                this.$alert("你的上一个订单未完成，请完成或取消上次订单！")
                this.$router.push({path: '/sendHistory'})
              }
            }, ()=> {
              this.global.error(this);
            })
        } else {
          //表单验证提示
          this.name = true;
          this.$alert("表单未填完整！")
        }

      },
      showValid(even, text){
        even.target.setCustomValidity(text);
        setTimeout(function () {
          even.target.setCustomValidity('');
          return true;
        },3000)
      },
      onChange (val) {
        console.log(val)
        this.validTime=val;
      },
      onShow () {
        console.log('on show')
      },
      onHide (type) {
        this.showPopupPicker=false;
      },
      showPick(e){
        e.preventDefault();
        this.showPopupPicker=true;
      }
    },
    watch: {
      appointmentTime:function () {
        let TIME = new Date();

        if(this.appointmentTime==0){
          this.appointmentTime1="现在:"+TIME.getHours()+':'+(TIME.getMinutes()<10?"0"+TIME.getMinutes():TIME.getMinutes());
        }else {
          this.appointmentTime1="今天:"+(TIME.getHours()+this.appointmentTime)+':'+(TIME.getMinutes()<10?"0"+TIME.getMinutes():TIME.getMinutes());
        }
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
      .form
        font-size 14px
        margin-top 10px
        border-bottom 1px solid #dedede
        .label
          width 25%
          padding-left 5px
          padding-top 5px
        .input_style
          margin-bottom 5px
          height 18px
          width 65%
          outline none
          border none

        .selectStyle
          background white
          appearance none
          -moz-appearance none
          -webkit-appearance none
          color #656565
        .LocationStyle
          position absolute
          font-size 16px
          padding 0 6px
          color #faac38
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

    .textWrap
      margin-top 20px
      .tipText
        font-size 12px

</style>
