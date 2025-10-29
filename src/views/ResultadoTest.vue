<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const resultado = ref(null);
const scoreKeyMasFrecuente = ref('');

onMounted(async () => {
  try {
    const res = await fetch(`http://localhost:3000/resultados/${route.params.id}`);
    const data = await res.json();
    resultado.value = data;

    // Calcular scoreKey más frecuente
    const count = {};
    data.respuestas.forEach(key => {
      if (!key) return;
      count[key] = (count[key] || 0) + 1;
    });

    let max = 0;
    let keyMax = '';
    for (const key in count) {
      if (count[key] > max) {
        max = count[key];
        keyMax = key;
      }
    }

    scoreKeyMasFrecuente.value = keyMax;

  } catch (err) {
    console.error(err);
  }
});
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <h1 class="text-2xl font-bold">{{ resultado?.titulo }}</h1>
    <p>Usuario: {{ resultado?.usuario }}</p>
    <p>Resultado: <strong>{{ scoreKeyMasFrecuente }}</strong></p>
    <p>Respuestas totales: {{ resultado?.respuestas.length }}</p>
  </div>
</template>
