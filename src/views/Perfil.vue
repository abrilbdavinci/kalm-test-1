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
    <section class="flex flex-col items-center max-w-6xl mx-auto">
        <MainTitle class="mb-2">Mi perfil</MainTitle>

        <!-- Info adicional del usuario -->
        <div v-if="!loading && !error"
            class="w-4xl bg-white/20 backdrop-blur-[20px] border border-white/30 rounded-xl p-6 shadow-md mt-6">
            <div class="flex justify-between items-center w-full">
                <div class="flex flex-col items-start info-perfil">
                    <p class="mb-2"><strong>Nombre:</strong> {{ currentUser?.name || "-" }}</p>
                    <p class="mb-2"><strong>Email:</strong> {{ currentUser?.email || "-" }}</p>
                    <p class="mb-2"><strong>Perfil creado el:</strong> {{ fechaCreacion || "-" }}</p>
                </div>

                <BtnDark class="mt-0">Editar perfil</BtnDark>
            </div>



            <!-- Resultados de tests -->
            <div class="grid gap-6 sm:grid-cols-1 md:grid-cols-2 mt-8">
                <div v-for="testKey in ['piel', 'cabello']" :key="testKey"
                    class="glass-card flex flex-col justify-between p-6 rounded-xl shadow relative overflow-hidden">
                    <h2 class="text-lg font-bold text-[#306067] capitalize mb-2">{{ testKey }}</h2>

                    <div v-if="getResultadoByTestKey(testKey)">
                        <p><strong>Resultado:</strong> {{ getResultadoByTestKey(testKey).resultadoId.resultado }}</p>
                        <BtnLight class="mt-4 mx-auto" @click="rehacerTest(testKey)">Rehacer Test</BtnLight>
                    </div>

                    <div v-else>
                        <p class="text-gray-600">Aún no realizaste este test.</p>
                        <BtnDark class="mt-4 mx-auto" @click="$router.push(`/tests?id=${testKey}`)">Hacer Test</BtnDark>
                    </div>
                </div>
            </div>

            <div class="mt-10 flex justify-center gap-4">
                <BtnMain @click="$router.push('/tests')">Ver todos los tests</BtnMain>
            </div>
        </div>

        <p v-if="loading" class="text-gray-500 text-lg mt-6">Cargando perfil...</p>
        <p v-else-if="error" class="text-red-500 text-lg mt-6">{{ error }}</p>
    </section>
</template>
