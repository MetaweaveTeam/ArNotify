<script setup lang="ts">
import { useMainStore } from "@/stores";
import { inject } from "vue";
import type { Router } from "vue-router";
import Header from "@/components/Header.vue";

const router: Router = inject("router")!;
let store = useMainStore();

const returnHome = () => {
  const txid = router.currentRoute.value.params.txid;
  if (txid) {
    router.push(`/${txid}`);
  } else {
    router.push("/");
  }
};

if (!store.error) {
    returnHome();
}
// console.log(JSON.parse(store.error))
</script>

<template>
  <Header />
  <div v-if="store.error" className="card drop-shadow-lg border max-w-3xl">
    <figure><img src="https://arweave.net/uGNpH9Tc8C_acngWqQ_-rbhqLq0hjJzPS77zNYg53YA" alt="Shoes" /></figure>
    <div className="card-body">
      <h3 className="card-title m-auto text-4xl my-5 text-error">
        {{ store.error.message }}
      </h3>
      
      <button @click="returnHome" className="btn btn-secondary m-auto my-5">
        Try again
      </button>
      <div className="collapse">
        <input type="checkbox" class="peer" /> 
        <div className="collapse-title">See <code>{{ store.error.name }}</code> details</div>
        <pre className="collapse-content">{{ JSON.stringify(store.error, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>