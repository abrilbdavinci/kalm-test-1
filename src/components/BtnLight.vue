<script>
export default {
  name: 'BtnLight'
}
</script>

<template>
  <button
    class="border border-teal-500 text-teal-500 bg-transparent px-4 py-2 rounded-md hover:bg-teal-50 transition"
  >
    <slot />
  </button>
</template>
