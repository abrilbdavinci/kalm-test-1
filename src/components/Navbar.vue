<script>
import BtnLight from './BtnLight.vue'
import BtnDark from './BtnDark.vue'

export default {
  name: 'Navbar',
  components: {
    BtnLight,
    BtnDark
  }
}
</script>

<template>
  <nav class="bg-gray-900 text-white py-3">
    <div class="container mx-auto flex justify-between items-center">
      <div class="flex space-x-6">
        <RouterLink to="/" class="hover:text-teal-400">Inicio</RouterLink>
        <RouterLink to="/acerca" class="hover:text-teal-400">Acerca</RouterLink>
        <RouterLink to="/contacto" class="hover:text-teal-400">Contacto</RouterLink>
      </div>
      <div class="flex space-x-3">
        <BtnLight>Modo Claro</BtnLight>
        <BtnDark>Modo Oscuro</BtnDark>
      </div>
    </div>
  </nav>
</template>
