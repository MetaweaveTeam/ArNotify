<script setup lang="ts">
import { inject, onMounted, onUnmounted, ref } from "vue";
import type { Router } from "vue-router";
import { useMainStore } from '@/stores/store';
import LoadingVue from "@/components/Loading.vue";

import Account from 'arweave-account';
const arAccount = new Account();

const axios: any = inject("axios");
const router: Router = inject("router")!;
const store = useMainStore();
const api = import.meta.env.VITE_BACKEND_URL;

let selected = "argora";

const address = ref("");
const isLoading = ref(true);
const subscriptions = ref();

let windowWidth = ref(window.innerWidth);
const onResize = () => windowWidth.value = window.innerWidth;
onMounted(() => window.addEventListener('resize', onResize));
onUnmounted(() => window.removeEventListener('resize', onResize));

const getArAccounts = store.subscriptions.map((subscription) =>
  arAccount.get(subscription.arweave_address.toString())
    .then(account => { return { subscription, arName: account.handle, arProfile: account.profile } })
    .catch(e => console.log("arAccount.get() Error", e)));

onMounted(async () => {
  subscriptions.value = await Promise.all(getArAccounts)
  isLoading.value = false;
});

const handleAddressChange = (address: string) => store.setArweaveAddress(address);

const handleProtocolChangeRedirect = (selected: string) => {
  if (selected === "argora") {
    return;
  }
  window.open(
    "https://github.com/MetaweaveTeam/arNotify-node/blob/main/CONTRIBUTING.md",
    "_blank"
  );
};

const refreshUser = async () => {
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

const copyUserWalletAddress = () => {
  address.value = "todo"
}
</script>

<template>
  <table class="table w-full table-compact shadow-2xl">
    <thead>
      <tr>
        <th class="p-2">
          <a href="https://arprofile.org" target="_blank">
            <img src="https://arweave.net/d8iSwXb6CFT17sEMzNFng_bPtpOIVsXY5M-ZtjRrKkg" height="100%" class="m-auto" />
          </a>
        </th>
        <th class="max-w-xl">Arweave wallet address</th>
        <th>Application (data protocol)</th>
        <th></th>
      </tr>
      <tr>
        <td>
          <div v-if="store.isAddressValid">
            <a :href="'https://r.metaweave.xyz/u/' + store.arweaveAddress" target="_blank">
              OK
            </a>
          </div>
          <div v-else-if="store.arweaveAddress.length <= 0">
            <button class="btn btn-primary" @click="() => copyUserWalletAddress()">
              cp
            </button>
          </div>
          <div v-else>
            <button class="btn btn-error btn-outline btn-disabled" @click="() => copyUserWalletAddress()">
              ❌
            </button>
          </div>
        </td>
        <td>
          <input placeholder="wallet address" v-model="address" v-on:input="() => handleAddressChange(address)" type="text" className="input w-full input-bordered border-primary" />
        </td>
        <td>
          <select class="select select-bordered w-full border-secondary" v-model="selected"
            @change="() => handleProtocolChangeRedirect(selected)">
            <option value="argora" selected>Metaweave.xyz (Argora v1.2-beta)</option>
            <option value="more">Custom</option>
          </select>
        </td>
        <td>
          <button :disabled="!store.isAddressValid" class="btn btn-secondary"
            v-bind:class="{ loading: store.subscribePending }" @click="() => subscribe(address)">
            Add
          </button>
        </td>
      </tr>
    </thead>
    <tbody>
      <tr v-if="isLoading">
        <td colspan="4">
          <LoadingVue />
        </td>
      </tr>
      <tr v-else v-for="(item, index) in subscriptions">
        <th>
          <div class="avatar">
            <div class="w-12 mask mask-hexagon">
              <a :href="'https://r.metaweave.xyz/u/' + item.subscription.arweave_address" target="_blank">
                <img :src="item.arProfile.avatarURL" />
              </a>
            </div>
          </div>
        </th>
        <td class="text-xl">
          <a class="wallet-address" :href="'https://r.metaweave.xyz/u/' + item.subscription.arweave_address" target="_blank">
            {{ item.arName }}
          </a>
        </td>
        <td>
          <div v-if="item.subscription.protocol_name === 'argora'">
            <a href="https://metaweave.xyz" target="_blank">
              Metaweave.xyz (Argora v1.2-beta)
            </a>
          </div>
          <div v-else></div>
        </td>
        <td>
          <button className="btn btn-warning" @click="() => unsubscribe(item.subscription.arweave_address as any)">
            Del
          </button>
        </td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td></td>
        <td colspan="3">
          <div v-if="!store.subscriptions.length" class="alert border-2 border-info max-w-xl text-neutral">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current flex-shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            You have no active subscriptions at the moment.
          </div>
        </td>
      </tr>
    </tfoot>
  </table>
</template>