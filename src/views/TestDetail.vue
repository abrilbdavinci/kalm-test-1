<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import TestCard from '../components/TestCard.vue';
import BtnDark from '../components/BtnDark.vue';
import BtnLight from '../components/BtnLight.vue';
import BtnMain from '../components/BtnMain.vue';
import MainTitle from '../components/MainTitle.vue';
import SubTitle from '../components/SubTitle.vue';
import ProgresoPreguntas from '../components/ProgresoPreguntas.vue';

export default {
    name: 'TestDetail',
    components: { TestCard, BtnDark, BtnLight, BtnMain, MainTitle, SubTitle, ProgresoPreguntas },
    setup() {
        const route = useRoute();
        const test = ref(null);
        const currentQuestion = ref(0);
        const selectedOptions = ref({}); // { preguntaIndex: optionIndex }

        const selectOption = (oIndex) => {
            selectedOptions.value[currentQuestion.value] = oIndex;
        };

        const nextQuestion = () => {
            if (currentQuestion.value < test.value.questions.length - 1) {
                currentQuestion.value++;
            }
        };

        const prevQuestion = () => {
            if (currentQuestion.value > 0) {
                currentQuestion.value--;
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

        return {
            test,
            currentQuestion,
            selectedOptions,
            selectOption,
            nextQuestion,
            prevQuestion
        };
    }
};
</script>

<template>
    <div class="flex flex-col gap-6 w-full max-w-4xl">
        <MainTitle v-if="test">{{ test.title }}</MainTitle>
        <SubTitle v-if="test">{{ test.description }}</SubTitle>

        <ProgresoPreguntas v-if="test" :total="test.questions.length" :actual="currentQuestion" />


        <div v-if="test" class="justify-center items-center flex flex-col">
            <TestCard>
                <template #header>Pregunta {{ currentQuestion + 1 }}</template>
                <template #content>{{ test.questions[currentQuestion].text }}</template>
                <template #button>
                    <div class="grid gap-2">
                        <div v-for="(opt, oIndex) in test.questions[currentQuestion].options" :key="oIndex"
                            @click="selectOption(oIndex)" :class="[
                                'cursor-pointer rounded-full p-3 border border-gray-300 text-center transition-colors',
                                selectedOptions[currentQuestion] === oIndex
                                    ? 'bg-[#37A0AF] text-white'
                                    : 'bg-white text-gray-800'
                            ]">
                            {{ opt.text }}
                        </div>
                    </div>
                </template>

            </TestCard>

            <div class="flex justify-between w-150 py-5">
                <BtnLight class="w-50" @click="prevQuestion" :disabled="currentQuestion === 0">
                    Atrás
                </BtnLight>
                <BtnDark class="w-50" @click="nextQuestion" :disabled="currentQuestion === test.questions.length - 1">
                    Siguiente
                </BtnDark>
            </div>
            <RouterLink to="/tests">
            <BtnDark class="bg-gray-400 hover:bg-gray-500 w-40 mx-auto">
                Omitir Test
            </BtnDark>
        </RouterLink>
        </div>

    </div>
</template>
