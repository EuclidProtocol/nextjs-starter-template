"use client";
import { gqlClient } from "@/lib/gql/client";
import reactQueryClient from "@/lib/react-query/client";
import {
    initiateKeplr,
} from "@/src/zustand/wallet";
import { ApolloProvider } from "@apollo/client";
import { QueryClientProvider } from "@tanstack/react-query";

import React, { FC, ReactNode, useLayoutEffect } from "react";

interface Props {
    children?: ReactNode;
}

const Providers: FC<Props> = (props) => {
    const { children } = props;

    useLayoutEffect(() => {
        initiateKeplr();
    }, []);

    return (
        <ApolloProvider client={gqlClient}>
            <QueryClientProvider client={reactQueryClient}>
                {children}
            </QueryClientProvider>
        </ApolloProvider>
    );
};

export default Providers;
