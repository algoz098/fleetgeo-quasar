const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "d",
        name: "dashboard",
        component: () => import("pages/IndexPage.vue"),
      },
      {
        path: "",
        name: "login",
        component: () => import("pages/LoginPage.vue"),
      },
      {
        path: "privacidade",
        name: "privacy",
        component: () => import("pages/PrivacyPage.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
