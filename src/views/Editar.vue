<template>
  <q-page>
    <q-card class="q-ma-md">
      <q-card-section>
        <div class="text-h5">Editar Artículo</div>
      </q-card-section>

      <q-form ref="form" @submit="editarArticulo">
        <!-- Campos de formulario para editar -->
        <q-input v-model="nombre" label="Nombre" outlined required class="q-mb-md" />
        <q-input v-model="descripcion" label="Descripción" outlined required class="q-mb-md" />
        <q-input v-model="precio" label="Precio" type="number" outlined required class="q-mb-md" :rules="[val => val > 0 || 'El precio debe ser mayor a 0']" />
        <q-input v-model="tags" label="Etiquetas" outlined class="q-mb-md" />

        <!-- Botón de editar -->
        <q-btn label="Editar Artículo" color="primary" type="submit" class="full-width q-mb-md" :loading="isLoading" />
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onBeforeMount, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getData, putData } from '../services/apiClient.js';

// Definir los estados reactivos
const nombre = ref('');
const descripcion = ref('');
const precio = ref('');
const tags = ref('');
const isLoading = ref(false);

// Referencia al formulario
const form = ref(null);

const router = useRouter();
const route = useRoute();

// Obtener el id del artículo desde los parámetros de la URL
const articuloId = route.query.id;

onBeforeMount(async () => {
  if (articuloId) {
    try {
      // Obtener los datos del artículo desde la API
      const response = await getData(`/articulos/${articuloId}`);
      const articulo = response.data;
      // Rellenar los campos con los datos del artículo
      nombre.value = articulo.nombre;
      descripcion.value = articulo.descripcion;
      precio.value = articulo.precio;
      tags.value = articulo.tags.join(', '); // Suponiendo que los tags son un arreglo
    } catch (error) {
      console.error('Error al cargar el artículo:', error);
    }
  }
});

// Función para editar el artículo
async function editarArticulo() {
  // Validar el formulario
  if (!form.value.validate()) {
    return;
  }

  isLoading.value = true;

  const articuloEditado = {
    nombre: nombre.value,
    descripcion: descripcion.value,
    precio: precio.value,
    tags: tags.value.split(',').map(tag => tag.trim()), // Convertir las etiquetas a un arreglo
  };

  try {
    // Enviar los datos editados al servidor
    const response = await putData(`/articulos/${articuloId}`, articuloEditado);
    if (response) {
      // Esperar la actualización de la vista y luego redirigir
      nextTick(() => {
        router.push({ name: 'articulos' }); // Redirigir a la lista de artículos
      });
    }
  } catch (error) {
    console.error('Error al editar el artículo:', error);
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
