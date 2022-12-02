import { createRouter, createWebHistory } from "vue-router";
import IndexView from "@/views/IndexView.vue";
import ErrorView from "@/views/ErrorView.vue";

const routes = () => {
  if (process.env.NODE_ENV === "development") {
    return [
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
    ];
  } else {
    return [
      {
        path: "/:txid?",
        name: "home",
        component: IndexView,
      },
      {
        path: "/:txid/error",
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
