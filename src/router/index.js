import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Tests from "../views/Tests.vue";
import TestDetail from "../views/TestDetail.vue"; 
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Resultado from '../views/Resultado.vue';
import { currentUser } from '../main.js';
import About from "../views/About.vue";
import Contact from "../views/Contact.vue";
import Plans from "../views/Plans.vue";
import Perfil from '../views/Perfil.vue';
import CrearPost from "../views/CrearPost.vue";
import Reviews from "../views/Reviews.vue";
import Blog from "../views/Blog.vue";
import Buscar from "../views/Buscar.vue";

const authGuard = (to, from, next) => {
  if (!currentUser.value) {
    next('/'); // redirige si no hay usuario
  } else {
    next();
  }
};

// 🚫 Evita acceder a login/register si ya hay sesión
const guestGuard = (to, from, next) => {
  if (currentUser.value) {
    next('/'); // redirige al Home o al perfil si preferís
  } else {
    next();
  }
};

const routes = [
  { path: "/", component: Home , beforeEnter: authGuard},
  { path: "/tests", component: Tests, beforeEnter: authGuard },
  { path: "/tests/:id", component: TestDetail, props: true, beforeEnter: authGuard },
  { path: "/login", component: Login, beforeEnter: guestGuard },
  { path: "/register", component: Register, beforeEnter: guestGuard},
  { path: "/about", component: About , beforeEnter: authGuard},
  { path: "/crear-post", component: CrearPost , beforeEnter: authGuard},
  { path: "/contacto", component: Contact , beforeEnter: authGuard},
  { path: "/planes", component: Plans , beforeEnter: authGuard},
  { path: "/buscar", component: Buscar , beforeEnter: authGuard},
  { path: "/reviews", component: Reviews , beforeEnter: authGuard},
  { path: "/blog", component: Blog , beforeEnter: authGuard},
  { path: '/resultado', component: Resultado, props: true, beforeEnter: authGuard },
  { path: '/perfil', name: 'Perfil', component: Perfil, props: true, beforeEnter: authGuard }
];


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
