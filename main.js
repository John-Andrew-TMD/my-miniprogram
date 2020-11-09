import Vue from 'vue'
import App from './App'
import store from './store'
import uView from "uview-ui";
import * as filters from './filters' // global filters
Vue.use(uView);
Vue.config.productionTip = false
Vue.prototype.$store = store
App.mpType = 'app'
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
const app = new Vue({
	store,
    ...App
})
app.$mount()
