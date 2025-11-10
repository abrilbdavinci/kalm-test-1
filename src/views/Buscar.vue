<script setup>
import SearchBar from "../components/SearchBar.vue";
import { ref } from "vue";

const historial = ref(["Nivea", "Eximia", "Head & Shoulders", "The Ordinary"]);
</script>

<template>
  <section class="p-4 flex flex-col gap-4">
    <h1 class="text-2xl font-bold text-[#306067]">Kälm</h1>
    <SearchBar />

    <div class="flex flex-col gap-3 mt-4">
      <div
        v-for="(item, i) in historial"
        :key="i"
        class="flex justify-between items-center bg-white/30 border border-white/40 rounded-xl p-3"
      >
        <div class="flex items-center gap-2 text-gray-700">
          <font-awesome-icon icon="fa-solid fa-clock-rotate-left" />
          <p>{{ item }}</p>
        </div>
        <font-awesome-icon icon="fa-solid fa-xmark" class="text-gray-400" />
      </div>
    </div>
  </section>
</template>
