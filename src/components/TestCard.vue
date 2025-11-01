<script>
import BtnDark from './BtnDark.vue'
import SubTitle from './SubTitle.vue';

export default {
    name: 'TestCard',
    components: {
        BtnDark,
        SubTitle
    },
}
</script>

<template>
    <div
        class="bg-white/40 backdrop-blur-lg rounded-xl shadow-lg p-6 flex flex-col justify-between h-full w-full max-w-xl">

        <!-- Header -->
        <h2 class="text-lg md:text-xl font-semibold mb-4 text-[#306067]">
            <slot name="header">Título del Test</slot>
        </h2>


        <!-- Contenido -->
        <SubTitle class="text-lg md:text-xl font-semibold mb-4 text-[#306067]">
            <slot name="content">Descripción del test</slot>
        </SubTitle>

        <!-- Botón -->
        <slot name="button">
            <BtnDark class="w-full py-2 font-bold">Comenzar</BtnDark>
        </slot>

    </div>
</template>
