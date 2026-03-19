import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import { setRouter } from './api/client.js'
import './style.css'

setRouter(router)
createApp(App).use(router).mount('#app')
