<script setup lang="ts">
import { inject } from "vue";
import type { Router } from "vue-router";
import { useMainStore } from "@/stores";
import TwitterIcon from "@/components/logos/TwitterIcon.vue";
import SubscriptionsTableVue from "./SubscriptionsTable.vue";
import { ArweaveWebWallet } from "arweave-wallet-connector";

const axios: any = inject("axios");
const router: Router = inject("router")!;
const store = useMainStore();
const api = import.meta.env.VITE_BACKEND_URL;

async function connectWallet(walletName: "arconnect" | "webwallet") {
  switch (walletName) {
    case "arconnect":
      await window.arweaveWallet.connect([
        "ACCESS_ADDRESS",
        "ACCESS_ALL_ADDRESSES",
        "SIGN_TRANSACTION",
        "DISPATCH",
      ]);
      break;
    case "webwallet":
      // eslint-disable-next-line no-case-declarations
      const webWallet = new ArweaveWebWallet({
        name: "arNotify",
        logo: "https://arweave.net/p_33FVjqeGm6V1RTXaIKDSzg-SSf6dOyvLF6ND7QIDw",
      });
      webWallet.setUrl("arweave.app");
      await webWallet.connect();
      webWallet.on("change", () => { });
      break;
    default:
      throw new Error(`Attempted to connect unknown wallet ${walletName}`);
  }

  const address = await window.arweaveWallet.getActiveAddress();
  const user = await axios({
    url: `${api}/arweave/wallet`,
    method: "POST",
    data: {
      address: address,
    },
  });

  store.setArweaveWallet(user.data.arweave_address);
  return user.data.arweave_address;
}

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
</script>

<template>
  <div class="divider">Subscriptions</div>
  <SubscriptionsTableVue />
  <div class="divider">Stats</div>
  <div class="flex sm:flex-row flex-col gap-5">
    <div class="stats sm:w-1/2 stats-vertical border shadow-xl text-center">
      <div class="stat">
        <div class="stat-title">Audience</div>
        <div class="stat-value justify-self-center">
          <TwitterIcon class="text-neutral" size="80" />
        </div>
        <div class="stat-desc">Twitter</div>
      </div>
      <div class="stat">
        <div class="stat-title">
          @{{ store.twitterAccount && store.twitterAccount.main_handle }}
        </div>
        <div class="stat-value">
          <div class="avatar">
            <div class="w-20 rounded-3xl shadow-xl ring ring-success ring-offset-base-100 ring-offset-2 m-2">
              <img class="profile_pic" :src="store.twitterAccount && store.twitterAccount.photo_url" />
            </div>
          </div>
        </div>
        <div class="stat-desc">Connected account</div>
      </div>
      <div class="stat">
        <div class="stat-value">
          {{ store.twitterAccount.followers_count }}
        </div>
        <div class="stat-title">followers</div>
      </div>
      <button v-if="store.logged_in" className="btn btn-error self-end" @click="logout">
        Logout
      </button>
    </div>
    <div v-if="store.twitterAccount.arweave_address" class="stats sm:w-1/2 stats-vertical border shadow-xl text-center">
      <div class="stat">
        <div class="stat-title">
          <p class="text-lg">Arweave wallet</p>
        </div>
        <div class="stat-value">
          <p class="text-base">
            {{ store.twitterAccount.arweave_address.substring(0, 9) + "..." +
                store.twitterAccount.arweave_address.substring(store.twitterAccount.arweave_address.length - 6)
            }}
          </p>
        </div>
        <div class="stat-desc"><span class="text-emerald-500">Connected</span></div>
        <div class="stat-actions">
          <label for="changeWallet" class="btn btn-sm btn-outline btn-primary">
            Change Wallet
          </label>
        </div>
      </div>
      <div class="stat">
        <div class="stat-title">Balance</div>
        <div class="stat-value">---</div>
        <div class="stat-desc">$MTT</div>
      </div>
      <div class="stat">
        <div class="stat-title">Notifications sent</div>
        <div class="stat-value">
          {{ store.twitterAccount.tweets_count }}
        </div>
        <div class="stat-desc">tweets</div>
      </div>
      <div class="stat">
        <div class="stat-title">Earning rate</div>
        <div class="stat-value">
          {{ store.twitterAccount.earning_rate }}
        </div>
        <div class="stat-desc">$MTT / notification</div>
      </div>
      <input type="checkbox" id="changeWallet" class="modal-toggle" />
      <label for="changeWallet" class="modal modal-bottom sm:modal-middle cursor-pointer">
        <label class="modal-box relative" for="">
          <label for="changeWallet" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
          <h3 class="font-bold text-lg">Connect Arweave Wallet</h3>
          <p class="py-4">
            Connect your Arweave wallet and start earnings
          </p>
          <div class="modal-action justify-center">
            <a class="btn" @click="connectWallet('arconnect')">
              <img src="https://arweave.net/EoHJJ6jtlKjRk-O94J1kKzQsQ-28dgZ6U7z2FVK6pOQ" alt="ArConnect"
                class="w-8 h-8" />
              <span>ArConnect</span>
            </a>
            <a class="btn" @click="connectWallet('webwallet')">
              <img src="https://arweave.net/mYIoULR7yGYs_6DT1_l0kV1DvYTxyfIm0YgWFZyr6l0" alt="arweave.app"
                class="w-8 h-8" />
              <span>arweave.app</span>
            </a>
          </div>
        </label>
      </label>
    </div>
    <div v-else class="stats sm:w-1/2 place-items-center stats-vertical border shadow-xl text-center">
      <div class="stat">
        <div class="stat-title">Connect Arweave wallet</div>
        <div class="stat-value">Start Earning</div>
        <div class="stat-actions">
          <div class="flex flex-col gap-4">
            <a class="btn" @click="connectWallet('arconnect')">
              <img src="https://arweave.net/EoHJJ6jtlKjRk-O94J1kKzQsQ-28dgZ6U7z2FVK6pOQ" alt="ArConnect"
                class="w-8 h-8" />
              <span>ArConnect</span>
            </a>
            <a class="btn" @click="connectWallet('webwallet')">
              <img src="https://arweave.net/mYIoULR7yGYs_6DT1_l0kV1DvYTxyfIm0YgWFZyr6l0" alt="arweave.app"
                class="w-8 h-8" />
              <span>arweave.app</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
