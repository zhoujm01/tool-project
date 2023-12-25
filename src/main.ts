import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index'
import "@/font/font.css";
import appSettings from "./app-settings"

const app = createApp(App);

app.use(router);

app.config.globalProperties.$appSettings = appSettings;


app.mount('#app');

export { app };
