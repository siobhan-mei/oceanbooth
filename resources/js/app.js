import './bootstrap';
import { createApp } from 'vue';
import App from './components/App.vue';
import 'vue-advanced-cropper/dist/style.css';
                         
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import router from './router';

createApp(App).use(router).mount('#app');