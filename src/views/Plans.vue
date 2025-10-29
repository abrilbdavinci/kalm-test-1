<script setup>
import MainTitle from '../components/MainTitle.vue';
import SubTitle from '../components/SubTitle.vue';
import BtnMain from '../components/BtnMain.vue';
import BtnDark from '../components/BtnDark.vue';

const plans = [
  {
    title: 'Básico',
    price: '$9.99/mes',
    features: ['Acceso a tests básicos', 'Resultados resumidos', 'Soporte por email'],
    highlight: false
  },
  {
    title: 'Avanzado',
    price: '$19.99/mes',
    features: ['Todos los tests', 'Resultados completos', 'Plan personalizado', 'Soporte prioritario'],
    highlight: true
  },
  {
    title: 'Premium',
    price: '$29.99/mes',
    features: ['Tests + seguimiento personalizado', 'Consultoría 1:1', 'Acceso anticipado a novedades'],
    highlight: false
  }
];
</script>

<template>
  <div class="flex flex-col gap-6 w-full max-w-6xl mx-auto px-4 py-10">
    <MainTitle>Planes</MainTitle>
    <SubTitle>Elige el plan que mejor se adapte a tus necesidades.</SubTitle>

    <div class="grid md:grid-cols-3 gap-6 mt-8">
      <div
        v-for="(plan, index) in plans"
        :key="index"
        :class="[
          'border rounded-xl p-6 flex flex-col gap-4 transition-transform hover:scale-105',
          plan.highlight ? 'border-[#37A0AF] bg-[#E6F2F5]' : 'border-gray-300 bg-white/20'
        ]"
      >
        <h3 class="text-xl font-semibold text-[#306067]">{{ plan.title }}</h3>
        <p class="text-2xl font-bold">{{ plan.price }}</p>

        <ul class="flex flex-col gap-2 mt-4 text-gray-700">
          <li v-for="(feature, i) in plan.features" :key="i">• {{ feature }}</li>
        </ul>

        <div class="mt-auto flex justify-center">
          <BtnDark>Elegir Plan</BtnDark>
        </div>
      </div>
    </div>
  </div>
</template>
