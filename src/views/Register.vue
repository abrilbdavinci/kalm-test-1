<template>
  <section class="w-3xl">
    <MainTitle>Crear cuenta</MainTitle>
    <div class="w-full h-130 mx-auto mt-5 p-10 bg-white/40 backdrop-blur-lg rounded-xl shadow-lg">

      <form @submit.prevent="register" class="flex flex-col gap-3 my-10">
        <label class="text-start">Nombre</label>
        <input v-model="name" type="text" class="p-2 rounded-full border" required />

        <label class="text-start">Email</label>
        <input v-model="email" type="email" class="p-2 rounded-full border" required />

        <label class="text-start">Contraseña</label>
        <input v-model="password" type="password" class="p-2 rounded-full border" required />

        <BtnLight type="submit" class="mt-4 w-70 mx-auto">Crear</BtnLight>

        <p v-if="error" class="text-red-600 mt-2">{{ error }}</p>
        <p v-if="success" class="text-green-600 mt-2">{{ success }}</p>
      </form>

      <p class="mt-4 text-sm text-gray-700">
        ¿Ya tienes cuenta?
        <RouterLink to="/login" class="text-[#37A0AF] font-bold">Ingresar</RouterLink>
      </p>
    </div>
  </section>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import MainTitle from '../components/MainTitle.vue';
import BtnLight from '../components/BtnLight.vue';

export default {
  name: 'Register',
  components: { MainTitle, BtnLight },
  setup() {
    const name = ref('');
    const email = ref('');
    const password = ref('');
    const error = ref('');
    const success = ref('');
    const router = useRouter();

    const register = async () => {
      error.value = '';
      success.value = '';

      try {
        const res = await fetch('http://localhost:3000/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: name.value, email: email.value, password: password.value })
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Error al registrarse');

        success.value = 'Usuario creado correctamente. Puedes iniciar sesión.';
        name.value = '';
        email.value = '';
        password.value = '';
      } catch (err) {
        error.value = err.message;
      }
    };

    return { name, email, password, error, success, register };
  }
};
</script>
