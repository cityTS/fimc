import { createApp } from 'vue'

// import element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// import iconfont
import './assets/icon/iconfont.css'

import "./style.css"
import App from './App.vue'
import './samples/node-api'

// @ts-ignore
import router from './router/router.js'

// @ts-ignore
import store from './store'


const app = createApp(App)
app.use(store)
app.use(ElementPlus)
app.use(router)
app.mount('#app').$nextTick(() => {
    postMessage({ payload: 'removeLoading'}, '*')
})
