<script setup lang="ts">
import { inject, ref } from "vue";
import type { Router } from "vue-router";
import { useMainStore } from '@/stores/store';
import TwitterIcon from "@/components/logos/TwitterIcon.vue";

const axios: any = inject("axios");
const router: Router = inject("router")!;
const store = useMainStore();

let api = import.meta.env.VITE_BACKEND_URL;
let windowWidth = ref(window.innerWidth);

let address = "";
let selected = "argora";

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
    store.setError(e);
    const txid = router.currentRoute.value.params.txid;
    if (txid) {
      router.push(`/${txid}/error`);
    } else {
      router.push("/error");
    }
    store.setSubscribePending(false);
  }
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
    store.setError(
      `(${e.code}) ${e.message} \n\n More Details: \n${JSON.stringify(e)}`
    );
    const txid = router.currentRoute.value.params.txid;
    if (txid) {
      router.push(`/${txid}/error`);
    } else {
      router.push("/error");
    }
    store.setSubscribePending(false);
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
    store.setError(e);
    const txid = router.currentRoute.value.params.txid;
    if (txid) {
      router.push(`/${txid}/error`);
    } else {
      router.push("/error");
    }
    console.error(e);
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
    store.setError(e);
    const txid = router.currentRoute.value.params.txid;
    if (txid) {
      router.push(`/${txid}/error`);
    } else {
      router.push("/error");
    }
    console.error(e);
  }
};

const handleAddressChange = (address: string) => {
  store.setArweaveAddress(address);
};
</script>

<template>
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
</template>