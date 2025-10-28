<script>
import Header from './components/Header.vue'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import { RouterView } from 'vue-router'

export default {
  name: 'App',
  components: {
    Header,
    Navbar,
    Footer
  }
}
</script>

<template>
  <div class="flex flex-col min-h-screen header-bg pt-35">
    <Navbar />
    

    

    <main class="flex grow container mx-auto px-4 py-8 text-center">
      
      <RouterView />
    </main>

    <Footer>
      &copy; Kälm 2025
    </Footer>
  </div>
</template>
