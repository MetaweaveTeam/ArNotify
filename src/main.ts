import { createApp } from "vue";
import { createPinia } from "pinia";
import axios from "axios";
import VueAxios from "vue-axios";
import App from "./App.vue";
import router from "./router";

import "./assets/main.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);
axios.defaults.withCredentials = true;
// only for dev
axios.interceptors.request.use(
  (config) => {
    (config as any).headers["ngrok-skip-browser-warning"] = `111`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
app.use(VueAxios, axios);

app.provide("axios", app.config.globalProperties.axios);
app.provide("router", router);
app.mount("#app");
