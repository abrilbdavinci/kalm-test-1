<template>
  <button
    class="px-5 py-2  rounded-full text-white transition"
    :style="{ backgroundColor: '#306067' }"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: 'BtnDark',
}
</script>
