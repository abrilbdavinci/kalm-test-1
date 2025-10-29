<script>
export default {
  name: 'Footer'
}
</script>

<template>
  <footer
    class="text-white py-5 text-center w-full"
    :style="{
      backgroundColor: '#306067',
      borderTopLeftRadius: '25px',
      borderTopRightRadius: '25px'
    }"
  >
    <slot />
  </footer>
</template>
