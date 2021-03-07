import Vue from 'vue'
import './plugins/axios'
import './plugins/bootstrap-vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { MTProto } from '@mtproto/core';

Vue.config.productionTip = false

const api_id = process.env.VUE_APP_API_ID;
const api_hash = process.env.VUE_APP_API_HASH;

Vue.prototype.$mtproto = new MTProto({
  api_id,
  api_hash
});

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
