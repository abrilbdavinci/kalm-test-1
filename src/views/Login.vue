<template>
  <section class="w-3xl">
    <MainTitle>Iniciar sesión</MainTitle>
    <div class="w-full h-120 mx-auto mt-5 p-10 bg-white/40 backdrop-blur-lg rounded-xl shadow-lg">
      <form @submit.prevent="login" class="flex flex-col gap-3 my-10">
        <label class="text-start">Email</label>
        <input v-model="email" type="email" class="p-2 rounded-full border" required />

        <label class="text-start">Contraseña</label>
        <input v-model="password" type="password" class="p-2 rounded-full border" required />
        <RouterLink to="/pswrd-restore" class="text-[#37A0AF] text-start font-bold">Olvidé la contraseña</RouterLink>

        <BtnLight type="submit" class="mt-4 w-70 mx-auto">Ingresar</BtnLight>

        <p v-if="error" class="text-red-600 mt-2">{{ error }}</p>
      </form>

      <p class="mt-4 text-sm text-gray-700">
        ¿No tiene cuenta?
        <RouterLink to="/register" class="text-[#37A0AF] font-bold">Registrarse</RouterLink>
      </p>
    </div>
  </section>
</template>

<script>
import { ref } from 'vue';
import { currentUser } from '../main';
import { useRouter } from 'vue-router';
import MainTitle from '../components/MainTitle.vue';
import BtnLight from '../components/BtnLight.vue';

export default {
  name: 'Login',
  components: { MainTitle, BtnLight },
  setup() {
    const email = ref('');
    const password = ref('');
    const error = ref('');
    const router = useRouter();

    const login = async () => {
      error.value = '';
      try {
        const res = await fetch('http://localhost:3000/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.value, password: password.value })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Error al iniciar sesión');

        // Guardar token y usuario en localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Actualizar ref reactivo global
        currentUser.value = data.user;

        router.push('/tests'); // Redirigir a tests
      } catch (err) {
        error.value = err.message;
      }
    };

    return { email, password, error, login };
  }
};
</script>
