<script setup lang="ts">
import { onMounted } from "vue";
import { useMainStore } from "@/stores/store";
import { inject } from "vue";
import type { Router } from "vue-router";

let api = import.meta.env.VITE_BACKEND_URL;
const axios: any = inject("axios");
const router: Router = inject("router")!;

const store = useMainStore();

let address = "";

let loginStep1 = async () => {
  try {
    let res = await axios.post(api + "/twitter/oauth/request_token");
    window.location.href = res.data.url;
  } catch (e) {
    console.log(e);
  }
};

let loginStep3 = async () => {
  let query = router.currentRoute.value.query;
  // we check if we have oauth_token && oauth_verifier
  if (query.oauth_token && query.oauth_verifier) {
    try {
      let res = await axios.post(
        `${api}/twitter/oauth/access_token?oauth_token=${query.oauth_token}&oauth_verifier=${query.oauth_verifier}`
      );
      let data = res.data;
      store.setLoggedIn(true);
      localStorage.setItem("expiry", data.expiry);
      store.setUserInfo(data);
      window.location.search = "";
    } catch (e) {
      console.log(e);
    }
  }
};

const logout = async () => {
  try {
    localStorage.clear();
    store.setLoggedIn(false);
    await axios({
      url: `${api}/logout`,
      method: "POST",
    });
  } catch (error) {
    console.error(error);
  }
};

let refreshUser = async () => {
  try {
    let res = await axios.get(`${api}/twitter/users/me`);
    store.setUserInfo(res.data);

    let subs = await axios.get(`${api}/subscriptions`);
    store.setSubscriptions(subs.data.subscriptions);
  } catch (e) {
    console.log(e);
  }
};

const subscribe = (address: string) => {
  (async () => {
    store.setSubscribePending(true);
    try {
      await axios({
        url: `${api}/twitter/subscribe`,
        method: "POST",
        data: { address: address, protocol: "argora" },
      });

      await refreshUser();
      store.setSubscribePending(false);
    } catch (error) {
      console.error(error);
      store.setSubscribePending(false);
    }
  })();
};

const unsubscribe = async (address: string) => {
  try {
    await axios({
      url: `${api}/twitter/unsubscribe`,
      method: "POST",
      data: { address: address, protocol: "argora" },
    });
    await refreshUser();
  } catch (error) {
    console.error(error);
  }
};

onMounted(async () => {
  await loginStep3();

  if (store.logged_in) {
    await refreshUser();
  }
});
</script>

<template>
  <div class="widget shadow-xl">
    <img src="../assets/logo.png" />
    <div>arNotify</div>
    <div>Subscribe to arweave protocols and notify your audience about it</div>
    <div>Select your notification medium</div>
    <button @click="
      () => {
        store.setLoggedIn(true);
      }
    ">
      Logged in: {{ store.logged_in ? "true" : "false" }}
    </button>
    <button className="btn gap-2" @click="loginStep1">
      <!-- <img 
        class="twitter_logo"
        src="../assets/twitter_logo.png"/> -->
      Sign in with Twitter
    </button>
    <button disabled="true" className="btn gap-2" @click="loginStep1">
      <!-- <img 
        class="twitter_logo"
        src="../assets/twitter_logo.png"/> -->
      Sign in with Instagram
    </button>

    <div>
      {{ store.userInfo && store.userInfo.main_id }}
      {{ store.userInfo && store.userInfo.main_handle }}
      {{ store.userInfo && store.userInfo.photo_url }}
      {{ store.userInfo && store.userInfo.expiry }}
    </div>
    <button className="btn gap-2" @click="refreshUser">REFRESH ME!</button>

    <input v-model="address" type="text" placeholder="Type here" className="input w-full max-w-xs" />
    <button className="btn gap-2" @click="() => subscribe(address)">
      Subscribe!
    </button>

    <button v-if="store.logged_in" className="btn gap-2" @click="logout">
      <!-- <img 
        class="twitter_logo"
        src="../assets/twitter_logo.png"/> -->
      Logout
    </button>

    Subscriptions:
    <li v-for="(item, index) in store.subscriptions">
      {{ index }}. {{ item }}

      <button className="btn gap-2" @click="() => unsubscribe(item.arweave_address as any)">
        UnSubscribe!
      </button>
    </li>
  </div>
</template>

<style scoped>
.widget {
  display: flex;
  border-radius: 2rem;
  padding: 1rem;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;

  background: rgb(188, 0, 255);
  background: -moz-linear-gradient(38deg,
      rgba(188, 0, 255, 1) 19%,
      rgba(248, 23, 181, 1) 100%);
  background: -webkit-linear-gradient(38deg,
      rgba(188, 0, 255, 1) 19%,
      rgba(248, 23, 181, 1) 100%);
  background: linear-gradient(38deg,
      rgba(188, 0, 255, 1) 19%,
      rgba(248, 23, 181, 1) 100%);
}

#twitter_logo {
  width: "50px";
  height: "50px";
}
</style>
