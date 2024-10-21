"use client"
import React from "react";
import Image from "next/image";
import { useCodegenGeneratedChainsChainConfigQuery } from "@euclidprotocol/graphql-codegen/dist/src/react";

interface Props {
    chain_uid: string;
}

const ChainHorizontal: React.FC<Props> = ({ chain_uid }) => {
    const { data: chainData } = useCodegenGeneratedChainsChainConfigQuery({
        variables: {
            chains_chain_config_chain_uid: chain_uid,
        },
    });

    const logo = chainData?.chains?.chain_config?.logo || "";
    const displayName =
        chainData?.chains?.chain_config?.display_name || chain_uid;

    return (
        <div className="flex flex-row items-center gap-x-2">
            {logo && (
                <div className="bg-white p-1 rounded-full">
                    <Image src={logo} alt={displayName} width={20} height={20} />
                </div>
            )}
            <div className="text-sm">{displayName}</div>
        </div>
    );
};

export default ChainHorizontal;
