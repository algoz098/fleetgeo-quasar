import { ref } from "vue";

let id;
let options;
let permission = ref(false);
let coords = ref();

options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

function success(pos) {
  console.log(pos);
  const crd = pos.coords;
  coords.value = pos.coords;
  permission.value = true;
}

function error(err) {
  permission.value = false;
  console.error(`ERROR(${err.code}): ${err.message}`);
}

function askPermission() {
  id = navigator.geolocation.watchPosition(success, error, options);
  navigator.geolocation.getCurrentPosition(success, error);
}

export { coords, permission, askPermission };
