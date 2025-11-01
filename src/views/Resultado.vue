<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import BtnDark from "../components/BtnDark.vue";
import BtnMain from "../components/BtnMain.vue";
import MainTitle from "../components/MainTitle.vue";
import SubTitle from "../components/SubTitle.vue";

// -------------------- COMPONENTES DE RESULTADOS --------------------
import ResultadoPielSeca from "../components/resultados/piel/ResultadoSeca.vue";
import ResultadoPielMixta from "../components/resultados/piel/ResultadoMixta.vue";
import ResultadoPielGrasa from "../components/resultados/piel/ResultadoGrasa.vue";
import ResultadoPielNormal from "../components/resultados/piel/ResultadoNormal.vue";
import ResultadoPielSensible from "../components/resultados/piel/ResultadoSensible.vue";

import ResultadoCabelloSeco from "../components/resultados/cabello/ResultadoSeco.vue";
import ResultadoCabelloMixto from "../components/resultados/cabello/ResultadoMixto.vue";
import ResultadoCabelloGraso from "../components/resultados/cabello/ResultadoGraso.vue";
import ResultadoCabelloNormal from "../components/resultados/cabello/ResultadoNormal.vue";

// -------------------- ROUTER --------------------
const route = useRoute();
const router = useRouter();

// -------------------- STATE --------------------
const resultado = ref(null);
const loading = ref(true);
const error = ref(null);
const saving = ref(false);
const saveMessage = ref("");

// -------------------- COMPONENTES DINÁMICOS --------------------
const componentes = {
  piel: {
    seca: ResultadoPielSeca,
    mixta: ResultadoPielMixta,
    grasa: ResultadoPielGrasa,
    normal: ResultadoPielNormal,
    sensible: ResultadoPielSensible,
  },
  cabello: {
    seco: ResultadoCabelloSeco,
    mixto: ResultadoCabelloMixto,
    graso: ResultadoCabelloGraso,
    normal: ResultadoCabelloNormal,
  },
};

const componenteResultado = computed(() => {
  if (!resultado.value) return null;
  const testKey = resultado.value.testTitle.toLowerCase().includes("cabello") ? "cabello" : "piel";
  const tipo = resultado.value.resultado.toLowerCase();
  return componentes[testKey]?.[tipo] || null;
});

// -------------------- USUARIO --------------------
function getUserFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return { _id: payload.id, name: payload.name };
  } catch (err) {
    console.error("Error al decodificar token:", err);
    return null;
  }
}
const usuario = ref(getUserFromToken());

// -------------------- CARGAR RESULTADO --------------------
onMounted(async () => {
  const id = route.query.id;
  if (!id) {
    alert("No se recibió el ID del resultado.");
    router.push("/");
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/resultados/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (!res.ok) throw new Error("No se pudo obtener el resultado");
    resultado.value = await res.json();
    console.log("📥 Resultado recibido:", resultado.value);
  } catch (err) {
    console.error("💥 Error al cargar resultado:", err);
    error.value = "Error al cargar resultado";
  } finally {
    loading.value = false;
  }
});

// -------------------- GUARDAR RESULTADO --------------------
const guardarResultado = async () => {
  if (!usuario.value?._id || !resultado.value) {
    alert("No se puede guardar el resultado. Usuario o resultado faltante.");
    return;
  }

  saving.value = true;
  saveMessage.value = "";

  try {
    const payload = {
      user: usuario.value._id,
      testKey: resultado.value.testTitle.toLowerCase().includes("cabello") ? "cabello" : "piel",
      resultadoId: resultado.value._id,
    };

    const res = await fetch("http://localhost:3000/resultadosUsuarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al guardar resultado");

    saveMessage.value = "Resultado guardado correctamente en tu perfil";
  } catch (err) {
    console.error(err);
    saveMessage.value = "Error al guardar resultado";
  } finally {
    saving.value = false;
  }
};
</script>

<template>
  <section class="flex flex-col items-center justify-start px-6 text-center">
    <MainTitle>Resultados del Test</MainTitle>
    <SubTitle>
      <template #header>
        <span class="text-[#306067] font-extrabold">¡Test terminado!</span>
      </template>
    </SubTitle>

    <section class="mt-6 w-full max-w-3xl">
      <p v-if="loading" class="text-gray-500 text-lg">Cargando resultado...</p>
      <p v-else-if="error" class="text-red-500 text-lg">{{ error }}</p>
      <component v-else-if="componenteResultado" :is="componenteResultado" />
      <p v-else class="text-gray-600 text-lg mt-4">
        No se encontró un resultado para este tipo.
      </p>
    </section>

    <div class="flex gap-4 mt-10">
      <BtnDark @click="$router.push('/')">Volver al inicio</BtnDark>
      <BtnMain :loading="saving" @click="guardarResultado">
        Guardar mi resultado
      </BtnMain>
    </div>

    <p v-if="saveMessage" class="mt-4 text-green-600">{{ saveMessage }}</p>
  </section>
</template>
