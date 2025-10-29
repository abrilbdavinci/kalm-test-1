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
const route = useRoute();
const router = useRouter();

const test = ref(null);
const currentQuestion = ref(0);
const selectedOptions = ref([]); // { preguntaIndex: optionIndex }

const selectOption = (option) => {
    selectedOptions.value[currentQuestion.value] = { scoreKey: option.scoreKey };
};

const isOptionSelected = () => selectedOptions.value[currentQuestion.value] !== undefined;

const nextQuestion = () => {
    if (!isOptionSelected()) return alert('Selecciona una opción');
    if (currentQuestion.value < test.value.questions.length - 1) currentQuestion.value++;
};

const prevQuestion = () => {
    if (currentQuestion.value > 0) currentQuestion.value--;
};

const finishTest = async () => {
  if (!isOptionSelected()) {
    alert('Por favor, selecciona una opción antes de finalizar.');
    return;
  }

  try {
    // Convertir selectedOptions.value (reactivo) en array plano de respuestas
    const respuestasArray = Object.values(selectedOptions.value);

    const resultadoCalculado = {
      test: test.value._id,
      titulo: test.value.title,
      usuario: JSON.parse(localStorage.getItem('user'))._id,
      respuestas: respuestasArray, // array plano
      puntaje: calcularResultado().correctas
    };

    console.log('📤 Enviando resultado:', resultadoCalculado);

    const res = await fetch('http://localhost:3000/resultados', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resultadoCalculado)
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('❌ Error al guardar resultado:', errorData);
      throw new Error(errorData.error || 'Error al enviar resultados');
    }

    const responseData = await res.json();
    console.log('✅ Resultado guardado correctamente:', responseData);

    // Redirigir a ResultadoTest
    router.push(`/resultados/${responseData._id}`);
  } catch (err) {
    console.error('Error:', err);
    alert('Ocurrió un error al guardar tu resultado.');
  }
};






onMounted(async () => {
    try {
        const res = await fetch(`http://localhost:3000/tests/${route.params.id}`);
        if (!res.ok) throw new Error('Test no encontrado');
        test.value = await res.json();
    } catch (err) {
        console.error(err);
    }
});
</script>

<template>
    <div class="flex flex-col gap-6 w-full max-w-4xl mx-auto">
        <MainTitle v-if="test">{{ test.title }}</MainTitle>
        <SubTitle v-if="test">{{ test.description }}</SubTitle>

        <ProgresoPreguntas v-if="test" :total="test.questions.length" :actual="currentQuestion" />

        <div v-if="test" class="flex flex-col items-center">
            <TestCard>
                <template #header>Pregunta {{ currentQuestion + 1 }}</template>
                <template #content>{{ test.questions[currentQuestion].text }}</template>
                <template #button>
                    <div class="grid gap-2">
                        <div v-for="(opt, oIndex) in test.questions[currentQuestion].options" :key="oIndex"
                            @click="selectOption(opt)"
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

            <div class="flex justify-between w-150 py-5">
                <BtnLight class="w-50" @click="prevQuestion" :disabled="currentQuestion === 0">
                    Atrás
                </BtnLight>

                <BtnDark v-if="currentQuestion < test.questions.length - 1" class="w-50" @click="nextQuestion"
                    :disabled="!isOptionSelected()">
                    Siguiente
                </BtnDark>

                <BtnMain v-else class="w-50" @click="finishTest" :disabled="!isOptionSelected()">
                    Finalizar Test
                </BtnMain>
            </div>
        </div>
    </div>
</template>
