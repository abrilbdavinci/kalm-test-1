<script>
export default {
  name: 'BtnMain'
}
</script>

<template>
  <button
    class="bg-teal-500 text-white px-5 py-2  rounded-md hover:bg-teal-400 transition"
  >
    <slot />
  </button>
</template>
