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

const authGuard = (to, from, next) => {
  if (!currentUser.value) {
    next('/login'); // redirige si no hay usuario
  } else {
    next();
  }
};

const routes = [
  { path: "/", component: Home },
  { path: "/tests", component: Tests, beforeEnter: authGuard },
  { path: "/tests/:id", component: TestDetail, props: true, beforeEnter: authGuard },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/about", component: About },
  { path: "/contacto", component: Contact },
  { path: "/planes", component: Plans },
  { path: '/resultado', component: Resultado, props: true, beforeEnter: authGuard },
  { path: '/perfil', name: 'Perfil', component: Perfil, props: true, beforeEnter: authGuard }
];


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
