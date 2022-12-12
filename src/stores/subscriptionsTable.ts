import { defineStore } from "pinia";
import type { Subscription } from "../types";
import Arweave from "arweave";
import ArAccount, { type ArProfile } from "arweave-account";

const arAccount = new ArAccount();

export default defineStore("subscriptions", {
  state: () => {
    return {
      subscriptions: [] as Subscription[],
      subscribePending: false,
      isAddressValid: false,
      arweaveAddress: "",
      arName: "",
      arProfile: {} as ArProfile
    };
  },

  actions: {
    setSubscriptions(subscriptions: any) {
      this.subscriptions = subscriptions;
    },
    async setArweaveAddress(arweaveAddress: string) {
      this.arweaveAddress = arweaveAddress;

      try {
        console.log("fdfsd");
        
        const key = Arweave.utils.b64UrlToBuffer(arweaveAddress);
        
        if (key.length === 32) {
          const { handle, profile } = await arAccount.get(arweaveAddress);
          this.arName = handle;
          this.arProfile = profile;
          this.isAddressValid = true;
        } else {
          this.isAddressValid = false;
        }
      } catch (e) {
        console.log("ERRRRROR");
        
        this.isAddressValid = false;
      }
    },
  },
});
