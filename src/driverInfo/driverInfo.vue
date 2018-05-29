<template>
  <div>
    <headerTitle :titleText="title"></headerTitle>
    <div class="inputContainer">
      <div class="inputWrap">
        <div class="form">
          <label class="label">姓名：</label>
          <input type="text" class="input_style" placeholder="请输入您的姓名" v-model="drive.driver.trueName" />
        </div>
        <div class="form">
          <label class="label">电话：</label>
          <input type="tel" class="input_style" placeholder="请输入您的联系方式" v-model="drive.driver.phoneNumber"/>
        </div>
        <div class="form" style="border: 0">
          <label class="label">性別：</label>

          <div class="radioWrap">

            <button-tab :height="25" class="tabStyle" v-model="sex" :value="1">
              <button-tab-item>男</button-tab-item>
              <button-tab-item>女</button-tab-item>
            </button-tab>
          </div>

        </div>
      </div>
        <button class="summitButton" @click="summitInfo">确认信息</button>
      <div class="textWrap">
        <p class="tipText">
          ps:当你接单后，<br/>
          你的上述信息将会推送给目标用户<br/>

        </p>
      </div>
    </div>
  </div>
</template>

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
          width 75%
          outline none
          border none

        .radioWrap
          width 75%
          display inline-block
          font-size 14px
          margin-bottom 5px
          .tabStyle
            width 50%
            margin-left 20px
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

<script type="text/ecmascript-6">
  import headerTitle from "../components/header/title.vue"
  import {ButtonTab, ButtonTabItem} from "vux"
  export default {
    components: {
      headerTitle,
      ButtonTab,
      ButtonTabItem
    },
    data () {
      return {
        title: '填写司机个人信息',
        drive:{
          driver:{
            trueName:'',
            phoneNumber:'',
            sex:''
          },
          id:''
        },
        sex:0
      }
    },
    created(){
      this.global.postJSON.call(this,'/getUserInfo','get')
        .then((data)=>{
          if(data.code==1){

            this.drive.driver.trueName=data.data.trueName;
            this.drive.driver.phoneNumber=data.data.phoneNumber;
            this.sex=parseInt(data.data.sex)-1;
          }else if(data.code==0){
            //如果返回的信息包含msg，那么就直接弹出来
            if(data.msg){
              this.$alert(data.msg)
            }else{
              this.$alert("操作失败！，请稍后重试！")
            }
          }
        },(error)=>{
          this.global.error(this);
        })
    },
    destroyed(){
    },
    methods:{
      summitInfo(){
        let id=window.sessionStorage.getItem('orderId');
        this.drive.id=id;
        this.drive.driver.sex=(this.sex+1).toString();
        let driverInfo=this.global.toJson(this.drive);
        this.global.postJSON.call(this,'driverOrder/takeOrder','post',driverInfo)
          .then((data)=>{
            if(data.code==1){
              this.$toast("接单成功！")
              this.$router.push({path:'/driverPage/youOrder'})
            }else if(data.code==0){
              if(data.msg) {
                this.$alert(data.msg);
              }else {
                this.$alert("请检查信息完整!");

              }
            }
          },(error)=>{
            this.global.error(this);
          })
      }
    }
  }
</script>
