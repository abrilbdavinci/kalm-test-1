<script>
import MainTitle from '../components/MainTitle.vue'
import SubTitle from '../components/SubTitle.vue'
import BtnLight from '../components/BtnLight.vue'
import BtnDark from '../components/BtnDark.vue'
import BtnMain from '../components/BtnMain.vue'



export default {
    name: 'Home',
    components: {
        MainTitle,
        SubTitle,
        BtnLight,
        BtnDark,
        BtnMain
    }
}
</script>

<template>
  <section class="max-w-6xl flex flex-col items-center mx-auto">

    <!-- Sección principal -->
    <MainTitle>Una nueva forma de cuidarte</MainTitle>
    <SubTitle>Tu rutina perfecta, sin prueba y error.</SubTitle>

    <!-- Imagen de fondo adaptativa -->
    <div 
      class="w-full max-w-3xl h-64 sm:h-80 md:h-96 bg-center bg-cover rounded-xl my-3"
      :style="{ backgroundImage: 'url(/src/assets/img/mockups1.png)' }">
    </div>

    <!-- Botón CTA -->
    <RouterLink to="/tests">
      <BtnMain class="text-2xl w-55 font-bold">Hacer el Test</BtnMain>
    </RouterLink>

    <!-- Nueva sección de cards -->
    <div class="mt-16 flex flex-col items-center ">
      <SubTitle class="mb-8 text-center text-2xl font-semibold">Descubrí tu próxima rutina</SubTitle>

      <div class="grid gap-6 sm:grid-cols-1 md:grid-cols-3 w-full">
        <!-- Card 1 -->
        <div class="flex flex-col items-start px-6 py-15 rounded-xl bg-gradient-to-b from-[#D7EEF2] to-white shadow-md">
          <img src="./../assets/img/self_care_icon.png" alt="Rutinas" class="w-12 h-12 mb-4 object-contain">
          <SubTitle class="font-semibold text-lg mb-2">Creá rutinas personalizadas</SubTitle>
          <p class="text-gray-700 text-md text-start">Armá tus rutings de skincare y haircare según lo que vos necesitás. Elegí los pasos, productos y frecuencia para que tu autocuidado sea realmente tuyo.</p>
        </div>

        <!-- Card 2 -->
        <div class="flex flex-col items-start px-6 py-15 rounded-xl bg-gradient-to-b from-[#D7EEF2] to-white shadow-md">
          <img src="./../assets/img/alarm_icon.png" alt="Recordatorios" class="w-12 h-12 mb-4 object-contain">
          <SubTitle class="font-semibold text-lg mb-2">Programá recordatorios</SubTitle>
          <p class="text-gray-700 text-md text-start">Configurá alertas diarias, semanales, mensuales o hasta anuales para mantener la constancia y que tu rutina se convierta en un nuevo hábito saludable.</p>
        </div>

        <!-- Card 3 -->
        <div class="flex flex-col items-start px-6 py-15 rounded-xl bg-gradient-to-b from-[#D7EEF2] to-white shadow-md">
          <img src="./../assets/img/groups_icon.png" alt="Comunidad" class="w-16 h-12 mb-4 object-contain">
          <SubTitle class="font-semibold text-lg mb-2">Interactuá con nuestra comunidad</SubTitle>
          <p class="text-gray-700 text-md text-start">Compartí tus experiencias, descubrí tips y conectá con otras personas en su propio camino de autocuidado.</p>
        </div>
      </div>
    </div>

    <!-- Imagen adaptativa debajo de todo -->
    <div class="w-full">
      <img 
        src="./../assets/img/pasos.png" 
        alt="Imagen decorativa" 
        class="w-3xl h-auto mx-auto object-cover"
      >
    </div>

  </section>
</template>

