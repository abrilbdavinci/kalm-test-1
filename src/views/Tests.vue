<script>
import TestCard from '../components/TestCard.vue'
import BtnDark from '../components/BtnDark.vue'
import MainTitle from '../components/MainTitle.vue'

export default {
    name: 'Tests',
    components: { TestCard, BtnDark, MainTitle },
    data() {
        return {
            tests: []
        }
    },
    async mounted() {
        try {
            const res = await fetch('http://localhost:3000/tests')
            if (!res.ok) throw new Error('Error al cargar los tests')
            this.tests = await res.json()
        } catch (err) {
            console.error(err)
        }
    }
}
</script>

<template>
    <div class="w-full flex flex-col items-center gap-8 p-6 ">

        <MainTitle>Eligir un test para empezar</MainTitle>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl justify-items-center">

            <TestCard v-for="test in tests" :key="test._id">
                <template #header>{{ test.title }}</template>
                <template #content>{{ test.description }}</template>
                <template #button>
                    <RouterLink :to="`/tests/${test.key}`">
                        <BtnDark class="w-50 py-2 font-bold">Iniciar Test</BtnDark>
                    </RouterLink>


                </template>
            </TestCard>

        </div>

    </div>
</template>
