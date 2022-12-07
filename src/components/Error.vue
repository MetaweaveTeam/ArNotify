<script setup lang="ts">
import { useMainStore } from "@/stores/store";
import { inject } from "vue";
import type { Router } from "vue-router";
const router: Router = inject("router")!;

let store = useMainStore();

if (!store.error) {
    router.push("/");
}

const returnHome = () => {
    router.push("/");
};
</script>

<template>
    <div class="widget shadow-xl">
        <img class="meta_logo" src="https://arweave.net/fLKdBlb-6UTMEyQMzFoTb0osGa0oTzZmSebGw1TMgvM" />
        <div className="flex flex-col justify-center items-center justify-items-center gap-10">
            <div class="header">Something went wrong :(</div>

            <div class="main_text">See error details:</div>

            <div>
                <textarea class="textarea area" :value="store.error" disabled="true">
        </textarea>
            </div>

            <div>
                <button @click="returnHome" className="btn btn-primary my_buttons lg:btn-lg md:btn-md ">
                    Try again
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.header {
    font-size: 30px;
}

.area {
    min-width: 400px;
}

.main_text {
    font-size: 20px;
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
</style>
