<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { currentUser } from "../main.js"; // <-- usuario global
import MainTitle from "../components/MainTitle.vue";
import SubTitle from "../components/SubTitle.vue";
import BtnDark from "../components/BtnDark.vue";
import BtnLight from "../components/BtnLight.vue";
import BtnMain from "../components/BtnMain.vue";

import avatarPlaceholder from "../assets/img/avatar-placeholder.png"; // <-- imagen por defecto

const router = useRouter();
const loading = ref(true);
const error = ref(null);
const resultados = ref([]);
const fechaCreacion = ref(null);
const posts = ref([]);
const seguidores = ref(0);
const seguidos = ref(0);

// estado para eliminar
const deletingPost = ref(null); // post objeto que se quiere eliminar
const showDeleteModal = ref(false);
const deleting = ref(false);

// -------------------- TESTS DISPONIBLES --------------------
const testsDisponibles = [
  { key: "piel", title: "Test de Piel", route: "/tests?id=piel" },
  { key: "cabello", title: "Test de Cabello", route: "/tests?id=cabello" },
];

// util: construir URL pública para la imagen del post
const resolvePostImage = (img) => {
  if (!img) return null;
  if (typeof img === "string" && (img.startsWith("http") || img.startsWith("/uploads"))) {
    return img.startsWith("http") ? img : `http://localhost:3000${img}`;
  }
  return `http://localhost:3000/uploads/posts/${img}`;
};

