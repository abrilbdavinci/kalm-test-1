<script setup>
import MainTitle from '../components/MainTitle.vue';
import SubTitle from '../components/SubTitle.vue';
import BtnMain from '../components/BtnMain.vue';
import BtnDark from '../components/BtnDark.vue';

const plans = [
  {
    id: 1,
    title: 'Kälm Free',
    description: 'Ideal para quienes recién están empezando en el mundo del haircare y skincare.',
    price: 'Gratis',
    features: [
      'Diagnóstico básico de piel y cabello.',
      'Recomendaciones de rutina.',
      'Consejos y artículos sobre self-care.'
    ],
    buttonText: 'Empezar gratis',
    main: false
  },
  {
    id: 2,
    title: 'Kälm Plus',
    description: 'Ideal para quienes ya conocen su piel y buscan subir de nivel, con experiencia personalizada y sin anuncios.',
    price: 'ARS $7,000 /mes',
    features: [
      'Todo lo incluido en Kälm Free.',
      'Diagnóstico a fondo de piel y cabello.',
      'Racha de rutina.',
      '5 rutinas personalizables.'
    ],
    buttonText: 'Ver más',
    main: true
  },
  {
    id: 3,
    title: 'Kälm Premium',
    description: 'Ideal para expertos en skincare y haircare, tanto profesionales como entusiastas.',
    price: 'ARS $20,000 /mes',
    features: [
      'Todo lo incluido en Kälm Plus.',
      'Asesoramiento con profesionales.',
      'Rutinas personalizables ilimitadas.',
      '‘Self-pack’ de bienvenida.'
    ],
    buttonText: 'Ver más',
    main: false
  }
];
</script>


<template>
  <div class="flex flex-col items-center gap-6 w-full max-w-7xl mx-auto">
    <MainTitle>Planes</MainTitle>
    <SubTitle class="text-center">Elige el plan que mejor se adapte a tus necesidades.</SubTitle>

    <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-6 mt-3 items-stretch">
      <div v-for="plan in plans" :key="plan.id" :class="[
        'py-4 rounded-2xl flex', // padding pequeño para que el gradiente sea borde
        plan.main ? 'bg-gradient-to-b from-[#37A0AF] to-[#CCE2E5] py-4 px-2' : 'bg-[#FFFFFFFF]'
      ]">
        <!-- Contenedor interno blanco -->
        <div class="flex flex-col py-6 px-8 rounded-2xl bg-white/80 w-full h-full">
          <h3 class="text-2xl font-bold text-[#306067] mb-2 text-center">{{ plan.title }}</h3>
          <p class="text-gray-700 mb-4 text-start">{{ plan.description }}</p>
          <SubTitle class="text-5xl font-extrabold text-[#37A0AF] mb-4 text-center">
            {{ plan.price }}
          </SubTitle>


          <p class="text-[#306067] text-lg font-bold text-start mt-2 mb-2">¿Qué incluye?</p>
          <ul class="flex flex-col gap-2 text-gray-700 text-start mb-6">
            <li v-for="(feature, i) in plan.features" :key="i" class="flex items-center gap-2">
              <span class="text-teal-500 font-bold">✔</span> {{ feature }}
            </li>
          </ul>

          <div class="mt-auto flex justify-center">
            <BtnMain v-if="plan.main" class="w-50">{{ plan.buttonText }}</BtnMain>
            <BtnDark v-else class="w-50">{{ plan.buttonText }} </BtnDark>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr !important;
  }
}

/* Ajuste para que plan principal sea apenas más grande */
.scale-105 {
  transform: scale(1.05);
}
</style>
