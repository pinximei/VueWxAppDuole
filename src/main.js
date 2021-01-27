// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import i18n from './lang/lang.js'
import store from './data/vuexstore.js'
import md5 from 'js-md5';
import axios from './data/axios.js'
import oView from "oview";
import qs from "Qs"
import Vant from 'vant';
import 'vant/lib/index.css';
import sha1 from 'js-sha1'
import wx from 'weixin-js-sdk'

Vue.prototype.$sha1 = sha1
Vue.prototype.$wx = wx
Vue.use(Vant);
Vue.prototype.$http = axios
Vue.use(oView);

Vue.prototype.$qs = qs;
store.state.openId = localStorage.getItem('openId') == null ? "" : localStorage.getItem('openId');
Vue.config.productionTip = false
Vue.prototype.$md5 = md5;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  components: { App },
  template: '<App/>'
})
