<template>
  <article class="product-card glass-card">
    <div class="card-media">
      <img :src="product.image" :alt="product.title" class="product-image" loading="lazy" />
      <button class="fav-btn" @click="$emit('toggle-fav', product._id)" :aria-pressed="fav.toString()">
        <!-- icono simple -->
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 8.6a5.5 5.5 0 0 0-7.8 0L12 9.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-3.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
      </button>
    </div>

    <div class="card-body">
      <div class="card-top">
        <h3 class="product-title">{{ product.title }}</h3>
        <span v-if="product.badge" class="badge">{{ product.badge }}</span>
      </div>

      <p class="product-brand">{{ product.brand }}</p>

      <div class="card-footer">
        <div class="price" v-if="product.price">${{ formatPrice(product.price) }}</div>
        <button class="btn-add" @click="$emit('add-to-cart', product._id)">Agregar</button>
      </div>
    </div>
  </article>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps({
  product: { type: Object, required: true }
})
const emit = defineEmits(['toggle-fav','add-to-cart'])

const fav = ref(false)
function formatPrice(p) {
  if (p == null) return ''
  return (p).toLocaleString('es-AR')
}
</script>

<style scoped>
.glass-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  border-radius: 14px;
  background: rgba(255,255,255,0.55);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 1px solid rgba(255,255,255,0.6);
  box-shadow: 0 6px 18px rgba(0,0,0,0.06);
  width: 100%;
  min-height: 220px;
}

.card-media { position: relative; display:flex; justify-content:center; align-items:center; }
.product-image { width: 72px; height: 96px; object-fit: contain; display:block; margin: 0 auto; }

.fav-btn {
  position: absolute;
  right: 6px;
  top: 6px;
  background: rgba(255,255,255,0.6);
  border: none;
  padding: 6px;
  border-radius: 999px;
  cursor:pointer;
}

.card-body { display:flex; flex-direction:column; gap:8px; padding-top:4px; }

.card-top { display:flex; justify-content:space-between; align-items:center; gap:8px; }
.product-title { font-size: 14px; font-weight:600; margin:0; color:#222; }
.badge { background:#f3f4f6; color:#333; padding:4px 8px; border-radius:999px; font-size:11px; }

.product-brand { font-size:12px; color:#666; margin:0; }

.card-footer { display:flex; justify-content:space-between; align-items:center; gap:8px; margin-top:auto; }
.price { font-weight:700; color:#111; font-size:14px; }
.btn-add {
  background: #0ea5a1;
  color: white;
  border: none;
  padding: 8px 10px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 13px;
}
</style>
