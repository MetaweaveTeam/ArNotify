<script setup lang="ts">
import InstagramIcon from "@/components/logos/InstagramIcon.vue";
import TwitterIcon from "@/components/logos/TwitterIcon.vue";
import DiscordIcon from "@/components/logos/DiscordIcon.vue";

const contributing = () => {
  window.open(
    "https://github.com/MetaweaveTeam/arNotify-node/blob/main/CONTRIBUTING.md",
    "_blank"
  );
};
</script>

<template>
  <div className="card sm:card-side drop-shadow-lg border max-w-3xl">
    <figure><img className="sm:inline-flex hidden" src="https://arweave.net/fwtsWWs3s2j82WkvE_BGkSqt6R0yHBAs1mmmJDEqRjY" alt="Arweave"/></figure>

    <div className="card-body sm:w-2/3">
      <h1 className="card-title m-auto">Web3 notification center</h1>
      <h2 className="text-xl m-auto">Out-Of-The-Box (OOTB)</h2>
      <p className="text-center my-5">
        Don't miss out on anything happening <span class="font-bold">on-chain</span>.
        <br />
        Notify your audience <span class="underline">in real time</span>.
      </p>
      <div class="divider m-0 font-bold">Try it now!</div>

      <label htmlFor="tc-modal" className="btn gap-2 btn-primary">
        <TwitterIcon size="30" />
        Twitter
      </label>
      <div class="divider m-0">roadmap</div>
      <button @click="contributing()" className="btn gap-2 btn-neutral">
        <DiscordIcon />
        Discord (soon)
      </button>
      <button @click="contributing()" className="btn gap-2 btn-neutral">
        <InstagramIcon />
        Instagram (later)
      </button>
    </div>
  </div>
</template>