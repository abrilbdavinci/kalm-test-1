<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import MainTitle from "../components/MainTitle.vue";
import SubTitle from "../components/SubTitle.vue";
import BtnDark from "../components/BtnDark.vue";
import BtnLight from "../components/BtnLight.vue";
import BtnMain from "../components/BtnMain.vue";

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
const router = useRouter();
const loading = ref(true);
const error = ref(null);
const resultados = ref([]);

// -------------------- TESTS DISPONIBLES --------------------
const testsDisponibles = [
    { key: "piel", title: "Test de Piel", route: "/tests?id=piel" },
    { key: "cabello", title: "Test de Cabello", route: "/tests?id=cabello" },
];

// -------------------- CARGAR RESULTADOS --------------------
onMounted(async () => {
    if (!usuario.value?._id) {
        alert("Usuario no autenticado");
        router.push("/login");
        return;
    }

    try {
        const res = await fetch(`http://localhost:3000/resultadosUsuarios/${usuario.value._id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (!res.ok) throw new Error("No se pudo obtener los resultados");

        const data = await res.json();
        resultados.value = data; // Array con resultados guardados
    } catch (err) {
        console.error(err);
        error.value = "Error al cargar tus resultados";
    } finally {
        loading.value = false;
    }
});

// -------------------- UTIL --------------------
const getResultadoByTestKey = (key) => {
    return resultados.value.find((r) => r.testKey === key);
};

// -------------------- ACCIONES --------------------
const hacerTest = (route) => {
    router.push(route);
};

const rehacerTest = async (testKey) => {
    if (!usuario.value?._id) return;

    try {
        // 1️⃣ Eliminar resultado anterior
        const resDelete = await fetch(`http://localhost:3000/resultadosUsuarios/${usuario.value._id}/${testKey}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        if (!resDelete.ok) throw new Error("No se pudo eliminar el resultado previo");

        // 2️⃣ Redirigir al test correspondiente
        router.push(`/tests?id=${testKey}`);
    } catch (err) {
        console.error(err);
        alert("No se pudo rehacer el test. Intenta nuevamente.");
    }
};

</script>

<template>
  <section class="flex flex-col items-center px-4 py-10 max-w-6xl mx-auto">
    <MainTitle>Mi Perfil</MainTitle>
    <SubTitle>
      <template #header>
        <span class="text-[#306067] font-extrabold">{{ usuario?.name || "Usuario" }}</span>
      </template>
    </SubTitle>

    <p v-if="loading" class="text-gray-500 text-lg mt-6">Cargando tus resultados...</p>
    <p v-else-if="error" class="text-red-500 text-lg mt-6">{{ error }}</p>

    <div class="grid gap-6 sm:grid-cols-1 md:grid-cols-2 mt-8">
      <div
        v-for="testKey in ['piel', 'cabello']"
        :key="testKey"
        class="glass-card flex flex-col justify-between p-6 rounded-xl shadow relative overflow-hidden"
      >
        <h2 class="text-lg font-bold text-[#306067] capitalize mb-2">{{ testKey }}</h2>
        
        <div v-if="getResultadoByTestKey(testKey)">
          <p><strong>Resultado:</strong> {{ getResultadoByTestKey(testKey).resultadoId.resultado }}</p>
          <BtnMain class="mt-4" @click="rehacerTest(testKey)">Rehacer Test</BtnMain>
        </div>

        <div v-else>
          <p class="text-gray-600">Aún no realizaste este test.</p>
          <BtnMain class="mt-4" @click="$router.push(`/tests?id=${testKey}`)">Hacer Test</BtnMain>
        </div>
      </div>
    </div>

    <div class="mt-10 flex justify-center gap-4">
      <BtnDark @click="$router.push('/')">Volver al inicio</BtnDark>
      <BtnLight @click="$router.push('/tests')">Ver todos los tests</BtnLight>
    </div>
  </section>
</template>
