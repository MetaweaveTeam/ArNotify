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
  <h1 className="text-4xl">Arweave native notification protocol.</h1>
  <h2 className="text-3xl text-secondary">Select your notification medium</h2>
  <label htmlFor="tc-modal" className="btn gap-2 btn-primary">
    <TwitterIcon />
    Twitter
  </label>
  <button @click="contributing()" className="btn gap-2 btn-neutral">
    <InstagramIcon />
    Instagram (later)
  </button>
  <button @click="contributing()" className="btn gap-2 btn-neutral">
    <DiscordIcon />
    Discord (soon)
  </button>
</template>