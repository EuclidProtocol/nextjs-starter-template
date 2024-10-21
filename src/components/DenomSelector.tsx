import React, { useEffect, useMemo } from "react";

import {
    useCodegenGeneratedFactoryEscrowQuery,
    useCodegenGeneratedTokenTokenMetadataByIdQuery,
    ISmartQueryInput,
    useCodegenGeneratedCwMulticallSmartQueriesQuery,
} from "@euclidprotocol/graphql-codegen/dist/src/react";
import { ITokenType } from "@euclidprotocol/graphql-codegen";
import { getDenomFromTokenType, getKeyFromTokenType } from "../utils/denom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface TokenDenomsProps {
    chainUId: string;
    tokenId: string;
    selectedDenom: ITokenType | undefined;
    setSelectedDenom: (denom?: ITokenType) => void;
    isdepositToken?: boolean;
}

interface TokenInfoResponse {
    symbol: string;
}


export const DenomSelector: React.FC<TokenDenomsProps> = ({
    selectedDenom,
    chainUId,
    tokenId,
    setSelectedDenom,
    isdepositToken = false,
}) => {
    const { data: denomsData } = useCodegenGeneratedFactoryEscrowQuery({
        variables: {
            chain_uid: chainUId,
            factory_escrow_token_id: tokenId,
        },
        skip: !chainUId || !tokenId,
    });

    const denoms = useMemo(() => {
        if (isdepositToken) {
            return denomsData?.factory?.escrow?.denoms ?? [];
        }
        return (denomsData?.factory?.escrow?.denoms ?? []).concat({ voucher: {} });
    }, [denomsData, isdepositToken]);

    const { data: tokenMetadata } =
        useCodegenGeneratedTokenTokenMetadataByIdQuery({
            variables: {
                token_token_metadata_by_id_token_id: tokenId,
            },
        });

    const denomInfoMultiCallQuery: ISmartQueryInput[] = useMemo(
        () =>
            denoms.map((denom) => ({
                contract_address: getDenomFromTokenType(denom),
                // CW20 query msg for getting token info
                msg: { token_info: {} },
            })) ?? [],
        [denoms]
    );

    const { data: denomMultiCall } =
        useCodegenGeneratedCwMulticallSmartQueriesQuery({
            variables: {
                chain_uid: chainUId,
                cw_multicall_smart_queries_queries: denomInfoMultiCallQuery,
            },
            skip: !chainUId || denomInfoMultiCallQuery.length === 0,
        });

    useEffect(() => {
        setSelectedDenom(denoms[0]);
    }, [denoms]);

    const handleDenomsChange = (denomKey: string) => {
        const value = denoms.find((d) => getKeyFromTokenType(d) === denomKey);
        if (value) {
            setSelectedDenom(value);
        }
    };

    return (
        <div className="flex flex-row gap-x-4  ">
            <Select
                value={getKeyFromTokenType(selectedDenom)}
                onValueChange={handleDenomsChange}
            >
                <SelectTrigger className="bg-white euclid-gradient-border-grey bg-opacity-5 border">
                    <SelectValue placeholder={"Unsupported Denom"} />
                </SelectTrigger>
                <SelectContent>
                    {denoms.map((denom, index) => {
                        const typeText =
                            "native" in denom
                                ? denom.native.denom.startsWith("ibc/")
                                    ? "IBC"
                                    : "Native"
                                : "smart" in denom
                                    ? "Smart"
                                    : "Voucher";

                        const tokenInfo: TokenInfoResponse | undefined =
                            denomMultiCall?.cw_multicall?.smart_queries?.results?.[index]
                                ?.success;

                        const displayValue =
                            tokenInfo?.symbol ||
                            tokenMetadata?.token?.token_metadata_by_id?.displayName;

                        return (
                            <SelectItem
                                key={getKeyFromTokenType(denom)}
                                value={getKeyFromTokenType(denom)}
                            >
                                <div className="flex flex-row gap-2 justify-between w-full  items-center  ">
                                    <span className="flex-1">{displayValue}</span>
                                    <span
                                        className={`badge ${"native" in denom
                                            ? "badge-native"
                                            : "voucher" in denom
                                                ? "badge-voucher"
                                                : "badge-smart"
                                            }`}
                                    >
                                        {typeText}
                                    </span>
                                </div>
                            </SelectItem>
                        );
                    })}
                </SelectContent>
            </Select>
        </div>
    );
};
