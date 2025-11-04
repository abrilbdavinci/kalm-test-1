<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { currentUser } from '../main.js'; // <-- importamos el usuario global
import MainTitle from "../components/MainTitle.vue";
import SubTitle from "../components/SubTitle.vue";
import BtnDark from "../components/BtnDark.vue";
import BtnLight from "../components/BtnLight.vue";
import BtnMain from "../components/BtnMain.vue";

const router = useRouter();
const loading = ref(true);
const error = ref(null);
const resultados = ref([]);
const fechaCreacion = ref(null);

// -------------------- TESTS DISPONIBLES --------------------
const testsDisponibles = [
    { key: "piel", title: "Test de Piel", route: "/tests?id=piel" },
    { key: "cabello", title: "Test de Cabello", route: "/tests?id=cabello" },
];

// -------------------- CARGAR RESULTADOS --------------------
onMounted(async () => {
    if (!currentUser.value?._id) {
        alert("Usuario no autenticado");
        router.push("/login");
        return;
    }

    try {
        // Obtener resultados
        const res = await fetch(`http://localhost:3000/resultadosUsuarios/${currentUser.value._id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (!res.ok) throw new Error("No se pudo obtener los resultados");

        resultados.value = await res.json();

        // Obtener info completa del usuario desde backend
        const resUser = await fetch(`http://localhost:3000/users/${currentUser.value._id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (resUser.ok) {
            const userData = await resUser.json();
            currentUser.value.email = userData.email || currentUser.value.email;
            fechaCreacion.value = userData.createdAt
                ? new Date(userData.createdAt).toLocaleDateString("es-AR")
                : null;
        }
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
const rehacerTest = async (testKey) => {
    if (!currentUser.value?._id) return;

    try {
        const resDelete = await fetch(
            `http://localhost:3000/resultadosUsuarios/${currentUser.value._id}/${testKey}`,
            {
                method: "DELETE",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            }
        );
        if (!resDelete.ok) throw new Error("No se pudo eliminar el resultado previo");

        router.push(`/tests?id=${testKey}`);
    } catch (err) {
        console.error(err);
        alert("No se pudo rehacer el test. Intenta nuevamente.");
    }
};
</script>

<template>
    <section class="flex flex-col lg:flex-row w-full mx-auto gap-6">
  
      <!-- === COLUMNA IZQUIERDA — PERFIL === -->
      <aside class="w-full h-100 lg:w-[35%] bg-white/20 backdrop-blur-[20px] border border-white/30 rounded-2xl p-6 shadow-md flex flex-col items-center text-center">
  
        <!-- Avatar -->
        <div class="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-3">
          <img v-if="currentUser?.avatar" :src="currentUser.avatar" class="w-full h-full object-cover">
          <div v-else class="w-full h-full bg-gray-300"></div>
        </div>
  
        <!-- Datos Usuario -->
        <h2 class="text-xl font-semibold flex items-center gap-1">
          {{ currentUser?.name || "Usuario ✨" }}
        </h2>
        <p class="text-sm text-gray-600">mi biografía re chu</p>
  
        <!-- Stats -->
        <div class="flex justify-center gap-8 my-4">
          <div class="text-center">
            <p class="font-bold">10</p>
            <p class="text-xs text-gray-600">seguidores</p>
          </div>
          <div class="text-center">
            <p class="font-bold">30</p>
            <p class="text-xs text-gray-600">seguidos</p>
          </div>
          <div class="text-center">
            <p class="font-bold">3</p>
            <p class="text-xs text-gray-600">posteos</p>
          </div>
        </div>
  
        <!-- Botones -->
        <div class="flex flex-col w-50 gap-2">
          <BtnDark @click="router.push('/editar-perfil')">Editar mi perfil</BtnDark>
          <!-- <BtnLight>Seguir</BtnLight> -->
        </div>
  
        <!-- Fecha creación -->
        <p class="text-xs text-gray-500 mt-4">Miembro desde {{ fechaCreacion }}</p>
  
      </aside>
  
      <!-- === COLUMNA DERECHA — CONTENIDO === -->
      <section class="w-full lg:w-[65%] flex flex-col gap-4">
  
        
  
        <!-- Panel de test (tu lógica original) -->
        <section v-if="!loading && !error" class="bg-white/20 backdrop-blur-[20px] border border-white/30 rounded-xl p-6">
          <h3 class="text-lg font-semibold text-[#306067] mb-4">Mis tests</h3>
  
          <div class="grid gap-6 md:grid-cols-2">
            <div 
              v-for="testKey in ['piel','cabello']"
              :key="testKey"
              class="glass-card flex flex-col p-4 rounded-xl shadow"
            >
              <h4 class="font-bold capitalize mb-2">{{ testKey }}</h4>
  
              <template v-if="getResultadoByTestKey(testKey)">
                <p class="text-sm">
                  <strong>Resultado:</strong> {{ getResultadoByTestKey(testKey).resultadoId.resultado }}
                </p>
                <BtnLight class="mt-4 w-full" @click="rehacerTest(testKey)">Rehacer test</BtnLight>
              </template>
  
              <template v-else>
                <p class="text-gray-600 text-sm">Aún no realizaste este test.</p>
                <BtnDark class="mt-4 w-full" @click="$router.push(`/tests?id=${testKey}`)">Hacer test</BtnDark>
              </template>
            </div>
          </div>
        </section>
        <!-- Tabs contenido -->
        <nav class="w-full bg-white/20 backdrop-blur-[20px] border border-white/30 rounded-xl p-4 flex justify-around text-sm font-medium">
          <button class="hover:font-semibold">Posts</button>
          <button class="hover:font-semibold">Reviews</button>
          <button class="hover:font-semibold">Rutinas</button>
        </nav>
  
        <!-- Placeholder feed posts -->
        <section class="bg-white/20 backdrop-blur-[20px] border border-white/30 rounded-xl h-96 flex items-center justify-center text-gray-700">
          posteos?? scroll obvio
        </section>
  
      </section>
  
      <!-- Loading / Error -->
      <p v-if="loading" class="text-gray-500 text-lg mt-6 text-center w-full">Cargando perfil...</p>
      <p v-else-if="error" class="text-red-500 text-lg mt-6 text-center w-full">{{ error }}</p>
  
    </section>
  </template>
  
