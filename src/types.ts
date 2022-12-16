import type { ArProfile } from "arweave-account";

export type Subscription = {
  id: number;
  main_id: string;
  arweave_address: string;
  protocol_name: string;
  from_block_height: number;
  is_active: number;
};

export type Notif = {
  subscription: Subscription,
  arName: string,
  arProfile: ArProfile
}
