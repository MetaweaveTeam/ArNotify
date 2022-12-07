<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useMainStore } from "@/stores/store";
import { inject, ref } from "vue";
import type { Router } from "vue-router";
import { TC } from "../types";
import Loading from "./Loading.vue";
import InstagramIcon from "@/components/logos/InstagramIcon.vue";
import TwitterIcon from "@/components/logos/TwitterIcon.vue";

let api = import.meta.env.VITE_BACKEND_URL;
const axios: any = inject("axios");
const router: Router = inject("router")!;
const store = useMainStore();

let address = "";
let selected = "argora";
let windowWidth = ref(window.innerWidth);

let loginStep1 = async () => {
  try {
    store.setIsLoading(true);
    let res = await axios.post(api + "/twitter/oauth/request_token");
    window.location.href = res.data.url;
  } catch (e: any) {
    console.log(e);
    store.setError(`(${e.code}) ${e.message} \n\n More Details: \n${e}`);
    router.push("/error");
  }
};

let denied = async () => {
  let query = router.currentRoute.value.query;
  if (query.denied) {
    store.setError("User denied authorization to twitter");
    router.push("/error");
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
      store.setError(`(${e.code}) ${e.message} \n\n More Details: \n${e}`);
      router.push("/error");
      store.setIsLoading(false);
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
  } catch (e: any) {
    store.setError(`(${e.code}) ${e.message} \n\n More Details: \n${e}`);
    router.push("/error");
    console.error(e);
  }
};

const disableNotifications = async () => {
  try {
    localStorage.clear();
    store.setLoggedIn(false);
    await axios({
      url: `${api}/twitter/exit`,
      method: "POST",
    });
  } catch (e: any) {
    store.setError(`(${e.code}) ${e.message} \n\n More Details: \n${e}`);
    router.push("/error");
    console.error(e);
  }
};

let refreshUser = async () => {
  try {
    let res = await axios.get(`${api}/twitter/users/me`);
    store.setUserInfo(res.data);

    let subs = await axios.get(`${api}/subscriptions`);
    store.setSubscriptions(subs.data.subscriptions);
  } catch (e: any) {
    store.setError(`(${e.code}) ${e.message} \n\n More Details: \n${e}`);
    router.push("/error");
    console.log(e);
  }
};

const subscribe = async (address: string) => {
  store.setSubscribePending(true);
  try {
    await axios({
      url: `${api}/twitter/subscribe`,
      method: "POST",
      data: { address: address, protocol: "argora" },
    });

    await refreshUser();
    store.setSubscribePending(false);
  } catch (e: any) {
    console.error(e);
    store.setError(`(${e.code}) ${e.message} \n\n More Details: \n${e}`);
    router.push("/error");
    store.setSubscribePending(false);
  }
};

const unsubscribe = async (address: string) => {
  try {
    store.setSubscribePending(true);

    await axios({
      url: `${api}/twitter/unsubscribe`,
      method: "POST",
      data: { address: address, protocol: "argora" },
    });
    await refreshUser();
    store.setSubscribePending(false);
  } catch (e: any) {
    console.error(e);
    store.setError(`(${e.code}) ${e.message} \n\n More Details: \n${e}`);
    router.push("/error");
    store.setSubscribePending(false);
  }
};

const contributing = () => {
  window.open(
    "https://github.com/MetaweaveTeam/arnotify/CONTRIBUTING.md",
    "_blank"
  );
};

const handleProtocolChangeRedirect = (selected: string) => {
  if (selected === "argora" || selected === "Data Protocol") {
    return;
  }
  window.open(
    "https://github.com/MetaweaveTeam/arnotify/CONTRIBUTING.md",
    "_blank"
  );
};

const handleAddressChange = (address: string) => {
  store.setArweaveAddress(address);
};

const onWidthChange = () => (windowWidth.value = window.innerWidth);

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

  window.addEventListener("resize", onWidthChange);
});
onUnmounted(() => window.removeEventListener("resize", onWidthChange));
</script>

