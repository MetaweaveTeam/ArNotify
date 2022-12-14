<script setup lang="ts">
import { inject, onMounted, onUnmounted, ref } from "vue";
import type { Router } from "vue-router";
import { useMainStore, useSubscriptionsStore } from "@/stores";
import LoadingVue from "@/components/Loading.vue";

const axios: any = inject("axios");
const router: Router = inject("router")!;
const store = useSubscriptionsStore();
const storeGlobal = useMainStore();
const api = import.meta.env.VITE_BACKEND_URL;

let selected = "argora";

const address = ref("");
const isLoading = ref(true);
const isPending = ref(true);

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
    isLoading.value = true;

    let res = await axios.get(`${api}/twitter/users/me`);
    storeGlobal.setTwitterAccount(res.data);

    let subs = await axios.get(`${api}/subscriptions`);
    store.setSubscriptions(subs.data.subscriptions);

    isLoading.value = false;
  } catch (e: any) {
    storeGlobal.setError(e);
    const txid = router.currentRoute.value.params.txid;
    if (txid) {
      router.push(`/${txid}/error`);
    } else {
      router.push("/error");
    }
    console.log(e);
  }
};

onMounted(refreshUser);

const subscribe = async (addr: string) => {
  isPending.value = true;
  try {
    await axios({
      url: `${api}/twitter/subscribe`,
      method: "POST",
      data: { address: addr, protocol: "argora" },
    });

    await refreshUser();
    isPending.value = false;
    store.setArweaveAddress("");
    address.value = ""
  } catch (e: any) {
    console.error(e);
    storeGlobal.setError(e);
    const txid = router.currentRoute.value.params.txid;
    if (txid) {
      router.push(`/${txid}/error`);
    } else {
      router.push("/error");
    }
    isPending.value = false;
  }
};

const unsubscribe = async (address: string) => {
  try {
    isPending.value = true;

    await axios({
      url: `${api}/twitter/unsubscribe`,
      method: "POST",
      data: { address: address, protocol: "argora" },
    });
    await refreshUser();
    isPending.value = false;
  } catch (e: any) {
    console.error(e);
    storeGlobal.setError(
      `(${e.code}) ${e.message} \n\n More Details: \n${JSON.stringify(e)}`
    );
    const txid = router.currentRoute.value.params.txid;
    if (txid) {
      router.push(`/${txid}/error`);
    } else {
      router.push("/error");
    }
    isPending.value = false;
  }
};

const copyUserWalletAddress = () => {
  address.value = "todo";
};
</script>

<template>
  <table class="table table-compact shadow-2xl">
    <thead>
      <tr>
        <th>
          <a href="https://arprofile.org" target="_blank">
            <img
              src="https://arweave.net/d8iSwXb6CFT17sEMzNFng_bPtpOIVsXY5M-ZtjRrKkg"
              height="100%"
              class="m-auto"
            />
          </a>
        </th>
        <th>Arweave wallet</th>
        <th>Application (data protocol)</th>
        <th></th>
      </tr>
      <tr>
        <td>
          <div v-if="store.isAddressValid" class="avatar">
            <div class="w-12 mask mask-hexagon">
              <a
                :href="'https://r.metaweave.xyz/u/' + store.arweaveAddress"
                target="_blank"
              >
                <img :src="store.arProfile.avatarURL" />
              </a>
            </div>
          </div>
          <div v-else-if="store.arweaveAddress.length <= 0">
            <!-- <button class="btn btn-primary" @click="() => copyUserWalletAddress()">
              cp
            </button> -->
          </div>
          <div v-else>
            <button class="btn btn-error btn-outline btn-disabled">❌</button>
          </div>
        </td>
        <td>
          <input
            placeholder="wallet address"
            v-model="address"
            v-on:input="() => handleAddressChange(address)"
            type="text"
            className="input w-full input-bordered border-primary"
          />
        </td>
        <td>
          <select
            class="select select-bordered w-full border-secondary"
            v-model="selected"
            @change="() => handleProtocolChangeRedirect(selected)"
          >
            <option value="argora" selected>Metaweave.xyz</option>
            <option value="more">Custom</option>
          </select>
        </td>
        <td>
          <button
            :disabled="!store.isAddressValid"
            class="btn btn-secondary"
            v-bind:class="{ loading: store.subscribePending }"
            @click="() => subscribe(address)"
          >
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
      <tr v-else v-for="(item, index) in store.notifs">
        <th>
          <div class="avatar">
            <div class="w-12 mask mask-hexagon">
              <a
                :href="'https://r.metaweave.xyz/u/' + item.subscription.arweave_address"
                target="_blank"
              >
                <img :src="item.arProfile.avatarURL" />
              </a>
            </div>
          </div>
        </th>
        <td class="text-xl">
          <a
            class="wallet-address"
            :href="'https://r.metaweave.xyz/u/' + item.subscription.arweave_address"
            target="_blank"
          >
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
          <button
            className="btn btn-warning"
            @click="() => unsubscribe(item.subscription.arweave_address as any)"
          >
            Del
          </button>
        </td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td></td>
        <td colspan="3">
          <div
            v-if="!store.notifs.length"
            class="alert border-2 border-info max-w-xl text-neutral"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="stroke-current flex-shrink-0 w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            You have no active subscriptions at the moment.
          </div>
        </td>
      </tr>
    </tfoot>
  </table>
</template>
