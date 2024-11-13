<template>
    <q-page class="flex flex-center login-page">
      <q-card class="login-card" style="width: 100%; max-width: 450px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);">
        <q-card-section class="q-pt-none text-center">
          <div class="text-h5 text-primary">Iniciar sesión</div>
        </q-card-section>
  
        <q-form @submit="login" class="q-gutter-md">
          <q-input
            v-model="username"
            label="Usuario"
            outlined
            :rules="['required']"
            autofocus
            class="q-mb-md"
            dense
          />
  
          <q-input
            v-model="identification"
            label="Identificación"
            outlined
            :rules="['required']"
            class="q-mb-md"
            dense
          />
  
          <q-input
            v-model="password"
            :type="passwordVisible ? 'text' : 'password'"
            label="Contraseña"
            outlined
            :rules="['required']"
            class="q-mb-md"
            dense
          >
            <template v-slot:append>
              <q-btn
                flat
                round
                :icon="passwordVisible ? 'visibility_off' : 'visibility'"
                @click="togglePasswordVisibility"
                class="cursor-pointer"
              />
            </template>
          </q-input>
  
          <q-input
            v-model="email"
            label="Correo Electrónico"
            outlined
            :rules="['required']"
            class="q-mb-md"
            dense
          />
  
          <q-btn
            label="Iniciar sesión"
            color="primary"
            type="submit"
            class="full-width q-mb-md"
            :loading="isLoading"
            size="lg"
            round
            :disable="isLoading"
          />
        </q-form>
      </q-card>
    </q-page>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { Notify } from 'quasar';
  import { useRouter } from 'vue-router';
  
  const username = ref('');
  const password = ref('');
  const email = ref('');
  const identification = ref('');
  const isLoading = ref(false);
  
  const passwordVisible = ref(false);
  
  const isAuthenticated = ref(localStorage.getItem('isAuthenticated') === 'true');
  
  const router = useRouter();
  
  const usernameLengthRule = (val) => val && val.length >= 5;
  const passwordLengthRule = (val) => val && val.length >= 7;
  const emailRule = (val) => /^[a-zA-Z0-9._-]+@[a-zA0-9.-]+\.[a-zA-Z]{2,4}$/.test(val);
  const identificationRule = (val) => val && val.length >= 10 && /^\d+$/.test(val);
  
  async function login() {
    isLoading.value = true;
  
    let valid = true;
    let missingFields = [];
    let invalidFields = [];
  
    if (!username.value) {
      missingFields.push('Usuario');
      valid = false;
    } else if (!usernameLengthRule(username.value)) {
      invalidFields.push('Usuario debe tener al menos 5 caracteres');
      valid = false;
    }
  
    if (!identification.value) {
      missingFields.push('Identificación');
      valid = false;
    } else if (!identificationRule(identification.value)) {
      invalidFields.push('Identificación debe ser numérica y tener al menos 10 caracteres');
      valid = false;
    }
  
    if (!password.value) {
      missingFields.push('Contraseña');
      valid = false;
    } else if (!passwordLengthRule(password.value)) {
      invalidFields.push('Contraseña debe tener al menos 7 caracteres');
      valid = false;
    }
  
    if (!email.value) {
      missingFields.push('Correo electrónico');
      valid = false;
    } else if (!emailRule(email.value)) {
      invalidFields.push('Correo electrónico no es válido');
      valid = false;
    }
  
    if (missingFields.length > 0) {
      const missingMessage = `Por favor complete los siguientes campos: ${missingFields.join(', ')}`;
      Notify.create({
        message: missingMessage,
        color: 'negative',
        position: 'top',
      });
    }
  
    if (invalidFields.length > 0) {
      invalidFields.forEach((errorMessage) => {
        Notify.create({
          message: errorMessage,
          color: 'negative',
          position: 'top',
        });
      });
    }
  
    if (valid) {
      Notify.create({
        message: '¡Inicio de sesión exitoso!',
        color: 'green',
        position: 'top',
      });
  
      localStorage.setItem('isAuthenticated', 'true');
      isAuthenticated.value = true;
  
      localStorage.setItem('username', username.value);
  
      router.push({ name: 'articulos' });
    }
  
    isLoading.value = false;
  }
  
  function togglePasswordVisibility() {
    passwordVisible.value = !passwordVisible.value;
  }
  
  onMounted(() => {
    isAuthenticated.value = localStorage.getItem('isAuthenticated') === 'true';
  });
  </script>
  
  <style scoped>
  .login-page {
    background-color: #f4f6f9;
    position: relative;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .login-card {
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    border-radius: 15px;
  }
  
  .q-form {
    padding: 20px;
  }
  
  .q-btn {
    font-weight: bold;
  }
  
  .text-negative {
    color: #e53935;
  }
  
  .q-input,
  .q-btn {
    border-radius: 10px;
  }
  
  .cursor-pointer {
    cursor: pointer;
  }
  </style>
  