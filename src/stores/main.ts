import { defineStore } from "pinia";

export default defineStore("main", {
  state: () => {
    const expiry = localStorage.getItem("expiry");
    return {
      twitterAccount: null as any,
      logged_in: expiry ? +expiry > Date.now() : false,
      isLoading: true,
      error: null as any,
      arweaveWallet: null as any,
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
    setArweaveWallet(arweaveWallet: any) {
      this.arweaveWallet = arweaveWallet;
    },
  },
});
