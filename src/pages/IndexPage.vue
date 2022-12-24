<template>
  <q-header>
    <q-toolbar v-if="authStore?.email">
      <q-toolbar-title>ArCode FleetGeo</q-toolbar-title>

      <q-btn
        icon="my_location"
        label="Permitir"
        flat
        outlined
        @click="askPermission"
        v-if="!permission"
      />

      {{ authStore.email }}

      <q-btn flat round dense icon="logout" @click="logout">
        <q-tooltip> Sair </q-tooltip>
      </q-btn>
    </q-toolbar>
  </q-header>

  <q-page class="flex flex-center" v-if="loading">
    <q-card>
      <q-card-section class="text-center">
        <q-spinner color="primary" size="3em" />
      </q-card-section>

      <q-card-section>
        <div class="text-h6">Carregando</div>
      </q-card-section>
    </q-card>
  </q-page>

  <q-page class="flex flex-center" v-else-if="error">
    <q-card>
      <q-card-section class="text-center">
        <q-icon name="error" color="red" size="3em" />
      </q-card-section>

      <q-card-section>
        <div class="text-h6">{{ error }}</div>
      </q-card-section>

      <q-card-section>
        <div class="text-h6">
          <q-btn color="primary" icon="refresh" @click="load" />
        </div>
      </q-card-section>
    </q-card>
  </q-page>

  <q-page class="" v-else>
    <users-map-plotter />
  </q-page>
</template>

<script setup async>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { pb, authed, authStore, clear } from "../js/Pocketbase";
import { askPermission, permission } from "boot/geo";
import UsersMapPlotter from "../components/UsersMapPlotter.vue";

const router = useRouter();
if (!authed.value) router.replace({ name: "login" });

const error = ref(null);
const data = ref();
const loading = ref(false);

async function load() {
  loading.value = true;
  if (!authed.value) return;
  try {
    data.value = await pb.admins.getOne(authStore.value.id);
    error.value = null;
  } catch (error) {
    console.error(error);
    error.value = "Erro inexperado, clique para recarregar.";
  }
  loading.value = false;
}

load();

async function logout() {
  await clear();
  router.replace({ name: "login" });
}
</script>
