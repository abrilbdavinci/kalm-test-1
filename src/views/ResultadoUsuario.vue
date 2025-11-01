<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import BtnDark from "../components/BtnDark.vue";

const router = useRouter();
const resultados = ref([]);
const loading = ref(true);
const error = ref(null);

function getUserFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return { _id: payload.id, name: payload.name };
  } catch (err) {
    console.error(err);
    return null;
  }
}
const usuario = ref(getUserFromToken());

onMounted(async () => {
  if (!usuario.value?._id) {
    router.push("/");
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/resultadosUsuarios/${usuario.value._id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    if (!res.ok) throw new Error("No se pudieron cargar los resultados");

    resultados.value = await res.json();
  } catch (err) {
    console.error(err);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <section class="p-6 max-w-4xl mx-auto text-center">
    <h1 class="text-2xl font-bold mb-6">Mi Perfil</h1>

    <BtnDark text="Volver al inicio" @click="$router.push('/')" class="mb-6" />

    <p v-if="loading" class="text-gray-500">Cargando resultados...</p>
    <p v-else-if="error" class="text-red-500">{{ error }}</p>

    <div v-else>
      <div v-if="resultados.length === 0" class="text-gray-600">
        No tienes resultados guardados aún.
      </div>

      <div v-else class="grid gap-6">
        <div v-for="(r, index) in resultados" :key="index" class="p-4 border rounded-lg">
          <h2 class="font-bold text-lg capitalize">{{ r.testKey }}</h2>
          <p>Resultado: <span class="font-semibold">{{ r.resultadoId.resultado }}</span></p>
          <p>ID Resultado: {{ r.resultadoId._id }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
