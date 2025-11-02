<script>
import BtnDark from './BtnDark.vue'

export default {
  name: 'TestCard',
  components: { BtnDark },
}
</script>

<template>
  <div
    class="TestCard relative rounded-xl shadow-lg flex items-center justify-center h-48 w-full overflow-hidden">

    <!-- Capa semitransparente -->
    <div class="absolute inset-0 bg-white/30 backdrop-blur-[1px]"></div>

    <!-- Botón -->
    <div class="relative z-10">
      <slot name="button">
        <BtnDark class="w-full py-2 font-bold"></BtnDark>
      </slot>
    </div>
  </div>
</template>
