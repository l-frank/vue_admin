import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css'
import { Button, Form, FormItem, Input, Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
    //将Message添加到原型对象中，vue组件中可以通过this获取Message
Vue.prototype.$message = Message;