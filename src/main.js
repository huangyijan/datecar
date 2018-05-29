import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import App from './App'
import SendOrder from './sendOrder/sendOrder.vue'
import title from './components/header/title.vue'
import sendHistory from './sendHistory/sendHistory.vue'
import judge from './judge/judge.vue'
import driverinfo from './driverInfo/driverInfo.vue'
import userdriverInfo from './uer_driverInfo/user_driverInfo.vue'
import driverPage from './driverPage/dirverPage.vue'
import ingOrder from './ingOrder/ingOrder.vue'
import youOrder from './youOrder/youOrder.vue'
import orderDetail from './orderDetail/youOrderCopy.vue'
import feedback from './feedback/feedback.vue'
import scroll from './components/loading/pull-refresh.vue'
import map from './map/map.vue'
import global from './common/global.vue'
import {Alert, Confirm, Toast} from 'wc-messagebox'
import 'wc-messagebox/style.css'//这个组件有个问题，如果两次alert
import  { LoadingPlugin,Range,Cell,PopupPicker  } from 'vux'
Vue.use(LoadingPlugin)
Vue.component('scroll',scroll);
Vue.component('range',Range);
Vue.component('cell',Cell);
Vue.component('picker',PopupPicker );
//弹窗插件
Vue.use(Alert, {});
Vue.use(Confirm, {});
Vue.use(Toast,{});
Vue.prototype.global=global;
Vue.use(VueRouter);

//手机控制台，一个可以在微信上面的看打印信息的工具，挺好用的，项目打包再去掉
// var VConsole = require('vconsole/dist/vconsole.min.js');
// var vConsole = new VConsole();

const routes = [{
  path: '/',
  redirect: '/judge'
},
  {
  path: '/title',
  component: title
},
  {
  path: '/map',
  component: map
},
  {
  path: '/feedback',
  component: feedback
},
  {
    path: '/sendHistory',
    component: sendHistory
  },
  {
    path: '/judge',
    component: judge
  },
  {
    path: '/sendOrder',
    component: SendOrder
  },
  {
    path: '/driverinfo',
    component: driverinfo
  },
  {
    path: '/dirinfo',
    component: userdriverInfo
  },
  {
    path: '/orderDetail',
    component: orderDetail
  },
  {
    path: '/driverPage',
    component: driverPage,
    children:[
      {
        path:'ingOrder',
        component:ingOrder
      },
      {
        path:'youOrder',
        component:youOrder
      }
    ]
  }
];

const router = new VueRouter({
  routes
});

FastClick.attach(document.body);

Vue.config.productionTip = false;


const showValid=function (ele,errorText) {
};
/* eslint-disable no-new */
new Vue({
  router,
  showValid,
  render: h => h(App)
}).$mount('#app-box');
