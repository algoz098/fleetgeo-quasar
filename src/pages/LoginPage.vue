<template>
  <q-page class="flex flex-center">
    <q-card class="my-card">
      <q-card-section>
        <div class="text-h6">ArCode FleetGeo</div>
        <div class="text-subtitle2">Acesso</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="submit">
          <div class="row">
            <div class="col-12 q-pb-md">
              <q-input v-model="email" :disable="loading" label="E-mail" />
            </div>

            <div class="col-12 q-pb-md">
              <q-input
                v-model="password"
                type="password"
                :disable="loading"
                label="Senha"
              />
            </div>

            <div class="col-12">
              <q-btn
                label="Acessar"
                :loading="loading"
                type="submit"
                color="primary"
              />
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { pb, authed } from "../js/Pocketbase";
import { Notify } from "quasar";

const router = useRouter();

if (authed.value) router.replace({ name: "dashboard" });

const loading = ref(false);
const email = ref("");
const password = ref("");

async function submit() {
  loading.value = true;

  try {
    await pb.admins.authWithPassword(email.value, password.value);
    router.replace({ name: "dashboard" });
  } catch (error) {
    console.error(error);
    Notify.create(
      "Não foi possivel acessar, verifique os dados e tente novamente"
    );
  }

  loading.value = false;
}
</script>
