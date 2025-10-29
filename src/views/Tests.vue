<template>
  <div class="w-full flex flex-col items-center gap-8 p-6">
    <MainTitle>Elegir un test para empezar</MainTitle>

    <div v-if="!token" class="text-red-600 text-lg">
      Debes iniciar sesión para ver los tests.
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl justify-items-center">
      <TestCard v-for="test in tests" :key="test._id">
        <template #header>{{ test.title }}</template>
        <template #content>{{ test.description }}</template>
        <template #button>
          <RouterLink :to="`/tests/${test.key}`">
            <BtnLight class="w-50 py-2 font-bold">Iniciar Test</BtnLight>
          </RouterLink>
        </template>
      </TestCard>
    </div>
  </div>
</template>

<script>
import TestCard from '../components/TestCard.vue';
import BtnLight from '../components/BtnLight.vue';
import MainTitle from '../components/MainTitle.vue';

export default {
  name: 'Tests',
  components: { TestCard, BtnLight, MainTitle },
  data() {
    return {
      tests: [],
      token: localStorage.getItem('token') || null
    };
  },
  async mounted() {
    // Si no hay token, no hacer fetch
    if (!this.token) return;

    try {
      // Llamada a backend con token en Authorization
      const res = await fetch('http://localhost:3000/tests', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        }
      });

      if (!res.ok) {
        // Si el token es inválido o hay error, limpiar tests
        console.error('Error al cargar los tests:', res.statusText);
        this.tests = [];
        return;
      }

      this.tests = await res.json();
    } catch (err) {
      console.error('Error al obtener tests:', err);
      this.tests = [];
    }
  }
};
</script>
