import { createRouter, createWebHistory } from "vue-router";
import IndexView from "@/views/IndexView.vue";
import ErrorView from "@/views/ErrorView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: IndexView,
    },
    {
      path: "/error",
      name: "error",
      component: ErrorView,
    },
  ],
});

export default router;
