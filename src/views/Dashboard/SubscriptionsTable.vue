<script setup lang="ts">
import { inject, onMounted, onUnmounted, ref } from "vue";
import type { Router } from "vue-router";
import { useMainStore } from '@/stores/store';

const axios: any = inject("axios");
const router: Router = inject("router")!;
const store = useMainStore();
const api = import.meta.env.VITE_BACKEND_URL;

let address = "";
let selected = "argora";

let windowWidth = ref(window.innerWidth);
const onResize = () => windowWidth.value = window.innerWidth;
onMounted(() => window.addEventListener('resize', onResize));
onUnmounted(() => window.removeEventListener('resize', onResize));

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
            <div class="tooltip tooltip-right" data-tip="Visit profile">
              <a :href="'https://r.metaweave.xyz/u/' + store.arweaveAddress" target="_blank">✔️</a>
            </div>
          </div>
          <div v-else-if="store.arweaveAddress.length <= 0"></div>
          <div v-else>
            <div class="tooltip tooltip-right" data-tip="Invalid wallet address format">
              ❌
            </div>
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
      <tr v-for="(item, index) in store.subscriptions" class="bg-success">
        <th>
          {{ index }}
        </th>
        <td>
          <a class="wallet-address" :href="'https://r.metaweave.xyz/u/' + item.arweave_address" target="_blank">
            <div v-if="windowWidth < 700">
              {{ item.arweave_address.substring(0, 6) + "..." + item.arweave_address.slice(-6) }}
            </div>
            <div v-else>{{ item.arweave_address }}</div>
          </a>
        </td>
        <td>
          <div v-if="item.protocol_name === 'argora'">
            <a href="https://metaweave.xyz" target="_blank">
              Metaweave.xyz (Argora v1.2-beta)
            </a>
          </div>
          <div v-else></div>
        </td>
        <td>
          <button className="btn btn-warning" @click="() => unsubscribe(item.arweave_address as any)">
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