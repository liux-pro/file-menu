import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'

Vue.use(ElementUI)

/* eslint-disable no-new */
window.vue = new Vue({
  components: {App},
  template: '<App/>'
}).$mount('#app')
