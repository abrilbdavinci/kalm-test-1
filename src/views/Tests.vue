<template>
  <div class="w-full flex flex-col items-center gap-8 p-6">
    <MainTitle>Elegir un test para empezar</MainTitle>

    <div v-if="!token" class="text-red-600 text-lg">
      Debes iniciar sesión para ver los tests.
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl justify-items-center">
      <TestCard
        v-for="test in tests"
        :key="test._id"
        :class="{'done-card': isTestDone(test.key)}"
      >
        <template #header>{{ test.title }}</template>
        <template #content>{{ test.description }}</template>
        <template #button>
          <div v-if="isTestDone(test.key)">
            <BtnLight class="w-50 py-2 font-bold opacity-60 cursor-not-allowed" disabled>
              Test ya realizado
            </BtnLight>
          </div>
          <div v-else>
            <RouterLink :to="`/tests/${test.key}`">
              <BtnLight class="w-50 py-2 font-bold">Iniciar Test</BtnLight>
            </RouterLink>
          </div>
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
      resultados: [],
      token: localStorage.getItem('token') || null
    };
  },
  methods: {
    isTestDone(testKey) {
      return this.resultados.some(r => r.testKey === testKey);
    }
  },
  async mounted() {
    if (!this.token) return;

    try {
      // Obtener tests
      const resTests = await fetch('http://localhost:3000/tests', {
        headers: { 'Authorization': `Bearer ${this.token}` }
      });

      if (!resTests.ok) throw new Error('No se pudieron obtener los tests');
      this.tests = await resTests.json();

      // Obtener resultados del usuario
      const userId = JSON.parse(atob(this.token.split('.')[1])).id;
      const resResultados = await fetch(`http://localhost:3000/resultadosUsuarios/${userId}`, {
        headers: { 'Authorization': `Bearer ${this.token}` }
      });

      if (!resResultados.ok) throw new Error('No se pudieron obtener tus resultados');
      this.resultados = await resResultados.json();

    } catch (err) {
      console.error(err);
    }
  }
};
</script>

<style scoped>
.done-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.3);
  pointer-events: none; /* evita clicks */
}
</style>
