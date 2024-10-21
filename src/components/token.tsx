"use client"
import { useCodegenGeneratedTokenTokenMetadataByIdQuery } from "@euclidprotocol/graphql-codegen/dist/src/react";
import Image from "next/image";
import React from "react";

interface Props {
    token: string;
}

const Token: React.FC<Props> = ({ token }) => {

    const { data: metadata } = useCodegenGeneratedTokenTokenMetadataByIdQuery({
        variables: {
            token_token_metadata_by_id_token_id: token,
        },
    });

    return (
        <div className="flex flex-row items-center gap-x-2">
            <Image src={metadata?.token?.token_metadata_by_id?.image || "/logo.png"} alt={metadata?.token?.token_metadata_by_id?.tokenId ?? "token"} width={20} height={20} />
            <div className="text-sm">{metadata?.token?.token_metadata_by_id?.displayName}</div>
        </div>
    );
};

export default Token;