<template>
  <input type="checkbox" id="tc-modal" className="modal-toggle" />
  <div className="modal">
    <div className="modal-box">
      <p className="py-4">{{ TC }}</p>
      <div className="modal-action">
        <label for="tc-modal" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
        <label htmlFor="tc-modal" @click="loginStep1" className="btn btn-primary">I agree to the terms and
          conditions</label>
      </div>
    </div>
  </div>

  <div v-if="store.isLoading">
    <Loading />
  </div>

  <div v-else class="widget shadow-xl">
    <img class="meta_logo" src="https://arweave.net/fLKdBlb-6UTMEyQMzFoTb0osGa0oTzZmSebGw1TMgvM" />

    <!-- IF LOGGED OUT -->
    <div v-if="!store.logged_in">
      <div className="first_box">
        <div className="main_text">
          Subscribe to arweave protocols and notify your audience about it
        </div>
        <div className="main_text">Select your notification medium</div>
      </div>

      <div class="spacing">
        <label htmlFor="tc-modal" className="btn btn-primary my_buttons lg:btn-lg md:btn-md ">
          <div className="flex flex-row justify-center items-center justify-items-center">
            <div class="flex-none">
              <TwitterIcon class="twitter_logo" />
            </div>
            <div class="flex-1 w-64 button_text">Sign in with Twitter</div>
          </div>
        </label>
      </div>

      <div class="spacing">
        <button @click="contributing()" className="btn btn-primary my_buttons lg:btn-lg md:btn-md ">
          <div className="flex flex-row justify-center items-center justify-items-center">
            <div class="flex-none">
              <InstagramIcon class="insta_logo" />
            </div>
            <div class="flex-1 w-64">Sign in with Instagram</div>
          </div>
        </button>
      </div>
    </div>

    <!-- IF LOGGED IN -->
    <div v-if="store.userInfo && store.logged_in" class="w-full">
      <div class="main_text">Notification medium</div>

      <div className="flex flex-row justify-center items-center justify-items-center my-3">
        <img class="profile_pic" :src="store.userInfo && store.userInfo.photo_url" />
        <div class="main_text">
          @{{ store.userInfo && store.userInfo.main_handle }}'s audience on
        </div>
        <div>
          <TwitterIcon class="twitter_logo mx-2" />
        </div>
      </div>
      <div className="flex flex-row justify-center items-center justify-items-center my-3 gap-3">
        <button v-if="store.logged_in" className="btn btn-error my_buttons button_text" @click="disableNotifications">
          Disable notifications
        </button>
        <button v-if="store.logged_in" className="btn btn-info" @click="logout">
          Logout
        </button>
      </div>

      <div class="divider"></div>
    </div>
    <div v-if="store.logged_in && store.userInfo" class="w-full">
      <div class="main_text">Notifications list</div>

      <div v-if="store.subscriptions.length > 0" className="overflow-x-auto my-3">
        <table className=" w-full table-compact">
          <thead>
            <tr>
              <th>Arweave address</th>
              <th>Protocol</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="store.subscriptions.length > 0" v-for="(item, index) in store.subscriptions">
              <td>
                <a :href="'https://r.metaweave.xyz/u/' + item.arweave_address" class="wallet" target="_blank">
                  <div v-if="windowWidth < 550">
                    {{ item.arweave_address.substring(0, 15) + "..." }}
                  </div>
                  <div v-else>{{ item.arweave_address }}</div>
                </a>
              </td>
              <td>
                <div class="" v-if="item.protocol_name === 'argora'">
                  <a href="https://metaweave.xyz" target="_blank">
                    Argora (Metaweave.xyz)
                  </a>
                </div>
                <div class="" v-else></div>
              </td>
              <td>
                <button className="btn btn-xs btn-error " @click="() => unsubscribe(item.arweave_address as any)">
                  X
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="store.subscriptions.length === 0">
        No notifications set for this medium yet.
      </div>
      <div class="divider"></div>

      <!-- <Loading /> -->
      <div className="flex flex-col justify-center items-center justify-items-center my-3 ">
        <div class="form-control w-full max-w-md">
          <label class="label">
            <span class="label-text main_text"> Arweave Wallet Address</span>
          </label>

          <input v-model="address" v-on:input="() => handleAddressChange(address)" type="text"
            className="input w-full  input-bordered" />
          <label class="label">
            <span class="label-text-alt profile">
              <div v-if="!store.isAddressValid">
                ❗ Invalid wallet address format
              </div>
              <div v-else>
                <a :href="'https://r.metaweave.xyz/u/' + store.arweaveAddress" target="_blank">✔️ See user profile</a>
              </div>
            </span>
          </label>
        </div>
        <div class="form-control w-full max-w-md">
          <label class="label">
            <span class="label-text main_text"> Data Protocol</span>
          </label>

          <select class="select select-bordered w-full" v-model="selected"
            @change="() => handleProtocolChangeRedirect(selected)">
            <option>Data Protocol</option>
            <option value="argora" selected>Argora (Metaweave.xyz)</option>
            <option value="permapages">permapages</option>
            <option value="more">More</option>
          </select>
        </div>
        <button :disabled="!store.isAddressValid" class="btn btn-success lg:btn-lg md:btn-md my-3"
          v-bind:class="{ loading: store.subscribePending }" @click="() => subscribe(address)">
          Create new notification
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
a:link {
  color: blue;
  background-color: transparent;
  text-decoration: underline;
}

.header {
  font-size: 30px;
}

.my_buttons {
  max-width: 400px;
}

.spacing {
  margin-bottom: 20px;
}

.wallet {
  font-family: "monospace";
}

.main_text {
  font-size: 20px;
}

.first_box {
  margin-bottom: 50px;
}

.profile_pic {
  max-width: 48px;
  max-height: 48px;
  margin-right: 10px;
}

.widget {
  display: flex;
  border-radius: 2rem;
  padding: 2rem;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100vh;
}

.twitter_logo {
  width: 40px;
  height: 40px;
}

.insta_logo {
  width: 40px;
  height: 40px;
}

.button_text {
  color: "white";
}

.profile {
  color: "#18152e";
}
</style>
