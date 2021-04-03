import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './request/request.js'
import TreeTable from 'vue-table-with-tree-grid'
//全局注册树形表格组件
Vue.component('tree-table', TreeTable)



Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')