<script setup lang="ts">
import { inject } from "vue";
import type { Router } from "vue-router";
import { useMainStore } from "@/stores";
import TwitterIcon from "@/components/logos/TwitterIcon.vue";
import SubscriptionsTableVue from "./SubscriptionsTable.vue";

const axios: any = inject("axios");
const router: Router = inject("router")!;
const store = useMainStore();
const api = import.meta.env.VITE_BACKEND_URL;

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
          {{ store.twitterAccount.followers_count || 0 }}
        </div>
        <div class="stat-title">followers</div>
      </div>
      <button v-if="store.logged_in" className="btn btn-error self-end" @click="logout">
        Logout
      </button>
    </div>
    <div class="stats sm:w-1/2 stats-vertical border shadow-xl text-center">
      <div class="stat">
        <div class="stat-title">Balance</div>
        <div class="stat-value">---</div>
        <div class="stat-desc">$MTT</div>
      </div>
      <div class="stat">
        <div class="stat-title">Notifications sent</div>
        <div class="stat-value">---</div>
        <div class="stat-desc">tweets</div>
      </div>
      <div class="stat">
        <div class="stat-title">Earning rate</div>
        <div class="stat-value">
          {{ store.twitterAccount.earning_rate || 0 }}
        </div>
        <div class="stat-desc">$MTT / notification</div>
      </div>
    </div>
  </div>
</template>
