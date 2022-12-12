import { defineStore } from "pinia";
import type { Subscription } from "../types";
import Arweave from "arweave";

export default defineStore("subscriptions", {
  state: () => {
    return {
      subscriptions: [] as Subscription[],
      subscribePending: false,
      arweaveAddress: "",
      isAddressValid: false
    };
  },

  actions: {
    setSubscriptions(subscriptions: any) {
      this.subscriptions = subscriptions;
    },
    setArweaveAddress(arweaveAddress: any) {
      this.arweaveAddress = arweaveAddress;

      try {
        const key = Arweave.utils.b64UrlToBuffer(arweaveAddress);

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
