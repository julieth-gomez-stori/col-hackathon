import { createApp } from 'vue'
import App from './App.vue'
import { hydrateFromApi } from './store'
import './style.css'

hydrateFromApi()
createApp(App).mount('#app')
