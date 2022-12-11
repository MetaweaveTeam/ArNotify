<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useMainStore } from "@/stores/store";
import { inject, ref } from "vue";
import type { Router } from "vue-router";
import Loading from "@/components/Loading.vue";
import Index from "./views/Login.vue";
import Modal from "@/components/Modal.vue";
import DashboardView from "./views/Dashboard/Index.vue";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

let api = import.meta.env.VITE_BACKEND_URL;
const axios: any = inject("axios");
const router: Router = inject("router")!;
const store = useMainStore();

let denied = async () => {
  let query = router.currentRoute.value.query;
  if (query.denied) {
    store.setError("User denied authorization to twitter");
    const txid = router.currentRoute.value.params.txid;
    if (txid) {
      router.push(`/${txid}/error`);
    } else {
      router.push("/error");
    }
  }
};

let loginStep3 = async () => {
  let query = router.currentRoute.value.query;
  // we check if we have oauth_token && oauth_verifier
  if (query.oauth_token && query.oauth_verifier && !store.userInfo) {
    try {
      let res = await axios.post(
        `${api}/twitter/oauth/access_token?oauth_token=${query.oauth_token}&oauth_verifier=${query.oauth_verifier}`
      );
      let data = res.data;
      localStorage.setItem("expiry", data.expiry);
      var newURL =
        window.location.protocol +
        "//" +
        window.location.host +
        window.location.pathname;
      window.history.pushState({ path: newURL }, "", newURL);
      store.setLoggedIn(true);
      store.setUserInfo(data);
      await refreshUser();
      store.setIsLoading(false);
    } catch (e: any) {
      console.log(e);
      store.setError(e);
      const txid = router.currentRoute.value.params.txid;
      if (txid) {
        router.push(`/${txid}/error`);
      } else {
        router.push("/error");
      }
      store.setIsLoading(false);
    }
  }
};

let refreshUser = async () => {
  try {
    let res = await axios.get(`${api}/twitter/users/me`);
    store.setUserInfo(res.data);

    let subs = await axios.get(`${api}/subscriptions`);
    store.setSubscriptions(subs.data.subscriptions);
  } catch (e: any) {
    store.setError(e);
    const txid = router.currentRoute.value.params.txid;
    if (txid) {
      router.push(`/${txid}/error`);
    } else {
      router.push("/error");
    }
    console.log(e);
  }
};

onMounted(async () => {
  let query = router.currentRoute.value.query;
  if (store.logged_in && !store.userInfo && !query.oauth_verifier) {
    store.setIsLoading(true);
    await refreshUser();
    store.setIsLoading(false);
  } else if (store.logged_in && store.userInfo) {
    store.setIsLoading(false);
  }

  if (!store.logged_in && !query.oauth_verifier) {
    store.setIsLoading(false);
  }

  await loginStep3();

  await denied();
});
</script>

<template>
  <Modal />
    <Header />
    <div v-if="store.isLoading"><Loading /></div>
    <div v-else-if="store.logged_in && store.userInfo"><DashboardView /></div>
    <div v-else class="w-full"><Index /></div>
    <Footer />
</template>
