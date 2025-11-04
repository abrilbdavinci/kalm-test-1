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

    <!-- 🌙 HEADER (solo visible en móvil y tablet, <1061px) -->
    <Header />

    <!-- 🌤 NAVBAR (visible en desktop, >=1061px, fijo inferior) -->
    <Navbar />

    <!-- 🧩 CONTENIDO PRINCIPAL -->
    <main
  class="flex grow container mx-auto
         px-4 py-16            /* base: móviles */
         sm:px-6 sm:py-12      /* sm: ≥640px */
         md:px-8 md:py-12     /* md: ≥768px */
         lg:px-12 lg:py-12    /* lg: ≥1024px */
         xl:px-16 xl:py-14    /* xl: ≥1280px */
         text-center justify-center"
>

      <RouterView />
    </main>

    <!-- ⚓ FOOTER -->
    <Footer class="hidden min-[1061px]:flex justify-center items-center">
      &copy; Kälm 2025
    </Footer>
  </div>
</template>
