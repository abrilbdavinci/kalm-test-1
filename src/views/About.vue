<script setup>
import MainTitle from '../components/MainTitle.vue';
import SubTitle from '../components/SubTitle.vue';
import BtnMain from '../components/BtnMain.vue';
</script>

<template>
  <section class="flex flex-col items-center gap-8 max-w-6xl mx-auto">
    <!-- Título principal -->
    <MainTitle>Sobre Kälm</MainTitle>

    <!-- Subtítulo general -->
    <SubTitle class="text-center max-w-3xl">
      En Kälm nos dedicamos a ofrecer experiencias personalizadas y soluciones
      que te ayudan a conocer y mejorar tu bienestar.
    </SubTitle>

    <!-- Cards de misión y visión -->
    <div class="grid md:grid-cols-2 gap-6 w-full">
      <!-- Misión -->
      <div class="flex flex-col bg-white/40 backdrop-blur-lg rounded-xl shadow-lg p-6">
        <h2 class="text-xl font-semibold text-[#306067] mb-2">Nuestra Misión</h2>
        <p class="text-gray-700 text-start">
          Proporcionar herramientas y tests interactivos que te ayuden a comprender
          tus necesidades y potenciar tu crecimiento personal.
        </p>
      </div>

      <!-- Visión -->
      <div class="flex flex-col bg-white/40 backdrop-blur-lg rounded-xl shadow-lg p-6">
        <h2 class="text-xl font-semibold text-[#306067] mb-2">Nuestra Visión</h2>
        <p class="text-gray-700 text-start">
          Convertirnos en la plataforma de referencia para autoevaluaciones y planes
          personalizados de bienestar, combinando UX intuitivo con resultados claros.
        </p>
      </div>
    </div>

    <!-- Botón de contacto -->
    <div class="flex justify-center mt-6">
      <BtnMain @click="$router.push('/contacto')">Contáctanos</BtnMain>
    </div>
  </section>
</template>
