<template>
  <div>
    <div class="header-container q-mb-md q-pa-none">
      <div class="text-h6">Usuario: {{ username }}</div>
      <q-btn label="Cerrar sesión" color="negative" @click="confirmLogout" round class="logout-btn" />
      <q-btn label="Agregar Artículo" color="primary" @click="goToAgregar" round class="add-btn" />
    </div>

    <q-table :rows="rows" :columns="columns" row-key="id" :loading="loading">
      <template v-slot:body-cell="props">
        <q-td :props="props">
          <template v-if="Array.isArray(props.row[props.col.field])">
            {{ props.row[props.col.field].join(', ') }}
          </template>
          <template v-else>
            {{ props.row[props.col.field] }}
          </template>
        </q-td>
        <q-td :props="props">
          <q-btn label="Editar" color="primary" @click="goToEditar(props.row)" />
          <q-btn 
            label="Cambiar Estado" 
            :color="props.row.estado === 'activo' ? 'green' : 'red'" 
            @click="toggleEstado(props.row)"
          />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="logoutDialogVisible">
      <q-card>
        <q-card-section>
          <div class="text-h6">¿Estás seguro de que quieres cerrar sesión?</div>
        </q-card-section>
        <q-card-actions>
          <q-btn flat label="Cancelar" color="primary" @click="logoutDialogVisible = false" />
          <q-btn flat label="Confirmar" color="negative" @click="logout" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { getData } from '../services/apiClient.js';
import { useRouter } from 'vue-router';

let rows = ref([]);
let columns = ref([
  { name: 'id', label: 'ID', align: 'center', field: 'id' },
  { name: 'nombre', label: 'Nombre', align: 'left', field: 'nombre' },
  { name: 'descripcion', label: 'Descripción', align: 'left', field: 'descripcion' },
  { name: 'precio', label: 'Precio', align: 'right', field: 'precio' },
  { name: 'tags', label: 'Etiquetas', align: 'left', field: 'tags' },
  { name: 'estado', label: 'Estado', align: 'center', field: 'estado' },
]);

let loading = ref(true);
let username = ref('');

const router = useRouter();
const logoutDialogVisible = ref(false);

onBeforeMount(() => {
  const storedUsername = localStorage.getItem('username');
  if (storedUsername) {
    username.value = storedUsername;
  }
  listarArticulos();
});

async function listarArticulos() {
  try {
    let res = await getData('/articulos');
    if (res && res.data) {
      rows.value = res.data.map(item => ({ ...item, estado: item.estado || 'activo' }));
    } else {
      rows.value = [];
    }
  } catch (error) {
    console.error('Error al obtener los artículos:', error);
    rows.value = [];
  } finally {
    loading.value = false;
  }
}

function confirmLogout() {
  logoutDialogVisible.value = true;
}

function logout() {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('username');
  logoutDialogVisible.value = false;
  router.push('/login');
}

function goToAgregar() {
  router.push({ name: 'agregar' });
}

function goToEditar(item) {
  router.push({ name: 'editar', query: { id: item.id } });
}

function toggleEstado(item) {
  item.estado = item.estado === 'activo' ? 'inactivo' : 'activo';
}
</script>

<style scoped>
.q-table {
  margin: 20px;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #f4f6f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.logout-btn {
  font-weight: bold;
  padding: 8px 16px;
  background-color: #d32f2f;
  color: white;
  border-radius: 20px;
  transition: background-color 0.3s ease-in-out;
}

.logout-btn:hover {
  background-color: #b71c1c;
}

.add-btn {
  font-weight: bold;
  padding: 8px 16px;
  background-color: #388e3c;
  color: white;
  border-radius: 20px;
  transition: background-color 0.3s ease-in-out;
}

.add-btn:hover {
  background-color: #2c6c2f;
}

.text-h6 {
  font-weight: 600;
  color: #333;
}
</style>
