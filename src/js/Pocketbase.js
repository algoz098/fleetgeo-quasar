import PocketBase from "pocketbase";
import { ref, computed } from "vue";

let url = "https://fleetgeoapi.arcode.online";
try {
  if (
    import.meta.env.VITE_POCKETBASE_URL &&
    import.meta.env.VITE_POCKETBASE_URL !== "undefined"
  ) {
    url = import.meta.env.VITE_POCKETBASE_URL;
  }
  // eslint-disable-next-line no-empty
} catch (error) {}

console.log(9999, url);

export const pb = new PocketBase(url);

export const authStore = ref(pb.authStore.model);
export const token = ref(pb.authStore.token);
export const authed = ref(pb.authStore.isValid);

pb.authStore.onChange((recvToken, recvModel) => {
  authStore.value = recvModel;
  token.value = recvToken;
  authed.value = true;
});

export async function clear() {
  await pb.authStore.clear();

  authStore.value = null;
  token.value = null;
  authed.value = false;
}
