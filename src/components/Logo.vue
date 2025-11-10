<template>
    <picture class="logo">
        <!-- Imagen para pantallas grandes -->
        <source srcset="/src/assets/img/logo-kalm.svg" media="(min-width: 1024px)" />

        <!-- Imagen para tablets -->
        <source srcset="/src/assets/img/logo-kalm.svg" media="(min-width: 640px)" />

        <!-- Imagen para pantallas pequeñas (móviles) -->
        <source srcset="/src/assets/img/logo-kalm.svg" media="(max-width: 639px)" />

        <!-- Imagen fallback (si no aplica ningún media) -->
        <img src="/src/assets/img/logo-kalm.svg" alt="Logo de la marca" class="logo-img" loading="lazy" />
    </picture>
</template>

<script setup>
// No es necesario JavaScript aquí, salvo que quieras props dinámicas
</script>

<style scoped>
.logo {
    display: inline-block;
}

.logo-img {
    width: 100%;
    max-width: 90px;
    /* Ajusta según tu diseño */
    height: auto;
    object-fit: contain;
}
</style>
