<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>Gestión de Actividades</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>


      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isAuthenticated = ref(false);
const currentTab = ref('actividades');

onBeforeMount(() => {
  isAuthenticated.value = localStorage.getItem('isAuthenticated') === 'true';
  if (!isAuthenticated.value) {
    router.push('/login');
  }
});

function logout() {
  localStorage.removeItem('isAuthenticated');
  isAuthenticated.value = false;
  router.push('/login');
}

function navigateTo(tab) {
  if (tab === 'actividades') {
    router.push('/articulos');
  } else if (tab === 'agregar') {
    router.push('/agregar');
  }
}
</script>

<style scoped>
.q-layout {
  background-color: rgb(45, 101, 255);
}
</style>
