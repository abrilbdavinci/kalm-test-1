<script>
export default {
  name: 'Footer'
}
</script>

<template>
  <footer
    class="text-white w-full flex-col items-stretch py-10 px-20"
    :style="{
      backgroundColor: '#306067',
      borderTopLeftRadius: '60px',
      borderTopRightRadius: '60px'
    }"
  >
  <div class="flex justify-between">
    <div class="flex text-left">
        <ul class="me-15">
          <li><RouterLink to="/">Inicio</RouterLink></li>
          <li><RouterLink to="/tests">Tests</RouterLink></li>
          <li><RouterLink to="/planes">Planes</RouterLink></li>
          <li><RouterLink to="/about">Sobre Kälm</RouterLink></li>
          <li><RouterLink to="/contacto">Contacto</RouterLink></li>
        </ul>
        <ul>
          <li><RouterLink to="/">Equipo Kälm</RouterLink></li>
          <li><RouterLink to="/">Empleos</RouterLink></li>
          <li><RouterLink to="/">Blog</RouterLink></li>
        </ul>
      </div>
      <img 
            src="./../assets/img/logo-kalm-light.svg" 
            alt="Imagen decorativa" 
            class="h-30 object-contain">
  </div>
  <p class="text-center mt-10">Copyright &copy; 2025 - Kälm. Todos los derechos reservados. Buenos Aires, Argentina.</p>
    <slot />
  </footer>
</template>
