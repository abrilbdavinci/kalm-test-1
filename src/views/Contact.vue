<script setup>
import MainTitle from '../components/MainTitle.vue';
import SubTitle from '../components/SubTitle.vue';
import BtnMain from '../components/BtnMain.vue';

import { ref } from 'vue';

const name = ref('');
const email = ref('');
const message = ref('');

const sendMessage = () => {
  if (!name.value || !email.value || !message.value) {
    alert('Por favor completa todos los campos');
    return;
  }

  alert(`Gracias, ${name.value}. Tu mensaje ha sido enviado.`);
  name.value = '';
  email.value = '';
  message.value = '';
};
</script>

<template>
  <div class="flex flex-col gap-6 w-full max-w-3xl mx-auto">
    <MainTitle>Contacto</MainTitle>
    <SubTitle>Escríbenos tus dudas o sugerencias, estaremos encantados de ayudarte.</SubTitle>

    <div class="flex flex-col gap-4 mt-6">
      <input
        v-model="name"
        type="text"
        placeholder="Nombre"
        class="p-3 border bg-white/40 backdrop-blur-lg rounded-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#37A0AF]"
      />
      <input
        v-model="email"
        type="email"
        placeholder="Correo electrónico"
        class="p-3 border bg-white/40 backdrop-blur-lg rounded-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#37A0AF]"
      />
      <textarea
        v-model="message"
        rows="5"
        placeholder="Mensaje"
        class="p-3 border bg-white/40 backdrop-blur-lg rounded-xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#37A0AF]"
      ></textarea>
    </div>

    <div class="mt-6 flex justify-center">
      <BtnMain @click="sendMessage">Enviar Mensaje</BtnMain>
    </div>
  </div>
</template>
