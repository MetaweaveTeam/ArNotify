import { createRouter, createWebHistory } from "vue-router";
import Main from "@/views/Index.vue";
import ErrorView from "@/views/Error.vue";

const routes = () => {
  if (process.env.NODE_ENV === "development") {
    return [
      {
        path: "/",
        name: "home",
        component: Main,
      },
      {
        path: "/error",
        name: "error",
        component: ErrorView,
      },
    ];
  } else {
    return [
      {
        path: "/",
        name: "home",
        component: Main,
      },
      {
        path: "/error",
        name: "error",
        component: ErrorView,
      },
    ];
  }
};
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes(),
});

export default router;
