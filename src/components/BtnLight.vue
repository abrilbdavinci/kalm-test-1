<template>
  <button
    :disabled="disabled || loading"
    class="px-5 py-2 border rounded-full font-semibold transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
    :style="{ borderColor: '#306067', backgroundColor: '#E6F4F7FF', color: '#306067' }"
  >
    <span v-if="loading">Cargando...</span>
    <slot v-else />
  </button>
</template>

<script>
export default {
  name: "BtnLight",
  props: {
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
  },
};
</script>
