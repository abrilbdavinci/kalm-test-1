<script>
export default {
  name: 'Footer'
}
</script>

<template>
  <footer
    class="text-white w-full flex-col items-stretch py-10 px-20"
    :style="{
      backgroundColor: '#306067',
      borderTopLeftRadius: '60px',
      borderTopRightRadius: '60px'
    }"
  >

  <p class="text-center">Copyright &copy; 2025 - Kälm. Todos los derechos reservados. Buenos Aires, Argentina.</p>
    <slot />
  </footer>
</template>
