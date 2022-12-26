<template>
  <router-view />
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { authed } from "./js/Pocketbase";

const router = useRouter();
const route = useRoute();

if (!authed.value && route.fullPath.includes("/d"))
  router.replace({ name: "login" });
</script>
