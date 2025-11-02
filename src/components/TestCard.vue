<script>
import BtnDark from './BtnDark.vue'
import SubTitle from './SubTitle.vue'

export default {
  name: 'TestCard',
  components: {
    BtnDark,
    SubTitle
  },
}
</script>

<template>
  <div
    class="TestCard relative rounded-xl shadow-lg flex flex-col justify-between h-100 w-full overflow-hidden">

    <!-- Capa semitransparente encima del background -->
    <div class="absolute inset-0 bg-white/40 backdrop-blur-[1px]"></div>

    <!-- Contenido -->
    <div class="relative z-10 p-6 flex flex-col justify-between h-full">
      <!-- Header -->
      <h2 class="text-lg md:text-xl font-semibold mb-4 text-[#306067]">
        <slot name="header">Título del Test</slot>
      </h2>

      <!-- Descripción -->
      <SubTitle class="text-lg md:text-xl font-semibold mb-4 text-[#306067]">
        <slot name="content">Descripción del test</slot>
      </SubTitle>

      <!-- Botón -->
      <slot name="button">
        <BtnDark class="w-full py-2 font-bold">Comenzar</BtnDark>
      </slot>
    </div>
  </div>
</template>
