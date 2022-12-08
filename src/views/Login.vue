<script setup lang="ts">
import InstagramIcon from "@/components/logos/InstagramIcon.vue";
import TwitterIcon from "@/components/logos/TwitterIcon.vue";
import DiscordIcon from "@/components/logos/DiscordIcon.vue";

const contributing = () => {
  window.open(
    "https://github.com/MetaweaveTeam/arnotify/CONTRIBUTING.md",
    "_blank"
  );
};
</script>

<template>
  <div className="card sm:card-side drop-shadow-lg border max-w-3xl">
    <figure><img className="sm:inline-flex hidden" src="https://arweave.net/fwtsWWs3s2j82WkvE_BGkSqt6R0yHBAs1mmmJDEqRjY" alt="Arweave"/></figure>

    <div className="card-body sm:w-2/3">
      <h1 className="card-title m-auto">Arweave notification center</h1>
      <p className="text-justify my-5">
        Follow any wallet interactions with permaDapps on Arweave.
        Bring real time notifications from <a href="https://arweave.org" target="_blank">Arweave</a> protocols to your web2 community.
      </p>
    
      <p>Select the medium you want to receive notifications on:</p>
      <label htmlFor="tc-modal" className="btn gap-2 btn-primary">
        <TwitterIcon />
        Twitter
      </label>
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