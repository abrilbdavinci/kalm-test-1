<template>
  <button
    :disabled="disabled || loading"
    class="px-5 py-2 pt-3 rounded-xl text-white font-semibold transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
    :style="{ backgroundColor: '#306067' }"
  >
    <span v-if="loading">Cargando...</span>
    <slot v-else />
  </button>
</template>

<script>
export default {
  name: "BtnDark",
  props: {
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
  },
};
</script>
