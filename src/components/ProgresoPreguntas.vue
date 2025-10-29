<template>
  <div class="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
    <div
      class="h-4 bg-[#37A0AF] transition-all duration-300"
      :style="{ width: porcentaje + '%' }"
    ></div>
  </div>
</template>

<script>
export default {
  name: "ProgresoPreguntas",
  props: {
    total: {
      type: Number,
      required: true
    },
    actual: {
      type: Number,
      required: true
    }
  },
  computed: {
    porcentaje() {
      if (this.total === 0) return 0;
      return ((this.actual + 1) / this.total) * 100;
    }
  }
};
</script>
