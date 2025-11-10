<script setup>
import { ref } from "vue";
import BtnDark from "../components/BtnDark.vue";
import { currentUser } from "../main.js";

const contenido = ref("");
const file = ref(null);
const preview = ref(null);
const submitting = ref(false);
const themes = ref([]); // array, pero guardará solo un valor en este caso
const accordionOpen = ref(false); // controla apertura del acordeón

const handleUpload = (e) => {
  const f = e.target.files && e.target.files[0];
  if (!f) return;
  if (preview.value) URL.revokeObjectURL(preview.value);
  file.value = f;
  preview.value = URL.createObjectURL(f);
};

const seleccionarTema = (tema) => {
  themes.value = [tema]; // solo un tema
  accordionOpen.value = false; // cerrar acordeón al seleccionar
};

const publicar = async () => {
  if (!contenido.value.trim() && !file.value) {
    alert("Agregá contenido o una imagen antes de publicar.");
    return;
  }

  if (themes.value.length === 0) {
    alert("Seleccioná un tema (haircare o skincare).");
    return;
  }

  if (!currentUser?.value?._id) {
    alert("No autenticado");
    return;
  }

  submitting.value = true;
  try {
    const formData = new FormData();
    formData.append("author", currentUser.value._id);
    formData.append("content", contenido.value);
    formData.append("theme", themes.value.join(","));
    if (file.value) formData.append("imagen", file.value);

    console.group("FormData a enviar");
    for (const pair of formData.entries()) {
      if (pair[1] instanceof File) {
        console.log(pair[0], pair[1].name, pair[1].size, pair[1].type);
      } else {
        console.log(pair[0], pair[1]);
      }
    }
    console.groupEnd();

    const res = await fetch("http://localhost:3000/posts", {
      method: "POST",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: formData,
    });

    const contentType = res.headers.get("content-type") || "";
    let body = contentType.includes("application/json")
      ? await res.json()
      : await res.text();

    if (!res.ok) {
      console.error("Error al publicar:", res.status, body);
      alert(`Error ${res.status}: ${body?.message || body || "Error al publicar"}`);
      return;
    }

    contenido.value = "";
    themes.value = [];
    if (preview.value) {
      URL.revokeObjectURL(preview.value);
      preview.value = null;
      file.value = null;
    }
    alert("Post publicado ✅");
  } catch (err) {
    console.error("Publicar error:", err);
    alert("Error al publicar (ver consola).");
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <section
    class="flex flex-col gap-4 w-full max-w-2xl mx-auto p-4 bg-white/50 rounded-2xl backdrop-blur-sm shadow"
  >
    <div class="flex items-center gap-3">
      <div class="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
        <img
          v-if="currentUser?.avatar"
          :src="currentUser.avatar"
          alt="avatar"
          class="w-full h-full object-cover"
        />
      </div>
      <p class="font-medium text-lg">{{ currentUser?.name || "Usuario" }}</p>
    </div>

    <textarea
      v-model="contenido"
      placeholder="Contenido del post..."
      class="w-full h-32 p-3 border border-gray-300 rounded-xl bg-white/30 backdrop-blur-sm"
    ></textarea>

    <!-- === ACORDEÓN SIMPLE DE TEMAS === -->
    <div class="flex flex-col gap-2 relative">
      <button
        type="button"
        class="border border-gray-400 rounded-xl p-3 flex justify-between items-center bg-white/30 backdrop-blur-sm cursor-pointer"
        @click="accordionOpen = !accordionOpen"
      >
        <span>
          {{ themes[0] ? `Tema: ${themes[0]}` : "Seleccioná un tema" }}
        </span>
        <font-awesome-icon
          :icon="accordionOpen ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'"
        />
      </button>

      <div
        v-if="accordionOpen"
        class="absolute top-[110%] left-0 right-0 bg-white rounded-xl border border-gray-300 shadow-md z-10"
      >
        <button
          class="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-t-xl"
          @click="seleccionarTema('haircare')"
        >
          Haircare
        </button>
        <button
          class="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-b-xl"
          @click="seleccionarTema('skincare')"
        >
          Skincare
        </button>
      </div>
    </div>

    <label
      class="border border-gray-400 rounded-xl p-3 flex justify-between items-center cursor-pointer"
    >
      <span>Subir una foto</span>
      <font-awesome-icon icon="fa-solid fa-image" />
      <input type="file" accept="image/*" hidden @change="handleUpload" />
    </label>

    <img
      v-if="preview"
      :src="preview"
      class="w-full rounded-xl object-cover"
      alt="preview"
    />

    <BtnDark class="mt-4" :disabled="submitting" @click="publicar">
      {{ submitting ? "Publicando..." : "Publicar" }}
    </BtnDark>
  </section>
</template>
