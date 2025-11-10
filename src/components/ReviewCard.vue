<script setup>
defineProps({ review: Object });
</script>

<template>
  <div class="bg-white/30 border border-white/40 rounded-xl p-3 flex flex-col gap-2">
    <div class="flex items-center justify-between">
      <p class="font-bold">{{ review.usuario }}</p>
      <p class="text-xs text-gray-500">{{ new Date(review.fecha).toLocaleDateString() }}</p>
    </div>

    <p class="text-sm text-gray-700">{{ review.texto }}</p>

    <div class="flex gap-2 overflow-x-auto">
      <img
        v-for="img in review.imagenes"
        :src="img"
        class="h-24 w-24 object-cover rounded-lg"
      />
    </div>

    <div class="flex items-center justify-end gap-3 text-gray-500 text-sm">
      <font-awesome-icon icon="fa-solid fa-comment" /> {{ review.comentarios }}
      <font-awesome-icon icon="fa-solid fa-heart" /> {{ review.likes }}
    </div>
  </div>
</template>
