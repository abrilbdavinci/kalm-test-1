import { createApp } from "vue";
import router from "./router/index.js";
import App from "./App.vue";
import "./style.css";
import { ref } from "vue";

// === FONT AWESOME CONFIG ===
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faHouse,
  faMagnifyingGlass,
  faPlus,
  faUsers,
  faBlog,
  faUser,
  faRightToBracket,
  faUserPlus,
  faArrowRightFromBracket,
  faBell,
  faImage
} from "@fortawesome/free-solid-svg-icons";

// Agregamos los íconos a la librería
library.add(
  faHouse,
  faMagnifyingGlass,
  faPlus,
  faUsers,
  faBlog,
  faUser,
  faRightToBracket,
  faUserPlus,
  faArrowRightFromBracket,
  faBell,
  faImage
);
// === FIN FONT AWESOME ===

// Estado reactivo del usuario actual
export const currentUser = ref(
  JSON.parse(localStorage.getItem("user")) || null
);

const app = createApp(App);
app.use(router);

// Registramos el componente global de FontAwesome
app.component("font-awesome-icon", FontAwesomeIcon);

app.mount("#app");
