<script>
import { currentUser } from '../main.js'
import { useRouter } from 'vue-router'

export default {
  name: 'Header',
  setup() {
    const router = useRouter()

    const logout = () => {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      currentUser.value = null
      router.push('/login')
    }

    return { currentUser, logout }
  },
}
</script>

<template>
  <!-- HEADER: Visible solo hasta 1060px -->
  <header
    class="flex min-[1061px]:hidden items-center justify-between
           w-[95%] max-w-[1500px] mx-auto px-5 py-3
           rounded-full border border-white/40
           backdrop-blur-[100px] bg-white/30
           shadow-[0_8px_30px_rgba(55,160,175,0.3)]
           fixed top-3 left-1/2 -translate-x-1/2 z-50
           transition-all duration-500 ease-in-out"
  >
    <!-- LOGO IZQUIERDA -->
    <div class="flex items-center">
      <img
        src="./../assets/img/logo-kalm.svg"
        alt="Logo Kälm"
        class="h-8 w-auto object-contain"
      />
    </div>

    <!-- MENSAJE CENTRAL -->
    <div class="flex-1 flex justify-center">
      <template v-if="currentUser">
        <h2 class="text-[#306067] font-semibold text-base">
          Hola, {{ currentUser.name }}
        </h2>
      </template>
    </div>

    <!-- BOTONES DERECHA (solo iconos) -->
    <div class="flex items-center gap-6 text-teal-600 text-2xl">
      <!-- Usuario no autenticado -->
      <template v-if="!currentUser">
        <RouterLink to="/login">
          <font-awesome-icon icon="fa-solid fa-right-to-bracket" />
        </RouterLink>
        <RouterLink to="/register">
          <font-awesome-icon icon="fa-solid fa-user-plus" />
        </RouterLink>
      </template>

      <!-- Usuario autenticado -->
      <template v-else>
        <RouterLink to="/perfil">
          <font-awesome-icon icon="fa-solid fa-user" />
        </RouterLink>
        <button @click="logout">
          <font-awesome-icon icon="fa-solid fa-arrow-right-from-bracket" />
        </button>
      </template>
    </div>
  </header>
</template>

