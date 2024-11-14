<template>
  <q-page>
    <q-card class="q-ma-md">
      <q-card-section>
        <div class="text-h5">Agregar Artículo</div>
      </q-card-section>

      <q-form @submit="agregarArticulo" ref="form">
        <q-input v-model="nombre" label="Nombre" outlined required class="q-mb-md" />
        <q-input v-model="descripcion" label="Descripción" outlined required class="q-mb-md" />
        <q-input v-model="precio" label="Precio" type="number" outlined required class="q-mb-md" :rules="[val => val > 0 || 'El precio debe ser mayor a 0']" />
        <q-input v-model="tags" label="Etiquetas" outlined class="q-mb-md" />

        <q-btn label="Agregar Artículo" color="primary" type="submit" class="full-width q-mb-md" :loading="isLoading" />
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { postData } from '../services/apiClient.js';

let nombre = ref('');
let descripcion = ref('');
let precio = ref('');
let tags = ref('');
let isLoading = ref(false);

const router = useRouter();

async function agregarArticulo() {
  const form = $refs.form;

  // Validar formulario
  if (!form.validate()) {
    return;
  }

  isLoading.value = true;

  const nuevoArticulo = {
    nombre: nombre.value,
    descripcion: descripcion.value,
    precio: precio.value,
    tags: tags.value.split(',').map(tag => tag.trim()),
  };

  try {
    const response = await postData('/articulos', nuevoArticulo);
    if (response) {
      router.push({ name: 'articulos' }); // Redirige a la vista Artículos
    }
  } catch (error) {
    console.error('Error al agregar artículo:', error);
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
.q-card {
  max-width: 500px;
  margin: auto;
}

.q-form {
  padding: 20px;
}
</style>
