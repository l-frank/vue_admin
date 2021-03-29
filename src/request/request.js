import Vue from 'vue'
import axios from 'axios'
//配置请求基地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
//全局配置axios:vue原型对象添加axios,这样vue的各个组件中通过this.$http获取axios
Vue.prototype.$http = axios;