import { defineStore } from "pinia";
import type { Notif, Subscription } from "../types";
import Arweave from "arweave";
import ArAccount, { type ArProfile } from "arweave-account";

const arAccount = new ArAccount();

const getArAccounts = (subscription: Subscription) =>
  arAccount.get(subscription.arweave_address.toString())
  .then((account) => {
    return { subscription, arName: account.handle, arProfile: account.profile };
  })
  .catch((e) => {
    console.log("arAccount.get() Error", e)
    return null
  })

export default defineStore("subscriptions", {
  state: () => {
    return {
      notifs: [] as Notif[],
      subscribePending: false,
      isAddressValid: false,
      arweaveAddress: "",
      arName: "",
      arProfile: {} as ArProfile
    };
  },

  actions: {
    async setSubscriptions(subscriptions: Subscription[]) {
      this.notifs = (await Promise.all(subscriptions.map(getArAccounts)))
        .filter((a): a is Notif => a !== null);
    },
    async setArweaveAddress(arweaveAddress: string) {
      this.arweaveAddress = arweaveAddress;

      try {
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
