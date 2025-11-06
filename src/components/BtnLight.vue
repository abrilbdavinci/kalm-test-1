<template>
  <button
    :disabled="disabled || loading"
    class="btn-light px-6 pt-3 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
    :class="{
      'opacity-60 cursor-not-allowed': disabled || loading,
      'hover:brightness-95': !disabled && !loading
    }"
  >
    <span v-if="loading" class="animate-pulse">Cargando...</span>
    <slot v-else />
  </button>
</template>

<script>
export default {
  name: "BtnLight",
  props: {
    loading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false }
  },
};
</script>

<style scoped>
.btn-light {
  background-color: #E6F4F7;
  color: #306067;
}
</style>
