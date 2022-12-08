<script setup lang="ts">
import { inject } from "vue";
import type { Router } from "vue-router";
import { TC } from "../types";
import { useMainStore } from "@/stores/store";
const axios: any = inject("axios");
const router: Router = inject("router")!;

let api = import.meta.env.VITE_BACKEND_URL;
const store = useMainStore();

let loginStep1 = async () => {
  try {
    store.setIsLoading(true);
    let res = await axios.post(api + "/twitter/oauth/request_token");
    window.location.href = res.data.url;
  } catch (e: any) {
    console.log(e);
    store.setError(`(${e.code}) ${e.message} \n\n More Details: \n${JSON.stringify(e)}`);
    const txid = router.currentRoute.value.params.txid;
    if (txid) {
      router.push(`/${txid}/error`);
    } else {
      router.push("/error");
    }
  }
};
</script>

<template>
  <input type="checkbox" id="tc-modal" className="modal-toggle" />
  <div className="modal">
    <div className="modal-box">
      <p className="py-4">{{ TC }}</p>
      <div className="modal-action">
        <label for="tc-modal" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
        <label htmlFor="tc-modal" @click="loginStep1" className="btn btn-primary">
          I agree to the terms and
          conditions
        </label>
      </div>
    </div>
  </div>
</template>