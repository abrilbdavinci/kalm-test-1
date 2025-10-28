<template>
  <button
    class="px-5 py-2 border rounded-full transition"
    :style="{ borderColor: '#306067', color: '#306067' }"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: 'BtnLight',
}
</script>
