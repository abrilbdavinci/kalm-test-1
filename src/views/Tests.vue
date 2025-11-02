<template>
  <div class="w-full flex flex-col items-center gap-4">
    <MainTitle>Elegir un test</MainTitle>

    <div v-if="!token" class="text-red-600 text-lg">
      Debes iniciar sesión para ver los tests.
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full justify-items-center">
      <div v-for="test in tests" :key="test._id" class="flex flex-col items-center text-center gap-4 w-full">
        <!-- Título y descripción fuera de la card -->
        <h2 class="text-lg md:text-xl font-semibold text-[#306067]">
          {{ test.title }}
        </h2>
        <p class="text-base md:text-lg text-gray-700">
          {{ test.description }}
        </p>

        <!-- TestCard solo contiene el botón -->
        <TestCard :class="[
          isTestDone(test.key) ? 'done-card' : '',
          test.key === 'piel' ? 'card-piel' : '',
          test.key === 'cabello' ? 'card-cabello' : ''
        ]">

          <template #button>
            <div v-if="isTestDone(test.key)">
              <BtnMain class="w-50 py-2 font-bold cursor-not-allowed" disabled>
                Test ya realizado
              </BtnMain>
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
  </div>
</template>


<script>
import TestCard from '../components/TestCard.vue';
import BtnLight from '../components/BtnLight.vue';
import BtnMain from '../components/BtnMain.vue';
import MainTitle from '../components/MainTitle.vue';

export default {
  name: 'Tests',
  components: { TestCard, BtnLight, MainTitle, BtnMain },
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


