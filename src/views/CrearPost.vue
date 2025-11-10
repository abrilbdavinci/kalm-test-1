<script setup>
import { ref } from "vue";
import BtnDark from "../components/BtnDark.vue";
import { currentUser } from "../main.js";

const contenido = ref("");
const imagen = ref(null);

const handleUpload = (e) => {
  const file = e.target.files[0];
  if (file) imagen.value = URL.createObjectURL(file);
};

const publicar = async () => {
  const formData = new FormData();
  formData.append("contenido", contenido.value);
  if (imagen.value) formData.append("imagen", imagen.value);

  await fetch("http://localhost:3000/posts", {
    method: "POST",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    body: formData,
  });

  alert("Post publicado ✅");
};
</script>

<template>
  <section class="flex flex-col gap-4 p-4">
    <div class="flex items-center gap-2">
      <div class="w-12 h-12 bg-gray-200 rounded-full"></div>
      <p class="font-medium">{{ currentUser?.name || "Usuario" }}</p>
    </div>

    <textarea
      v-model="contenido"
      placeholder="Contenido del post..."
      class="w-full h-32 p-3 border border-gray-300 rounded-xl bg-white/30 backdrop-blur-sm"
    ></textarea>

    <label class="border border-gray-400 rounded-xl p-3 flex justify-between items-center">
      <span>Subir una foto</span>
      <font-awesome-icon icon="fa-solid fa-image" />
      <input type="file" hidden @change="handleUpload" />
    </label>

    <img v-if="imagen" :src="imagen" class="w-full rounded-xl object-cover" />

    <BtnDark class="mt-4" @click="publicar">Publicar</BtnDark>
  </section>
</template>
