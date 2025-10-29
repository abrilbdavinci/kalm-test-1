import { createApp } from "vue";
import router from "./router/index.js";
import App from "./App.vue";
import "./style.css";
import { ref } from "vue";

export const currentUser = ref(
  JSON.parse(localStorage.getItem("user")) || null
);

const app = createApp(App);
app.use(router);
app.mount("#app");
