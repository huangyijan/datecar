<template>
  <div>
    <headerTitle :titleText="title"></headerTitle>
    <div class="inputContainer">
      <div class="textAreaContainer">
        <group :title="suggestionTitle">
          <x-textarea :max="2000" :placeholder="suggestionText" :rows="10" autosize class="textarea" v-model="suggestion" ></x-textarea>
        </group>
      </div>
      <button class="summitButton" @click="summit">确认发送</button>
      <div class="textWrap">
        <p class="tipText">
          ps:谢谢您长得这么好看还，<br/>
          愿意反馈意见给我们(｡･ω･｡)ﾉ♡,<br/>
          完成上面表单完后点击上面的按钮.<br/>
          就可以将信息发给我们的后台小姐姐了.<br/>
        </p>
      </div>
    </div>

  </div>
</template>


<script>
  import headerTitle from "../components/header/title.vue"
  import { XTextarea, Group } from 'vux'
  export default {
    components: {
      headerTitle,
      XTextarea,
      Group
    },
    data () {
      return {
        title: '反馈信息',
        id: {
          id: ''
        },
        order: {},
        suggestionText:'请描述你的问题和意见',
        suggestionTitle:'问题和意见',
        suggestion:''

      }
    },
    created(){

    },
    filters: {},
    methods: {
      summit:function () {
        if(this.suggestion==''){
          this.$alert("表单里还没有内容呢！");
        }else{
          this.global.postJSON.call(this,'order/feedback','post',this.global.toJson({content:this.suggestion}),'提交中')
            .then((data)=>{
              if(data.code==1){
                this.$alert("谢谢你的反馈意见，祝你生活愉快！")
              }else if(data.code==0){
                if(data.msg){
                  this.$alert(data.msg)
                }else {
                  this.$alert("提交失败，请在公众号联系开发者")
                }
              }
            },(error)=>{
              this.global.error(this);
            })
        }
      }
    }
  }
</script>


<style lang="stylus" rel="stylesheet/stylus" scoped>
  .inputContainer
    width 100%
    text-align center
    .inputWrap
      width 92%
      margin-left 4%
      text-align left
      .inputText
        font-size 15px
        color #656565
        line-height 30px
    .textAreaContainer
      width 100%
      text-align left
      .textarea
        font-size 12px
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
      margin-bottom 20px
      .tipText
        font-size 12px
</style>

