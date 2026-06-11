import Thevue from '@thevue/vue'
import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

const app = createApp(App)
app.use(Thevue)
app.mount('#app')