// -------------------- CARGAR DATOS DEL PERFIL --------------------
onMounted(async () => {
  if (!currentUser.value?._id) {
    alert("Usuario no autenticado");
    router.push("/login");
    return;
  }

  try {
    // Obtener resultados (tu endpoint ya existente)
    const res = await fetch(
      `http://localhost:3000/resultadosUsuarios/${currentUser.value._id}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );

    if (!res.ok) throw new Error("No se pudo obtener los resultados");
    resultados.value = await res.json();

    // Obtener información básica del usuario (followers/following)
    const resUser = await fetch(
      `http://localhost:3000/users/${currentUser.value._id}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );

    if (resUser.ok) {
      const userData = await resUser.json();
      currentUser.value.email = userData.email || currentUser.value.email;
      currentUser.value.avatar = userData.avatar || currentUser.value.avatar;
      currentUser.value.name = userData.name || currentUser.value.name;

      fechaCreacion.value = userData.createdAt
        ? new Date(userData.createdAt).toLocaleDateString("es-AR")
        : null;

      seguidores.value = userData.followers?.length || 0;
      seguidos.value = userData.following?.length || 0;
      // no uso userData.posts aquí porque puede venir como ObjectId sin popular
    } else {
      console.warn("No se pudo traer userData:", resUser.status);
    }

    // --- Traer posts del usuario mediante endpoint específico ---
    const resPosts = await fetch(
      `http://localhost:3000/posts/user/${currentUser.value._id}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );

    if (resPosts.ok) {
      let postsData = await resPosts.json();
      posts.value = postsData.map((p) => {
        return {
          _id: p._id,
          author: p.author || { _id: p.author?._id, name: p.author?.name, avatar: p.author?.avatar },
          content: p.content ?? p.contenido ?? p.body ?? "",
          image: p.image ?? p.imagen ?? p.img ?? null,
          theme: Array.isArray(p.theme) ? p.theme : (typeof p.theme === "string" ? p.theme.split(",").map(t => t.trim()) : []),
          createdAt: p.createdAt,
        };
      });
    } else {
      console.warn("No se pudieron traer posts del usuario:", resPosts.status);
    }
  } catch (err) {
    console.error("Error al cargar perfil:", err);
    error.value = "Error al cargar tu perfil.";
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

// abrir modal de confirmación para eliminar
const confirmDelete = (post) => {
  deletingPost.value = post;
  showDeleteModal.value = true;
};

// cancelar eliminación
const cancelDelete = () => {
  deletingPost.value = null;
  showDeleteModal.value = false;
};

// ejecutar eliminación
const deletePost = async () => {
  if (!deletingPost.value) return;
  if (!currentUser.value?._id) {
    alert("Acción no permitida. Iniciá sesión de nuevo.");
    return;
  }

  const id = deletingPost.value._id;
  const ok = confirm(`¿Querés eliminar este post? Esta acción no se puede deshacer.`);
  // si preferís el modal personalizado, podrías usar showDeleteModal; aquí usamos confirm además por seguridad
  if (!ok) {
    // si el usuario cancela confirm, mantenemos el modal pero cerramos igualmente
    cancelDelete();
    return;
  }

  deleting.value = true;
  try {
    const res = await fetch(`http://localhost:3000/posts/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      console.error("Error al eliminar post:", res.status, body);
      alert(`No se pudo eliminar el post. (${res.status})`);
      return;
    }

    // eliminar localmente
    posts.value = posts.value.filter((p) => p._id !== id);
    // actualizar contador (se calcula desde posts.length)
    // si además querés decrementar seguidores o actualizar userData en DB, hacelo en backend
    alert("Post eliminado correctamente.");
  } catch (err) {
    console.error("Error deletePost:", err);
    alert("Ocurrió un error al eliminar el post. Revisa la consola.");
  } finally {
    deleting.value = false;
    deletingPost.value = null;
    showDeleteModal.value = false;
  }
};
</script>

<template>
  <section class="flex flex-col lg:flex-row w-full mx-auto gap-6">
    <!-- === COLUMNA IZQUIERDA — PERFIL === -->
    <aside
      class="w-full h-100 lg:w-[35%] bg-white/20 backdrop-blur-[20px] border border-white/30 rounded-2xl p-6 shadow-md flex flex-col items-center text-center">
      <!-- Avatar -->
      <div class="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-3">
        <img :src="currentUser?.avatar || avatarPlaceholder" alt="Avatar del usuario"
          class="w-full h-full object-cover" />
      </div>

      <!-- Datos Usuario -->
      <h2 class="text-xl font-semibold flex items-center gap-1">
        {{ currentUser?.name || "Usuario" }}
      </h2>
      <p class="text-sm text-gray-600">
        {{ currentUser?.bio || "Aún no agregaste tu biografía." }}
      </p>

      <!-- Stats -->
      <div class="flex justify-center gap-8 my-4">
        <div class="text-center">
          <p class="font-bold">{{ seguidores }}</p>
          <p class="text-xs text-gray-600">seguidores</p>
        </div>
        <div class="text-center">
          <p class="font-bold">{{ seguidos }}</p>
          <p class="text-xs text-gray-600">seguidos</p>
        </div>
        <div class="text-center">
          <p class="font-bold">{{ posts.length }}</p>
          <p class="text-xs text-gray-600">posteos</p>
        </div>
      </div>

      <!-- Botones -->
      <div class="flex flex-col w-50 gap-2">
        <BtnDark @click="router.push('/editar-perfil')">Editar mi perfil</BtnDark>
      </div>

      <!-- Fecha creación -->
      <p class="text-xs text-gray-500 mt-4">Miembro desde {{ fechaCreacion }}</p>
    </aside>

    <!-- === COLUMNA DERECHA — CONTENIDO === -->
    <section class="w-full lg:w-[65%] flex flex-col gap-4">
      <!-- Panel de test -->
      <section v-if="!loading && !error" class="bg-white/20 backdrop-blur-[20px] border border-white/30 rounded-xl p-6">
        <h3 class="text-lg font-semibold text-[#306067] mb-4">Mis tests</h3>

        <div class="grid gap-6 md:grid-cols-2">
          <div v-for="testKey in ['piel', 'cabello']" :key="testKey"
            class="glass-card flex flex-col p-4 rounded-xl shadow">
            <h4 class="font-bold capitalize mb-2">{{ testKey }}</h4>

            <template v-if="getResultadoByTestKey(testKey)">
              <p class="text-sm">
                <strong>Resultado:</strong>
                {{ getResultadoByTestKey(testKey).resultadoId.resultado }}
              </p>
              <BtnLight class="mt-4 w-full" @click="rehacerTest(testKey)">
                Rehacer test
              </BtnLight>
            </template>

            <template v-else>
              <p class="text-gray-600 text-sm">Aún no realizaste este test.</p>
              <BtnDark class="mt-4 w-full" @click="$router.push(`/tests?id=${testKey}`)">
                Hacer test
              </BtnDark>
            </template>
          </div>
        </div>
      </section>

      <!-- Tabs contenido -->
      <nav
        class="w-full bg-white/20 backdrop-blur-[20px] border border-white/30 rounded-xl p-4 flex justify-around text-sm font-medium">
        <button class="hover:font-semibold">Posts</button>
        <button class="hover:font-semibold">Reviews</button>
        <button class="hover:font-semibold">Rutinas</button>
      </nav>

      <!-- Feed de posts del usuario -->
      <section
        class="bg-white/20 backdrop-blur-[20px] border border-white/30 rounded-xl p-3 flex flex-col max-h-96 overflow-y-auto">
        <div v-if="posts.length">
          <div v-for="post in posts" :key="post._id"
            class="bg-white/60 rounded-xl p-4 flex flex-col gap-3 text-gray-800 mt-3">
            <div class="flex items-start gap-3">
              <img :src="post.author?.avatar || avatarPlaceholder" class="w-10 h-10 rounded-full object-cover" />
              <div class="flex-1">
                <p class="font-semibold">{{ post.author?.name || currentUser?.name || 'Usuario' }}</p>
                <p class="text-xs text-gray-500">{{ post.createdAt ? new
                  Date(post.createdAt).toLocaleDateString("es-AR") : ''
                  }}</p>
              </div>

              <!-- boton eliminar -->
              <div class="flex items-center">
                <button class="text-sm text-red-600 hover:underline" @click="confirmDelete(post)" :disabled="deleting"
                  title="Eliminar post">
                  Eliminar
                </button>
              </div>
            </div>

            <!-- contenido alineado al inicio -->
            <p class="text-sm mt-1 text-left">{{ post.content }}</p>

            <!-- imagen con previsualizacion cuadrada en el feed -->
            <div v-if="post.image" class="mt-2">
              <div class="w-full h-56 rounded-xl overflow-hidden">
                <img :src="resolvePostImage(post.image)" class="w-full h-full object-cover" />
              </div>
            </div>

            <div class="flex justify-between text-xs text-gray-600 mt-1">
              <span class="italic">{{ Array.isArray(post.theme) ? post.theme.join(", ") : post.theme }}</span>
              <span>{{ post.likes ? post.likes.length : 0 }} ❤</span>
            </div>
          </div>
        </div>

        <p v-else class="text-center text-gray-500">Aún no tenés posteos.</p>
      </section>
    </section>

    <!-- Loading / Error -->
    <p v-if="loading" class="text-gray-500 text-lg mt-6 text-center w-full">
      Cargando perfil...
    </p>
    <p v-else-if="error" class="text-red-500 text-lg mt-6 text-center w-full">
      {{ error }}
    </p>
  </section>

  <!-- Modal de confirmación (opcional visual) -->
  <div v-if="showDeleteModal && deletingPost" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div class="bg-white rounded-xl p-6 w-11/12 max-w-md">
      <h3 class="text-lg font-semibold mb-3">Confirmar eliminación</h3>
      <p class="text-sm text-gray-700 mb-4">¿Estás seguro que querés eliminar este post? Esta acción no se puede
        deshacer.
      </p>

      <div class="flex justify-end gap-3">
        <button class="px-4 py-2 rounded-xl bg-gray-200" @click="cancelDelete" :disabled="deleting">Cancelar</button>
        <button class="px-4 py-2 rounded-xl bg-red-600 text-white" @click="deletePost" :disabled="deleting">
          {{ deleting ? "Eliminando..." : "Eliminar" }}
        </button>
      </div>
    </div>
  </div>
</template>
