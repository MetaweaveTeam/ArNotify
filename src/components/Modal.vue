<script setup lang="ts">
import { inject } from "vue";
import type { Router } from "vue-router";
import { useMainStore } from "@/stores";
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
    store.setError(e);
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
    <div className="modal-box relative text-justify">
      <label for="tc-modal" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
      <h3 class="font-bold text-lg">MIT License</h3>
      <p class="my-4">Copyright (c) 2022 METAWEAVE.XYZ</p>
      <p class="my-2 text-sm">
        Permission is hereby granted, free of charge, to any person obtaining a copy
        of this software and associated documentation files (the "Software"), to deal
        in the Software without restriction, including without limitation the rights
        to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
        copies of the Software, and to permit persons to whom the Software is
        furnished to do so, subject to the following conditions:
      </p>
      <p class="my-2 text-sm font-bold">
        The above copyright notice and this permission notice shall be included in all
        copies or substantial portions of the Software.
      </p>
      <p class="my-2 text-sm">
        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
        IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
        FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
        AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
        LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
        OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
        SOFTWARE.
      </p>
      <div className="modal-action">
        <label htmlFor="tc-modal" @click="loginStep1" className="btn btn-secondary">
          Accept
        </label>
      </div>
    </div>
  </div>
</template>