<script>
import MainTitle from '../components/MainTitle.vue'
import SubTitle from '../components/SubTitle.vue'
import BtnLight from '../components/BtnLight.vue'
import BtnDark from '../components/BtnDark.vue'



export default {
    name: 'Home',
    components: {
        MainTitle,
        SubTitle,
        BtnLight,
        BtnDark
    }
}
</script>

<template>
    <div class="flex flex-col items-center gap-6 mx-auto">

        <!-- Títulos -->
        <div class="flex flex-col items-center gap-4 text-center">
            <MainTitle>Una nueva forma de cuidarte</MainTitle>
            <SubTitle>Tu rutina perfecta, sin prueba y error.</SubTitle>
        </div>

        <!-- Imagen de fondo adaptativa -->
        <div
            class="w-full max-w-4xl h-64 sm:h-80 md:h-100 bg-center bg-cover rounded-xl"
            style="background-image: url('/src/assets/img/mockups1.png');"
        >
            <!-- opcional: contenido encima de la imagen -->
        </div>

        <!-- Botón -->
        <RouterLink to="/tests">
            <BtnDark class="text-2xl w-55 font-bold">Hacer el Test</BtnDark>
        </RouterLink>

    </div>
</template>
