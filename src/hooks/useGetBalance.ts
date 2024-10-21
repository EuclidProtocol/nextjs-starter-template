import { useCodegenGeneratedCwBalanceQuery, useCodegenGeneratedVcoinBalanceQuery } from "@euclidprotocol/graphql-codegen/dist/src/react";
import { ITokenType } from "@euclidprotocol/graphql-codegen";
import { useWalletStore } from "@/src/zustand/wallet";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useGetNativeBalance = (denom: string) => {
  const wallet = useWalletStore();
  return useQuery({
    queryKey: [
      "rest",
      "balance",
      { denom, wallet: !!wallet.chain, user: wallet.wallet?.bech32Address },
    ],
    queryFn: async () => {
      console.log("Loading...");
      const balance = await wallet.client!.queryClient!.getBalance(
        wallet.wallet!.bech32Address,
        denom
      );
      console.log(balance, "BALANCE", denom, wallet.wallet?.bech32Address);
      return balance;
    },
    enabled: !!denom && !!wallet.wallet && !!wallet.client,
    refetchInterval: 5000,
  });
};

export const useGetBalance = (denom: ITokenType | null, tokenId: string) => {
  const { chain, wallet } = useWalletStore();

  const { native, smart } = useMemo(() => {
    if (!denom) return {};
    const native = "native" in denom ? denom.native.denom : "";
    const smart = "smart" in denom ? denom.smart.contract_address : "";
    return { native, smart };
  }, [denom]);

  const { data: nativeBalance } = useGetNativeBalance(native || "");
  const { data: cw20Balance } = useCodegenGeneratedCwBalanceQuery({
    variables: {
      chain_uid: chain?.chain_uid || "",
      contract: smart || "",
      cw_balance_address: wallet?.bech32Address || "",
    },
    skip: !smart || !chain?.chain_uid || !wallet?.bech32Address || smart.length < wallet?.bech32Address.length,// Just a safe side check for contract address length
    pollInterval: 5000,
  });

  const { data: voucherBalance } = useCodegenGeneratedVcoinBalanceQuery({
    variables: {
      'vcoin_balance_balance_key': {
        'token_id': tokenId,
        'cross_chain_user': {
          'chain_uid': chain?.chain_uid || "",
          'address': wallet?.bech32Address || "",
        }
      }
    },
    skip: !tokenId || !chain?.chain_uid || !wallet?.bech32Address,
    pollInterval: 5000,
  })

  return {
    data: cw20Balance?.cw.balance.balance || nativeBalance?.amount || voucherBalance?.vcoin.balance.amount || "0",
  };
};
