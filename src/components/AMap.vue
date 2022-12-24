<template>
  <l-map
    ref="map"
    v-model:zoom="zoom"
    :center="center"
    :min-zoom="3"
    :max-zoom="18"
    @ready="mapReady"
  >
    <l-tile-layer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      layer-type="base"
      name="OpenStreetMap"
    />

    <l-feature-group ref="me">
      <l-marker
        :lat-lng="[coords.latitude, coords.longitude]"
        v-if="permission"
      >
        <l-icon icon-url="icons/storeBg.png" :icon-size="[25, 25]" />
      </l-marker>
    </l-feature-group>

    <l-feature-group ref="fleet">
      <l-marker
        :lat-lng="[item.latitude, item.longitude]"
        v-for="item in usersWithCoords"
        :key="item.id"
      >
        <l-tooltip> {{ item.username }} </l-tooltip>
      </l-marker>
    </l-feature-group>
  </l-map>
</template>

<script setup>
import "leaflet";
import "leaflet/dist/leaflet.css";
import {
  LMap,
  LTileLayer,
  LMarker,
  LIcon,
  LTooltip,
  LFeatureGroup,
} from "@vue-leaflet/vue-leaflet";
import { ref, defineProps, computed, watch, onMounted } from "vue";

import { coords, permission } from "boot/geo";

const props = defineProps({
  users: Array,
  follow: String,
});

const map = ref();
const fleet = ref();
const me = ref();
const moving = ref(false);
const zoom = ref(15);

const usersWithCoords = computed(() => {
  return props.users.filter((e) => e.latitude && e.longitude);
});

const center = computed(() => {
  if (permission.value) {
    return [coords.value.latitude, coords.value.longitude];
  }

  return [0, 0];
});

function keepFollow() {
  // if (moving.value) return;
  if (!map.value.leafletObject.fitBounds) return;

  moving.value = true;

  if (props.follow) {
    console.log("SEGUINDO");

    const index = props.users.findIndex(
      (e) => e.id === props.follow && e.latitude && e.longitude
    );
    if (index < 0) return;

    const target = props.users[index];
    map.value.leafletObject.fitBounds([
      [target.latitude, target.longitude],
      [target.latitude, target.longitude],
    ]);

    return;
  }

  console.log("Mostrando todos");

  if (
    !fleet?.value?.leafletObject?.getBounds ||
    !map?.value?.leafletObject?.getBounds
  )
    return;

  let bounds = fleet.value.leafletObject.getBounds();
  if (permission.value && me.value?.leafletObject?.getBounds) {
    bounds = bounds.extend(me.value.leafletObject.getBounds());
  }

  map.value.leafletObject.fitBounds(bounds);
}

watch(usersWithCoords, () => {
  keepFollow();
});

function mapReady() {
  map.value.leafletObject.on("moveend", function () {
    console.log("moveend");
    moving.value = false;
  });
}
</script>
