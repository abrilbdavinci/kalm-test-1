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
    class="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-[1500px] 
            backdrop-blur-[100px] bg-white/10 border border-white/40 
            rounded-full shadow-[0_8px_30px_rgba(55,160,175,0.3)] 
            p-3 flex items-center justify-between z-50">

    <div class="flex items-center">
      <MainTitle>Kälm</MainTitle>
    </div>

    <div class="flex flex-1 justify-center space-x-6">
      <RouterLink to="/" class="font-bold transition hover:text-teal-400" style="color: #306067;">Inicio</RouterLink>
      <RouterLink to="/tests" class="font-bold transition hover:text-teal-400" style="color: #306067;">Tests
      </RouterLink>
      <RouterLink to="/planes" class="font-bold transition hover:text-teal-400" style="color: #306067;">Planes
      </RouterLink>
      <RouterLink to="/about" class="font-bold transition hover:text-teal-400" style="color: #306067;">Sobre Kälm
      </RouterLink>
      <RouterLink to="/contacto" class="font-bold transition hover:text-teal-400" style="color: #306067;">Contacto
      </RouterLink>
    </div>

    <div class="flex space-x-3">
      <template v-if="!currentUser">
        <RouterLink to="/login">
          <BtnLight>Iniciar sesión</BtnLight>
        </RouterLink>
        <RouterLink to="/register">
          <BtnDark>Crear cuenta</BtnDark>
        </RouterLink>
      </template>

      <template v-else>
        <SubTitle class="text-lg md:text-xl font-bold text-[#306067] flex items-center gap-4">
          Hola, {{ currentUser.name }}
          <!-- Link al perfil -->
        </SubTitle>
        <BtnDark>
            <RouterLink to="/perfil">
              Mi Perfil
            </RouterLink>
          </BtnDark>

        <BtnLight @click="logout">Cerrar sesión</BtnLight>
      </template>
    </div>
  </nav>
</template>
