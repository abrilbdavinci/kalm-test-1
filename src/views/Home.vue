<template>
  <section class="max-w-6xl w-6xl flex flex-col items-center mx-auto p-4">
    <SearchBar class="w-full mb-6" />

    <!-- BANNER (carousel simple) -->
    <div class="w-full max-w-3xl h-64 sm:h-80 md:h-96 rounded-xl my-3 relative overflow-hidden">
      <template v-if="bannersLoading">
        <div class="w-full h-full bg-gray-100 animate-pulse rounded-xl"></div>
      </template>

      <template v-else>
        <a
          v-for="(b, i) in banners"
          :key="b._id"
          :href="b.link || '#'"
          class="banner-slide"
          :class="{ active: i === activeBanner }"
          @click.prevent="onBannerClick(b)"
        >
          <img :src="b.image" :alt="b.alt || 'banner'" class="w-full h-full object-cover" />
        </a>

        <!-- indicadores -->
        <div class="banner-indicators">
          <button v-for="(b, i) in banners" :key="b._id" class="dot" :class="{ 'dot-active': i===activeBanner }" @click="activeBanner = i"></button>
        </div>

        <!-- control auto next -->
      </template>
    </div>

    <!-- STORIES (circulos tipo Instagram) -->
    <div class="w-full mt-8">
      <div class="stories-row">
        <template v-if="storiesLoading">
          <div class="story-circle skeleton" v-for="n in 6" :key="n"></div>
        </template>
        <template v-else>
          <a v-for="s in stories" :key="s._id" :href="s.link||'#'" class="story-circle" @click.prevent="onStoryClick(s)">
            <img :src="s.image" :alt="s.title" class="story-img" />
          </a>
        </template>
      </div>
    </div>

    <!-- CAROUSEL HORIZONTAL (ej. banner secundario estético) -->
    <div class="w-full mt-6">
      <div class="rounded-xl bg-gray-50 h-40 flex items-center justify-center">
        <!-- placeholder o slider secundario -->
        <div class="text-gray-400">[Banner secundario]</div>
      </div>
    </div>

    <!-- TITULO Productos para vos -->
    <div class="w-full mt-6">
      <SubTitle class="text-lg text-start font-semibold mb-4">Productos para vos</SubTitle>

      <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <template v-if="productsLoading">
          <div v-for="n in 6" :key="n" class="w-full h-48 bg-gray-100 rounded-xl animate-pulse"></div>
        </template>

        <template v-else>
          <ProductCard
            v-for="p in products"
            :key="p._id"
            :product="p"
            @toggle-fav="toggleFav"
            @add-to-cart="addToCart"
          />
        </template>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import MainTitle from '../components/MainTitle.vue'
import SubTitle from '../components/SubTitle.vue'
import BtnMain from '../components/BtnMain.vue'
import ProductCard from '../components/ProductCard.vue' // asegúrate de la ruta
import SearchBar from '../components/SearchBar.vue'

const banners = ref([])
const stories = ref([])
const products = ref([])

const bannersLoading = ref(true)
const storiesLoading = ref(true)
const productsLoading = ref(true)

// carousel state
const activeBanner = ref(0)
let bannerTimer = null

// fetch helpers
async function fetchBanners() {
  bannersLoading.value = true
  try {
    const res = await fetch('/banners')
    if (!res.ok) throw new Error('Error fetching banners')
    banners.value = await res.json()
  } catch (e) {
    console.error(e)
    banners.value = []
  } finally {
    bannersLoading.value = false
  }
}

async function fetchStories() {
  storiesLoading.value = true
  try {
    const res = await fetch('/api/stories')
    if (!res.ok) throw new Error('Error fetching stories')
    stories.value = await res.json()
  } catch (e) {
    console.error(e)
    stories.value = []
  } finally {
    storiesLoading.value = false
  }
}

async function fetchProducts() {
  productsLoading.value = true
  try {
    const res = await fetch('/api/products/recommended')
    if (!res.ok) throw new Error('Error fetching products')
    products.value = await res.json()
  } catch (e) {
    console.error(e)
    products.value = []
  } finally {
    productsLoading.value = false
  }
}

// actions
function onBannerClick(b) {
  if (b.link) window.location.href = b.link // o use router if es ruta interna
}
function onStoryClick(s) {
  if (s.link) window.location.href = s.link
}
function toggleFav(productId) {
  // lógica para togglear favorito (llamar API)
  console.log('toggle fav', productId)
}
function addToCart(productId) {
  console.log('add to cart', productId)
}

// carousel autoplay
function startBannerAuto() {
  stopBannerAuto()
  bannerTimer = setInterval(() => {
    if (banners.value.length > 0) {
      activeBanner.value = (activeBanner.value + 1) % banners.value.length
    }
  }, 4500)
}
function stopBannerAuto() {
  if (bannerTimer) { clearInterval(bannerTimer); bannerTimer = null }
}

onMounted(async () => {
  await Promise.all([fetchBanners(), fetchStories(), fetchProducts()])
  startBannerAuto()
})

onBeforeUnmount(() => {
  stopBannerAuto()
})
</script>

<style scoped>
/* BANNER carousel */
.banner-slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transform: scale(1.02);
  transition: opacity .45s ease, transform .45s ease;
  pointer-events: none;
}
.banner-slide.active { opacity: 1; transform: scale(1); pointer-events: auto; }
.banner-slide img { width:100%; height:100%; object-fit: cover; display:block; }

/* indicadores */
.banner-indicators {
  position: absolute; left:50%; transform:translateX(-50%); bottom:10px; display:flex; gap:8px;
}
.dot { width:8px; height:8px; border-radius:999px; background: rgba(255,255,255,0.6); border:none; cursor:pointer; }
.dot-active { background: rgba(255,255,255,0.95); box-shadow: 0 2px 6px rgba(0,0,0,0.12); }

/* STORIES row */
.stories-row {
  display:flex;
  gap:12px;
  overflow-x:auto;
  padding: 10px 2px;
  -webkit-overflow-scrolling: touch;
}
.story-circle {
  width:64px; height:64px; min-width:64px; border-radius:999px; display:flex; align-items:center; justify-content:center;
  border: 4px solid rgba(255,255,255,0.9);
  background: linear-gradient(180deg, rgba(215,238,242,0.8), rgba(255,255,255,0.6));
  box-shadow: 0 6px 16px rgba(0,0,0,0.06);
  overflow:hidden;
}
.story-img { width:100%; height:100%; object-fit:cover; display:block; }

/* skeleton */
.skeleton { background: linear-gradient(90deg, #eee, #f7f7f7, #eee); border-radius:999px; min-width:64px; height:64px; }

/* Productos grid (usa ProductCard styles) */
.grid { display:grid; }

/* pequeños ajustes de layout */
h3 { margin: 0 0 8px 0; }

/* adapta la imagen inferior */
section img { border-radius: 12px; }

/* utilities para glass: si tenés clase global `glass` podés usarla; de lo contrario los cards usan su propio estilo */
</style>
