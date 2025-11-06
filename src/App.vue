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
  <div class="flex flex-col min-h-screen header-bg pt-5">
    <Header />
    <Navbar />
    <main
  class="flex grow container mx-auto
        px-4 py-22 text-center justify-center"
>

      <RouterView />
    </main>
    <Footer class="hidden min-[1061px]:flex justify-center items-center">
    </Footer>
  </div>
</template>
