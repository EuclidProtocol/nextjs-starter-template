
import { signAndBroadcastExecute, useWalletStore } from "@/src/zustand/wallet";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { CrossChainUserWithLimit, TokenWithDenom, TxResult } from "./types";
import restClient from "@/lib/rest";



export interface IExecuteSwap {
  amountIn: string;
  assetIn: TokenWithDenom;
  assetOut: string;
  minAmountOut: string;
  swaps: string[];
  timeout?: number;
  crossChainAddresses: CrossChainUserWithLimit[];
}

export const useExecuteSwap = () => {
  const { wallet, chain } = useWalletStore();
  return useMutation({
    mutationFn: async (data: IExecuteSwap) => {
      const msg = await restClient.post("/execute/swap", {
        amount_in: data.amountIn,
        asset_in: data.assetIn,
        asset_out: data.assetOut,
        cross_chain_addresses: data.crossChainAddresses,
        min_amount_out: data.minAmountOut,
        sender: {
          address: wallet!.bech32Address,
          chain_uid: chain!.chain_uid,
        },
        swaps: data.swaps,
      }).then((res) => res as TxResult);


      const tx = await signAndBroadcastExecute(
        msg.msgs,
        "Swap"
      );
      return tx;
    },
    onSuccess: (data) => {
      console.log("Transaction successful:", data);
      // queryclient.invalidateQueries({
      //     queryKey: ["vlp", "liquidity", { vlp: varibales.vlp }],
      // });
      toast.success(`Transaction successful:${data.transactionHash}`);
    },
  });
};
