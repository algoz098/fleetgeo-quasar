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

          <q-item
            v-for="item in data.items"
            :key="item.id"
            @click="follow !== item.id ? (follow = item.id) : (follow = null)"
            clickable
          >
            <q-item-section side>
              <q-icon name="radio_button_unchecked" v-if="follow !== item.id" />

              <q-icon name="radio_button_checked" v-else />
            </q-item-section>

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

    <q-page-container style="height: calc(100vh - 50px)">
      <a-map :users="data.items" v-if="data?.items" :follow="follow" />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import { pb } from "../js/Pocketbase";

import AMap from "./AMap.vue";

const data = ref();
const follow = ref();
const page = ref(1);
const perPage = ref(10);
const loading = ref(false);

function executeSub(e) {
  if (loading.value === true) return;
  if (e.action !== "update") return;
  const { record } = e;
  const index = data.value.items.findIndex((e) => e.id === record.id);
  console.log(`Updating ${record.username}`);
  data.value.items[index] = record;
}

function subscribe(id) {
  pb.collection("users").subscribe(id, executeSub);
}

function unsubscribe(id) {
  pb.collection("users").unsubscribe(id);
}

function unsubAll(unsubAll) {
  if (!data.value?.items?.length) return;

  for (let index = 0; index < data.value.items.length; index++) {
    const item = data.value.items[index];
    unsubscribe(item.id);
  }
}

function subAll(unsubAll) {
  if (!data.value?.items?.length) return;

  for (let index = 0; index < data.value.items.length; index++) {
    const item = data.value.items[index];
    subscribe(item.id);
  }
}

async function load() {
  loading.value = true;

  unsubAll();

  try {
    data.value = await pb
      .collection("users")
      .getList(page.value, perPage.value);

    subAll();
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
