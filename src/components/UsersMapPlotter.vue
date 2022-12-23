<template>
  <q-layout
    view="lhh LpR lff"
    container
    style="height: calc(100vh - 50px)"
    class="shadow-2 rounded-borders"
  >
    <q-drawer :model-value="true" :width="300" bordered class="bg-grey-3">
      <q-page class="flex flex-center" v-if="loading">
        <div>
          <q-card-section class="text-center">
            <q-spinner color="primary" size="3em" />
          </q-card-section>

          <q-card-section>
            <div class="text-h6">Carregando</div>
          </q-card-section>
        </div>
      </q-page>
      <q-scroll-area class="fit" v-else>
        <q-list>
          <q-item-label header>Usuarios</q-item-label>

          <q-item v-for="item in data.items" :key="item.id">
            <q-item-section>
              <q-item-label>{{ item.username }}</q-item-label>
              <q-item-label caption lines="2">
                Lat: {{ item.latitude }}, Lng: {{ item.longitude }} as
                {{ item.geo_at }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item disabled>
            <q-item-section>
              <div class="flex justify-evenly items-center q-gutter-xs">
                <q-btn
                  flat
                  dense
                  icon="arrow_back"
                  @click="prevPage"
                  :disable="page < 2"
                />

                <div>{{ page }} / {{ data.totalPages }}</div>

                <q-btn
                  flat
                  dense
                  icon="arrow_forward"
                  @click="nextPage"
                  :disable="page >= data.totalPages"
                />
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <div class="col-8">
        <pre>{{ data }}</pre>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import { pb } from "../js/Pocketbase";

const data = ref();
const page = ref(1);
const perPage = ref(10);
const loading = ref(false);

async function load() {
  loading.value = true;
  try {
    data.value = await pb
      .collection("users")
      .getList(page.value, perPage.value);
  } catch (error) {
    console.error(error);
  }

  loading.value = false;
}

function nextPage() {
  page.value += 1;
  load();
}

function prevPage() {
  page.value -= 1;
  load();
}

load();
</script>
