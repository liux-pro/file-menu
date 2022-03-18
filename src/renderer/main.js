import Vue from 'vue'
import ElementUI from '@femessage/element-ui'
import '@femessage/element-ui/lib/theme-chalk/index.css'
import App from './App'

Vue.config.productionTip = false
Vue.use(ElementUI)

/* eslint-disable no-new */
window.vue = new Vue({
  components: {App},
  template: '<App/>'
}).$mount('#app')
