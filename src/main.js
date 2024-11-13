import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router/routes.js';
import { Quasar, Notify } from 'quasar';
import '@quasar/extras/material-icons/material-icons.css';
import 'quasar/src/css/index.sass';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);

app.use(Quasar, {
  plugins: {
    Notify,
    
  },
});

app.use(router);
app.use(pinia);
app.mount('#app');