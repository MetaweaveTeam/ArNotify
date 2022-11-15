import { defineStore } from "pinia";

type Subscription = {
  id: String;
  main_id: String;
  arweave_address: String;
  protocol_name: String;
  from_block_height: String;
  is_active: Number;
};

export const useMainStore = defineStore("main", {
  state: () => {
    let expiry = localStorage.getItem("expiry");
    return {
      logged_in: expiry ? +expiry > Date.now() : false,
      subscriptions: [] as Subscription[],
      userInfo: null as any,
      subscribePending: false,
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
  },
});
