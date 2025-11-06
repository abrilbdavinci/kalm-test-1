<script>
import { currentUser } from '../main.js';
import { useRouter } from 'vue-router';
import BtnLight from './BtnLight.vue';
import BtnDark from './BtnDark.vue';
import MainTitle from './MainTitle.vue';
import SubTitle from './SubTitle.vue';

export default {
  name: 'Navbar',
  components: { BtnLight, BtnDark, MainTitle, SubTitle },
  setup() {
    const router = useRouter();

    const logout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      currentUser.value = null;
      router.push('/login');
    };

    return { currentUser, logout };
  },
};
</script>

<template>
  <nav
    class="fixed z-50 flex items-center justify-between 
            glass-nav rounded-full border border-white/40 
            shadow-[0_8px_30px_rgba(55,160,175,0.3)] 
            p-3 w-[95%] max-w-[1500px]
            left-1/2 -translate-x-1/2 top-4
            transition-all duration-500 ease-in-out
            backdrop-blur-[100px] bg-white/30
            max-[1060px]:bottom-4 max-[1060px]:top-auto 
            max-[1060px]:rounded-full max-[1060px]:py-5 px-7
            max-[1060px]:w-[95%] max-[1060px]:justify-center"
  >
    <!-- LOGO -->
    <div class="hidden min-[1061px]:flex items-center ml-5">
      <img src="./../assets/img/logo-kalm.svg" alt="Logo Kälm" class="h-10">
      <p class="logo-text text-lg pt-1 ms-1">Kälm</p>
    </div>

    <!-- ÍCONOS DE NAVEGACIÓN -->
    <div class="flex flex-1 items-center space-x-6 justify-between min-[1061px]:justify-center min-[1061px]:space-x-8">
      <!-- Inicio -->
      <RouterLink
        to="/"
        class="flex flex-col md:flex-row items-center font-bold text-[#306067]"
      >
        <font-awesome-icon icon="fa-solid fa-house" class="text-xl md:mr-2" />
        <span class="hidden min-[1061px]:inline-block text-xs md:text-base">Inicio</span>
      </RouterLink>

      <!-- Tests -->
      <RouterLink
        to="/tests"
        class="flex flex-col md:flex-row items-center font-bold text-[#306067]"
      >
        <font-awesome-icon icon="fa-solid fa-vials" class="text-xl md:mr-2" />
        <span class="hidden min-[1061px]:inline-block text-xs md:text-base">Tests</span>
      </RouterLink>

      <!-- Planes -->
      <RouterLink
        to="/planes"
        class="flex flex-col md:flex-row items-center font-bold text-[#306067]"
      >
        <font-awesome-icon icon="fa-solid fa-list-check" class="text-xl md:mr-2" />
        <span class="hidden min-[1061px]:inline-block text-xs md:text-base">Planes</span>
      </RouterLink>

      <!-- Sobre -->
      <RouterLink
        to="/about"
        class="flex flex-col md:flex-row items-center font-bold text-[#306067]"
      >
        <font-awesome-icon icon="fa-solid fa-leaf" class="text-xl md:mr-2" />
        <span class="hidden min-[1061px]:inline-block text-xs md:text-base">Sobre</span>
      </RouterLink>

      <!-- Contacto -->
      <RouterLink
        to="/contacto"
        class="flex flex-col md:flex-row items-center font-bold text-[#306067]"
      >
        <font-awesome-icon icon="fa-solid fa-envelope" class="text-xl md:mr-2" />
        <span class="hidden min-[1061px]:inline-block text-xs md:text-base">Contacto</span>
      </RouterLink>
    </div>

    <!-- BOTONES DE USUARIO / CUENTA -->
    <div class="hidden min-[1061px]:flex items-center gap-4 justify-end w-auto">
      <template v-if="!currentUser">
        <RouterLink to="/login">
          <BtnLight>Iniciar sesión</BtnLight>
        </RouterLink>
        <RouterLink to="/register">
          <BtnDark>Crear cuenta</BtnDark>
        </RouterLink>
      </template>

      <template v-else>
        <h2 class="text-lg font-bold text-[#F7FEFFFF]">
          Hola, {{ currentUser.name }}
        </h2>
        <BtnDark>
          <RouterLink to="/perfil">Mi Perfil</RouterLink>
        </BtnDark>
        <BtnLight @click="logout">Cerrar sesión</BtnLight>
      </template>
    </div>
  </nav>
</template>
