<script setup>
defineProps({ blog: Object });
</script>

<template>
  <div class="bg-white/30 border border-white/40 rounded-xl overflow-hidden">
    <div class="h-40 bg-gray-200">
      <img v-if="blog.imagen" :src="blog.imagen" class="h-full w-full object-cover" />
    </div>
    <div class="p-3">
      <h3 class="font-bold text-gray-800">{{ blog.titulo }}</h3>
      <p class="text-sm text-gray-600">{{ blog.descripcion }}</p>
    </div>
  </div>
</template>
