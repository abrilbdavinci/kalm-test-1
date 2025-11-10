<script setup>
import { ref, onMounted } from "vue";
import ReviewCard from "../components/ReviewCard.vue";

const reviews = ref([]);

onMounted(async () => {
  const res = await fetch("http://localhost:3000/reviews");
  reviews.value = await res.json();
});
</script>

<template>
  <section class="p-4 flex flex-col gap-4">
    <h2 class="font-semibold text-lg">Reviews de usuarios ({{ reviews.length }})</h2>

    <div class="flex flex-col gap-4">
      <ReviewCard v-for="r in reviews" :key="r._id" :review="r" />
    </div>
  </section>
</template>
