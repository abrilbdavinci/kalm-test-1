<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import TestCard from '../components/TestCard.vue';
import BtnDark from '../components/BtnDark.vue';
import BtnLight from '../components/BtnLight.vue';
import BtnMain from '../components/BtnMain.vue';
import MainTitle from '../components/MainTitle.vue';
import SubTitle from '../components/SubTitle.vue';
import ProgresoPreguntas from '../components/ProgresoPreguntas.vue';

// -------------------- ROUTER --------------------
const route = useRoute();
const router = useRouter();

// -------------------- STATE --------------------
const test = ref(null);
const currentQuestion = ref(0);
const selectedOptions = ref([]);

// -------------------- USUARIO DESDE TOKEN --------------------
function getUserFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return { _id: payload.id, name: payload.name };
  } catch (err) {
    console.error("Error al decodificar token:", err);
    return null;
  }
}
const usuario = ref(getUserFromToken());

// -------------------- FUNCIONES --------------------
const selectOption = (scoreKey) => {
  selectedOptions.value[currentQuestion.value] = { scoreKey };
};

const isOptionSelected = () => selectedOptions.value[currentQuestion.value] !== undefined;

const nextQuestion = () => {
  if (!isOptionSelected()) {
    alert('Por favor, selecciona una opción antes de continuar.');
    return;
  }
  if (currentQuestion.value < test.value.questions.length - 1) currentQuestion.value++;
};

const prevQuestion = () => {
  if (currentQuestion.value > 0) currentQuestion.value--;
};

// -------------------- RESULTADO FINAL --------------------
const resultadoFinal = computed(() => {
  const counts = {};
  selectedOptions.value.forEach(r => {
    if (!r) return;
    counts[r.scoreKey] = (counts[r.scoreKey] || 0) + 1;
  });
  let maxKey = null;
  let maxValue = 0;
  for (const key in counts) {
    if (counts[key] > maxValue) {
      maxValue = counts[key];
      maxKey = key;
    }
  }
  return maxKey || '';
});

// -------------------- ENVIAR RESULTADO --------------------
const finishTest = async () => {
  try {
    if (!usuario.value?._id) {
      alert('Usuario no identificado. Debes iniciar sesión.');
      return;
    }

    const payload = {
      testId: test.value._id,
      testTitle: test.value.title,
      user: usuario.value._id,
      respuestas: selectedOptions.value.map((r, i) => ({
        pregunta: test.value.questions[i]._id,
        scoreKey: r.scoreKey
      })),
      resultado: resultadoFinal.value
    };

    console.log('📤 Payload enviado:', payload);

    const response = await fetch('http://localhost:3000/resultados', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Error al guardar resultado:', data);
      alert(data.error || 'Error al guardar resultado');
      return;
    }

    // Redirigir al resultado usando el _id retornado
    router.push({ path: '/resultado', query: { id: data.resultado._id } });

  } catch (err) {
    console.error('💥 Error al enviar resultado:', err);
    alert('Error al enviar resultado');
  }
};

// -------------------- CARGAR TEST --------------------
onMounted(async () => {
  try {
    const res = await fetch(`http://localhost:3000/tests/${route.params.id}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!res.ok) throw new Error('Test no encontrado');
    test.value = await res.json();
    console.log('Test cargado:', test.value);
  } catch (err) {
    console.error(err);
    alert('No se pudo cargar el test');
    router.push('/');
  }
});
</script>

<template>
  <div class="flex flex-col gap-6 w-3xl mx-auto">
    <MainTitle v-if="test">{{ test.title }}</MainTitle>
    <SubTitle v-if="test">{{ test.description }}</SubTitle>

    <ProgresoPreguntas v-if="test" :total="test.questions.length" :actual="currentQuestion" />

    <div v-if="test" class="flex flex-col items-center justify-center">
      <!-- Reemplazo de TestCard por div -->
      <div
        class="bg-white/20 backdrop-blur-[10px] border border-white/30 rounded-xl shadow-md p-6 w-full max-w-3xl flex flex-col gap-4">
        <!-- Header -->
        <div class="text-lg font-bold text-[#306067] text-center">
          Pregunta {{ currentQuestion + 1 }}
        </div>

        <!-- Contenido -->
        <div class="text-gray-800 text-center">
          {{ test.questions[currentQuestion].text }}
        </div>

        <!-- Opciones -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div v-for="(opt, oIndex) in test.questions[currentQuestion].options" :key="oIndex"
            @click="selectOption(opt.scoreKey)" :class="[
              'cursor-pointer rounded-full border border-gray-300 text-center transition-colors flex items-center justify-center p-4 min-h-[82px] w-full',
              selectedOptions[currentQuestion]?.scoreKey === opt.scoreKey
                ? 'bg-[#37A0AF] text-white'
                : 'bg-white text-gray-800'
            ]">
            {{ opt.text }}
          </div>
        </div>


      </div>

      <!-- Navegación -->
      <div class="flex justify-between w-full py-5">
        <BtnLight class="w-1/3" @click="prevQuestion" :disabled="currentQuestion === 0">Atrás</BtnLight>
        <BtnDark v-if="currentQuestion < test.questions.length - 1" class="w-1/3" @click="nextQuestion"
          :disabled="!isOptionSelected()">Siguiente</BtnDark>
        <BtnMain v-else class="w-1/3" @click="finishTest" :disabled="!isOptionSelected()">Finalizar Test</BtnMain>
      </div>
    </div>
  </div>
</template>
