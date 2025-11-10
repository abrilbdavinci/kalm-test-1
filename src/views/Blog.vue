<script setup>
import { ref, onMounted } from "vue";
import BlogCard from "../components/BlogCard.vue";

const blogs = ref([]);

onMounted(async () => {
  const res = await fetch("http://localhost:3000/blogs");
  blogs.value = await res.json();
});
</script>

<template>
  <section class="p-4 flex flex-col gap-4">
    <BlogCard v-for="b in blogs" :key="b._id" :blog="b" />
  </section>
</template>
