<template>
  <div>

  </div>
</template>


<script>
  //全局组件
  //这里写的是全局请求的URL端口地址
  const URL = "http://hyjweb.com/gdou-car/";
  //全局的登录函数
  const login = function () {
    postJSON('wxWeb/getLoginUrl?callbackUrl=http://192.168.2.162:8080', 'get')
      .then((data)=> {
        if (data.code == 1) {
          window.location.href = data.data;
        } else {
          alert("获取登录地址失效，请检查网络，或者在公众号联系开发者")
        }
      }, ()=> {
        that.$alert("登录失败，请检查网络！")
      })
  };
  //全局错误处理的函数
  const error = function (that) {
    that.$alert("网络连接失败，请检查网络！")
  };
  //全局请求函数
  //loading用来显示加载字符
  const postJSON = function (url, type, data, loading) {
    let vue = this;
    if (loading &&loading!='') {
      vue.$vux.loading.show({
        text: loading
      });
    }
    const promise = new Promise(function (resolve, reject) {
      const handler = function () {
        if (this.readyState !== 4) {

          return
        }
        if (this.status >= 500) {
          if (loading &&loading!='')
            vue.$vux.loading.hide();
          vue.$alert("服务器后台出现问题，请在公众号联系开发者")
        }
        if (this.status === 200) {
          //登陆cookies失效处理
          if (loading &&loading!='')
            vue.$vux.loading.hide();
          if (this.response.code == -1) {
            alert("登陆凭证过期，请重新登陆！");
            login();
          }
          resolve(this.response);
        } else {
          if (loading &&loading!='')
            vue.$vux.loading.hide();
          reject(new Error(this.statusText));
        }
      };
      const client = new XMLHttpRequest();
      //保留cookies
      client.timeout = 6000;
      client.ontimeout = function () {
        if (loading &&loading!='')
          vue.$vux.loading.hide();
      };
      client.withCredentials = true;
      client.open(type, URL + url, true);
      client.onreadystatechange = handler;
      client.responseType = "json";
      client.setRequestHeader("Accept", "application/json");
      client.setRequestHeader("Content-Type", "application/json");
//提交数据
      client.send(data);
    });
    return promise;
  };
  //将对象装换成json字符串
  const toJson = function (data) {
    let a = JSON.stringify(data);
    return a;

  };
  export default{
    //暴露到全局的环境可以被调用，在main.js里面可以看到具体的调用方法
    postJSON,
    login,
    error,
    toJson,
    data () {
      return {}

    }
  }
</script>


<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
