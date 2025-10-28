<script>
import Header from './components/Header.vue'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import MainTitle from './components/MainTitle.vue'

export default {
  name: 'App',
  components: {
    Header,
    Navbar,
    Footer,
    MainTitle
  }
}
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Navbar />
    <Header>
      <h2 class="text-xl font-semibold">Mi Proyecto Vue</h2>
    </Header>

    

    <main class="flex grow container mx-auto px-4 py-8 text-center">
      <MainTitle>
        Bienvenido a mi proyecto Vue con TailwindCSS
      </MainTitle>
      <p class="text-gray-600 mt-2">
        Este es un ejemplo con componentes reutilizables, botones y layout completo.
      </p>
      <RouterView />
    </main>

    <Footer>
      &copy; 2025 Mi Proyecto Vue. Todos los derechos reservados.
    </Footer>
  </div>
</template>
