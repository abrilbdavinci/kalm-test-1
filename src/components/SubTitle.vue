<script>
export default {
  name: 'SubTitle'
}
</script>

<template>
  <h2
    :class="['text-3xl md:text-4xl font-extrabold text-center', $attrs.class]"
    :style="$attrs.style || 'color: #37A0AF;'"
  >
    <slot />
  </h2>
</template>
