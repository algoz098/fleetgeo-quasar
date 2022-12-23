import PocketBase from "pocketbase";
import { ref, computed } from "vue";

export const pb = new PocketBase("http://192.168.31.223:8090");

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
