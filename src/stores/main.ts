import { defineStore } from "pinia";
import Arweave from "arweave";

export default defineStore("main", {
  state: () => {
    const expiry = localStorage.getItem("expiry");
    return {
      twitterAccount: null as any,
      logged_in: expiry ? +expiry > Date.now() : false,
      isLoading: true,
      error: null as any,
    };
  },

  actions: {
    setLoggedIn(isLoggedIn: boolean) {
      this.logged_in = isLoggedIn;
    },
    setTwitterAccount(twitterAccount: any) {
      this.twitterAccount = twitterAccount;
    },
    setIsLoading(isLoading: any) {
      this.isLoading = isLoading;
    },
    setError(error: any) {
      this.error = error;
    },
  },
});
