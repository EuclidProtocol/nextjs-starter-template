import type { Keplr, Key } from "@keplr-wallet/types";
import { create } from "zustand";
import {
    ExecuteInstruction,
} from "@cosmjs/cosmwasm-stargate";
import { EncodeObject } from "@cosmjs/proto-signing";
import {
    GasPrice,
} from "@cosmjs/stargate";
import { toast } from "sonner";
import { gqlClient } from "@/lib/gql/client";
import {
    ICodegenGeneratedChainsChainConfigQuery,
    ICodegenGeneratedChainsKeplrConfigQuery,
    refetchCodegenGeneratedChainsChainConfigQuery,
    refetchCodegenGeneratedChainsKeplrConfigQuery,
} from "@euclidprotocol/graphql-codegen/dist/src/react";
import { IKeplr } from "@euclidprotocol/graphql-codegen";
import createClient, { ChainClient } from "@andromedaprotocol/andromeda.js/dist/clients";


export interface IWalletStore {
    client?: ChainClient;
    isConnected: boolean;
    isLoading: boolean;
    wallet?: Key;
    config?: IKeplr;
    chain?: {
        chain_uid: string;
        chain_id: string;
        factory_address: string;
    };
    autoconnect: boolean;
    keplr?: Keplr
}

const keplrKeystoreChange = async () => {
    const state = useWalletStore.getState();
    if (
        state.autoconnect &&
        state.config &&
        state.isConnected &&
        !state.isLoading &&
        state.chain
    ) {
        await connectClient(state.chain.chain_uid);
    }
};


export const useWalletStore = create<IWalletStore>(() => ({
    isConnected: false,
    isLoading: false,
    autoconnect: false,
}));

export const connectClient = async (
    chain_uid: string,
) => {
    try {
        const state = useWalletStore.getState();
        const keplr = state.keplr;
        if (!keplr) throw new Error("Keplr not initiated!")
        // Fetch the chain config
        const { chain_id, factory_address } = await gqlClient
            .query<ICodegenGeneratedChainsChainConfigQuery>(
                refetchCodegenGeneratedChainsChainConfigQuery({
                    chains_chain_config_chain_uid: chain_uid,
                })
            )
            .then((res) => res.data.chains.chain_config);


        // If client is already loading, please wait for next request
        if (state.isLoading) return;

        useWalletStore.setState({ isLoading: true });

        // Fetch keplr config for the chain
        const config = await gqlClient
            .query<ICodegenGeneratedChainsKeplrConfigQuery>(
                refetchCodegenGeneratedChainsKeplrConfigQuery({
                    chains_keplr_config_chain_id: chain_id,
                })
            )
            .then((res) => res.data.chains.keplr_config)
            .catch((err) => {
                console.log(err);
                throw err;
            });

        const {
            chainID,
            chainName,
            rest,
            rpc,
            bech32Config,
            currencies,
            feeCurrencies,
            stakeCurrency,
        } = config;

        // For chains that are not supported by keplr, we need to suggest the chain
        await keplr.experimentalSuggestChain({
            chainId: chainID,
            chainName: chainName,
            rpc: rpc,
            rest: rest,
            bip44: { coinType: 118 },
            bech32Config: {
                bech32PrefixAccAddr: bech32Config.bech32PrefixAccAddr,
                bech32PrefixAccPub: bech32Config.bech32PrefixAccPub,
                bech32PrefixConsAddr: bech32Config.bech32PrefixConsAddr,
                bech32PrefixConsPub: bech32Config.bech32PrefixConsPub,
                bech32PrefixValAddr: bech32Config.bech32PrefixValAddr,
                bech32PrefixValPub: bech32Config.bech32PrefixValPub,
            },
            currencies: currencies.map((currency) => ({
                coinDenom: currency.coinDenom,
                coinMinimalDenom: currency.coinMinimalDenom,
                coinDecimals: currency.coinDecimals,
            })),
            feeCurrencies: feeCurrencies.map((feeCurrency) => ({
                coinDenom: feeCurrency.coinDenom,
                coinMinimalDenom: feeCurrency.coinMinimalDenom,
                coinDecimals: feeCurrency.coinDecimals,
                gasPriceStep: {
                    low: feeCurrency.gasPriceStep.low,
                    average: feeCurrency.gasPriceStep.average,
                    high: feeCurrency.gasPriceStep.high,
                },
            })),
            stakeCurrency: {
                coinDenom: stakeCurrency.coinDenom,
                coinMinimalDenom: stakeCurrency.coinMinimalDenom,
                coinDecimals: stakeCurrency.coinDecimals,
            },
            // Cosmwasm and IBC are required for Euclid so keplr can enable related interfaces in extension
            features: ["cosmwasm", "ibc-transfer", "ibc-go"],
        });
        await keplr.enable(config!.chainID);
        const walletKey = await keplr.getKey(config.chainID);
        const signer = await keplr.getOfflineSignerAuto(config.chainID);

        const addressPrefix = config.bech32Config.bech32PrefixAccAddr;
        const client = createClient(addressPrefix);
        // @ts-expect-error Signer is not typed
        await client.connect(config.rpc, signer, {
            gasPrice: GasPrice.fromString(
                feeCurrencies[0].gasPriceStep.average + config.feeCurrencies[0].coinMinimalDenom
            )
        });

        useWalletStore.setState({
            client,
            isConnected: true,
            isLoading: false,
            wallet: walletKey,
            config: config,
            autoconnect: true,
            chain: {
                chain_id,
                chain_uid,
                factory_address,
            },
        });

        toast.success(`Connected to ${config.chainName} and wallet`);

    } catch (error) {
        console.error(`Error suggesting or enabling ${chain_uid}:`, error);
        // @ts-expect-error Error is not typed
        toast.error(`Error suggesting or enabling ${chain_uid}: ${error.message}`);
        useWalletStore.setState({ isLoading: false });
        throw error;
    }
};

export const disconnectClient = () => {
    const state = useWalletStore.getState();

    if (state.client) {
        state.client.disconnect();
    }
    useWalletStore.setState({
        isConnected: false,
        client: undefined,
        wallet: undefined,
        autoconnect: false,
        config: undefined,
        chain: undefined,
    });
};


export function initiateKeplr() {
    const state = useWalletStore.getState();
    if (window.keplr) {
        state.keplr = window.keplr;
        useWalletStore.setState(state);
        return;
    }
    const documentStateChange = (event: Event) => {
        if (event.target && (event.target as Document).readyState === "complete") {
            if (window.keplr) {
                window.addEventListener("keplr_keystorechange", keplrKeystoreChange);
            }
            if (window.keplr && !state.keplr) {
                state.keplr = window.keplr;
                useWalletStore.setState(state);
            }
            document.removeEventListener("readystatechange", documentStateChange);
        }
    };
    document.addEventListener("readystatechange", documentStateChange);
}

export const signAndBroadcastExecute = async (
    msgs: ExecuteInstruction[],
    memo?: string
) => {
    const { client } = useWalletStore.getState();
    const encodedMsgs: EncodeObject[] = msgs.map((msg) => client!.encodeExecuteMsg(msg.contractAddress, msg.msg, [...msg.funds ?? []]));
    return client!.signAndBroadcast(
        encodedMsgs,
        "auto",
        memo
    );
};
