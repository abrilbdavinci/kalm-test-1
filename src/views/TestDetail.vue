<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import TestCard from '../components/TestCard.vue';
import BtnDark from '../components/BtnDark.vue';
import BtnLight from '../components/BtnLight.vue';
import BtnMain from '../components/BtnMain.vue';
import MainTitle from '../components/MainTitle.vue';
import SubTitle from '../components/SubTitle.vue';
import ProgresoPreguntas from '../components/ProgresoPreguntas.vue';

// Router
const route = useRoute();
const router = useRouter();

// Reactive state
const test = ref(null);
const currentQuestion = ref(0);
const selectedOptions = ref([]); // Array de { scoreKey }

// Seleccionar opción
const selectOption = (scoreKey) => {
  selectedOptions.value[currentQuestion.value] = { scoreKey };
};

// Verifica si hay opción seleccionada para la pregunta actual
const isOptionSelected = () => selectedOptions.value[currentQuestion.value] !== undefined;

// Avanzar pregunta
const nextQuestion = () => {
  if (!isOptionSelected()) {
    alert('Por favor, selecciona una opción antes de continuar.');
    return;
  }
  if (currentQuestion.value < test.value.questions.length - 1) currentQuestion.value++;
};

// Retroceder pregunta
const prevQuestion = () => {
  if (currentQuestion.value > 0) currentQuestion.value--;
};

// Finalizar test y enviar resultado
const finishTest = async () => {
  if (selectedOptions.value.length !== test.value.questions.length) {
    alert('Por favor, responde todas las preguntas.');
    return;
  }

  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?._id) throw new Error('Usuario no encontrado');

    // Calcular resultadoFinal (ejemplo: scoreKey más repetido)
    const scoreCounts = {};
    selectedOptions.value.forEach(opt => {
      scoreCounts[opt.scoreKey] = (scoreCounts[opt.scoreKey] || 0) + 1;
    });
    const resultadoFinal = Object.keys(scoreCounts).reduce((a, b) =>
      scoreCounts[a] > scoreCounts[b] ? a : b
    );

    // Crear objeto resultado compatible con el nuevo controlador
    const resultado = {
      test: test.value._id,
      usuario: user._id,
      respuestas: selectedOptions.value.map((r, i) => ({
        pregunta: test.value.questions[i]._id,
        scoreKey: r.scoreKey
      })),
      resultadoFinal
    };

    console.log('📤 Objeto que se envía al backend:', JSON.stringify(resultado, null, 2));

    // POST al endpoint adaptado
    const res = await fetch('http://localhost:3000/resultados', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resultado)
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('❌ Error al guardar resultado:', errorData);
      throw new Error(errorData.error || 'Error al enviar resultados');
    }

    const responseData = await res.json();
    console.log('✅ Resultado guardado correctamente:', responseData);

    router.push(`/resultados/${responseData._id}`);
  } catch (err) {
    console.error('Error:', err);
    alert('Ocurrió un error al guardar tu resultado: ' + err.message);
  }
};

// Cargar test desde API
onMounted(async () => {
  try {
    const res = await fetch(`http://localhost:3000/tests/${route.params.id}`);
    if (!res.ok) throw new Error('Test no encontrado');
    test.value = await res.json();
    console.log('Test cargado:', test.value);
  } catch (err) {
    console.error(err);
  }
});
</script>

<template>
  <div class="flex flex-col gap-6 w-full max-w-4xl mx-auto">
    <MainTitle v-if="test">{{ test.title }}</MainTitle>
    <SubTitle v-if="test">{{ test.description }}</SubTitle>

    <ProgresoPreguntas
      v-if="test"
      :total="test.questions.length"
      :actual="currentQuestion"
    />

    <div v-if="test" class="flex flex-col items-center justify-center">
      <TestCard>
        <template #header>Pregunta {{ currentQuestion + 1 }}</template>
        <template #content>{{ test.questions[currentQuestion].text }}</template>
        <template #button>
          <div class="grid gap-2">
            <div
              v-for="(opt, oIndex) in test.questions[currentQuestion].options"
              :key="oIndex"
              @click="selectOption(opt.scoreKey)"
              :class="[ 
                'cursor-pointer rounded-full p-3 border border-gray-300 text-center transition-colors',
                selectedOptions[currentQuestion]?.scoreKey === opt.scoreKey
                  ? 'bg-[#37A0AF] text-white'
                  : 'bg-white text-gray-800'
              ]"
            >
              {{ opt.text }}
            </div>
          </div>
        </template>
      </TestCard>

      <div class="flex justify-between w-full py-5">
        <BtnLight class="w-1/3" @click="prevQuestion" :disabled="currentQuestion === 0">
          Atrás
        </BtnLight>

        <BtnDark
          v-if="currentQuestion < test.questions.length - 1"
          class="w-1/3"
          @click="nextQuestion"
          :disabled="!isOptionSelected()"
        >
          Siguiente
        </BtnDark>

        <BtnMain
          v-else
          class="w-1/3"
          @click="finishTest"
          :disabled="!isOptionSelected()"
        >
          Finalizar Test
        </BtnMain>
      </div>
    </div>
  </div>
</template>
