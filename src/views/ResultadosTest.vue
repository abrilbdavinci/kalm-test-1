<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import MainTitle from '../components/MainTitle.vue';
import SubTitle from '../components/SubTitle.vue';
import BtnDark from '../components/BtnDark.vue';

const route = useRoute();
const resultado = ref(null);

onMounted(async () => {
    const res = await fetch(`http://localhost:3000/resultados/${route.params.id}`);
    resultado.value = await res.json();
});
</script>

<template>
    <div class="flex flex-col items-center text-center p-8 max-w-2xl mx-auto">
        <MainTitle>Resultado del Test</MainTitle>

        <div v-if="resultado" class="mt-6 bg-white/20 backdrop-blur-lg rounded-xl p-6 shadow-md">
            <SubTitle>{{ resultado.testId.title }}</SubTitle>
            <p class="text-xl mt-4 font-semibold">
                Puntaje: {{ resultado.puntaje.toFixed(1) }}%
            </p>

            <div class="mt-6 text-left space-y-4">
                <div v-for="(r, i) in resultado.respuestas" :key="i" class="p-4 rounded-xl"
                    :class="r.correcta ? 'bg-green-200' : 'bg-red-200'">
                    <p class="font-semibold">{{ r.pregunta }}</p>
                    <p>Tu respuesta: {{ r.opcionSeleccionada }}</p>
                    <p v-if="r.correcta" class="text-green-700 font-bold">✅ Correcta</p>
                    <p v-else class="text-red-700 font-bold">❌ Incorrecta</p>
                </div>
            </div>

            <RouterLink to="/tests">
                <BtnDark class="mt-6">Volver a Tests</BtnDark>
            </RouterLink>
        </div>
    </div>
</template>
