<template>
  <div>
    <headerTitle :titleText="title"></headerTitle>
    <p class="IdPerson">你的身份？</p>
    <div class="enterWrap">
      <router-link to="/sendOrder">
        <div class="enterItem">
          <div class="circle">
            <img src="./person.png" alt="" class="IconImage">
          </div>
          <p class="circleText">乘客</p>
        </div>
      </router-link>
      <router-link to="/driverPage/ingOrder">
        <div class="enterItem">
          <div class="circle">
            <img src="./car.png" alt="" class="IconImage">
          </div>
          <p class="circleText">司机</p>
        </div>
      </router-link>
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
        title: '海大约车',
      }
    },
    created(){
      this.$emit("onFade");
      let href=window.location.href;
//检测是否登录
      this.global.postJSON.call(this,'wxWeb/isLogined', 'get',null)
        .then((data) => {
          if (data.code == 0) {
            return this.global.login();
          } else if (data.code == 1) {
            console.log("登录成功");
          }
        }, ()=> {
          this.global.error(this);
        })
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">

  .IdPerson
    text-align center
    height 50px
    line-height 50px
    margin-top 20px
    font-size 18px
    font-weight bold
    letter-spacing 1px
    color #393939

  .enterWrap
    display flex
    flex-direction column
    justify-content space-between
    align-items center
    .enterItem
      flex 1
      margin-top 50px
      width 120px
      height 150px
      text-align center
      .circle
        width 110px
        height 110px
        border-radius 50%
        margin 0 auto
        background #faac38
        .IconImage
          width 50px
          height 50px
          border-radius 50%
          margin-top 30px
      .circleText
        text-align center
        font-size 15px
        line-height 30px
        color #656565
        font-weight bold
        margin-top 20px
</style>
