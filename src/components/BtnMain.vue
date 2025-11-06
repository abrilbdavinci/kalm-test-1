<template>
  <button
    type="button"
    :disabled="disabled || loading"
    class="px-5 py-2 rounded-xl pt-3 text-white font-semibold transition hover:opacity-90 disabled:opacity-80 disabled:cursor-not-allowed"
    :style="{ backgroundColor: '#37A0AF' }"
  >
    <span v-if="loading">Guardando...</span>
    <span v-else><slot /></span>
  </button>
</template>

<script>
export default {
  name: "BtnMain",
  props: {
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
  },
};
</script>
