<script setup>
import Header from './components/Header.vue'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import { RouterView } from 'vue-router'
import { currentUser } from './main.js'
</script>

<template>
  <div class="flex flex-col min-h-screen header-bg pt-5">

    <!-- Mostrar solo si el usuario está autenticado -->
    <template v-if="currentUser">
      <Header />
      <Navbar />
    </template>

    <main
      class="flex grow container mx-auto px-4 py-22 text-center justify-center"
    >
      <RouterView />
    </main>

    <template v-if="currentUser">
      <Footer class="hidden min-[1061px]:flex justify-center items-center" />
    </template>
  </div>
</template>
