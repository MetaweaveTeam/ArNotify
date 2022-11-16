import { defineStore } from "pinia";
import type { Subscription } from "../types";
import Arweave from "arweave";

export const useMainStore = defineStore("main", {
  state: () => {
    let expiry = localStorage.getItem("expiry");
    return {
      logged_in: expiry ? +expiry > Date.now() : false,
      subscriptions: [] as Subscription[],
      userInfo: null as any,
      subscribePending: false,
      arweaveAddress: "",
      isAddressValid: false,
      isLoading: true,
    };
  },

  actions: {
    setLoggedIn(isLoggedIn: boolean) {
      this.logged_in = isLoggedIn;
    },
    setSubscribePending(isSubscribePending: boolean) {
      this.subscribePending = isSubscribePending;
    },
    setUserInfo(userInfo: any) {
      this.userInfo = userInfo;
    },
    setSubscriptions(subscriptions: any) {
      this.subscriptions = subscriptions;
    },
    setIsLoading(isLoading: any) {
      this.isLoading = isLoading;
    },
    setArweaveAddress(arweaveAddress: any) {
      this.arweaveAddress = arweaveAddress;

      try {
        let key = Arweave.utils.b64UrlToBuffer(arweaveAddress);

        if (key.length === 32) {
          this.isAddressValid = true;
        } else {
          this.isAddressValid = false;
        }
      } catch (e) {
        this.isAddressValid = false;
      }
    },
  },
});
