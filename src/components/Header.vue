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

    <!-- BOTONES DERECHA (solo iconos) -->
    <div class="flex items-center gap-6 text-[#316168] text-2xl relative">
      <!-- Usuario no autenticado -->
      <template v-if="!currentUser">
        <RouterLink to="/login" title="Iniciar sesión">
          <font-awesome-icon icon="fa-solid fa-right-to-bracket" class="hover:opacity-80 transition" />
        </RouterLink>
        <RouterLink to="/register" title="Registrarse">
          <font-awesome-icon icon="fa-solid fa-user-plus" class="hover:opacity-80 transition" />
        </RouterLink>
      </template>

      <!-- Usuario autenticado -->
      <template v-else>
        <!-- Campana de notificaciones -->
        <button
          class="align-center justify-center"
          title="Notificaciones"
        >
          <font-awesome-icon icon="fa-solid fa-bell" class="text-[#316168]" />
          <!-- Indicador de notificaciones -->
          <span
            class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"
          ></span>
        </button>
        <!-- Avatar usuario autenticado -->
        <RouterLink to="/perfil" class="flex items-center justify-center">
          <div
            class="w-9 h-9 rounded-full overflow-hidden border border-white/50 shadow-md bg-white/20 backdrop-blur-sm"
          >
            <img
              v-if="currentUser?.avatar"
              :src="currentUser.avatar"
              alt="Avatar usuario"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full bg-gray-300"></div>
          </div>
        </RouterLink>

        
      </template>
    </div>
  </header>
</template>

<style>
button{
  font-family: 'Courier New', Courier, monospace;
}
</style>
