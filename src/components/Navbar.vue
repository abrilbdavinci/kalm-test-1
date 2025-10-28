<script>
import BtnLight from './BtnLight.vue'
import BtnDark from './BtnDark.vue'
import MainTitle from './MainTitle.vue';

export default {
  name: 'Navbar',
  components: {
    BtnLight,
    BtnDark,
    MainTitle
  },
}
</script>

<template>
  <nav
    class="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-[1300px] backdrop-blur-[25px] bg-white/10 rounded-full shadow-[0_4px_30px_rgba(0,0,0,0.1)] px-8 py-4 flex items-center justify-between z-50"
  >
    
    <!-- Izquierda: Logo -->
    <div class="flex items-center">
      <MainTitle class="text-2xl">Kälm</MainTitle>
    </div>

    <!-- Centro: Links -->
    <div class="flex flex-1 justify-center space-x-6">
      <RouterLink to="/" class="transition hover:text-teal-400" style="color: #306067;">Inicio</RouterLink>
      <RouterLink to="tests" class="transition hover:text-teal-400" style="color: #306067;">Tests</RouterLink>
      <RouterLink to="/planes" class="transition hover:text-teal-400" style="color: #306067;">Planes</RouterLink>
      <RouterLink to="/about" class="transition hover:text-teal-400" style="color: #306067;">Sobre Kälm</RouterLink>
      <RouterLink to="/contacto" class="transition hover:text-teal-400" style="color: #306067;">Contacto</RouterLink>
    </div>

    <!-- Derecha: Botones -->
    <div class="flex space-x-3">
      <BtnLight>Iniciar sesión</BtnLight>
      <BtnDark>Crear cuenta</BtnDark>
    </div>

  </nav>
</template>
