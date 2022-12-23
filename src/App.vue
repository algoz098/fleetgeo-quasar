<template>
  <router-view />
</template>

<script setup>
import { useRouter } from "vue-router";
import { authed } from "./js/Pocketbase";

const router = useRouter();

if (!authed.value) router.replace({ name: "login" });
</script>
