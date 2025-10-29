<script setup>
import MainTitle from '../components/MainTitle.vue';
import SubTitle from '../components/SubTitle.vue';
import BtnMain from '../components/BtnMain.vue';
</script>

<template>
  <div class="flex flex-col gap-6 w-full max-w-5xl mx-auto px-4 py-10">
    <MainTitle>Acerca de Nosotros</MainTitle>
    <SubTitle>
      En Kalm nos dedicamos a ofrecer experiencias personalizadas y soluciones
      que te ayudan a conocer y mejorar tu bienestar.
    </SubTitle>

    <div class="grid md:grid-cols-2 gap-8 mt-6">
      <div class="flex flex-col gap-4">
        <h2 class="text-xl font-semibold text-[#306067]">Nuestra Misión</h2>
        <p class="text-gray-700">
          Proporcionar herramientas y tests interactivos que te ayuden a comprender
          tus necesidades y potenciar tu crecimiento personal.
        </p>
      </div>

      <div class="flex flex-col gap-4">
        <h2 class="text-xl font-semibold text-[#306067]">Nuestra Visión</h2>
        <p class="text-gray-700">
          Convertirnos en la plataforma de referencia para autoevaluaciones y planes
          personalizados de bienestar, combinando UX intuitivo con resultados claros.
        </p>
      </div>
    </div>

    <div class="mt-8 flex justify-center">
      <BtnMain @click="$router.push('/contacto')">
        Contáctanos
      </BtnMain>
    </div>
  </div>
</template>
