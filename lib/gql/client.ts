import { ApolloClient, InMemoryCache } from "@apollo/client";
import TypePolicy from "@euclidprotocol/graphql-codegen"


const cache = new InMemoryCache({
    // 'addTypename': false,

    typePolicies: TypePolicy,
});

export const gqlClient = new ApolloClient({
    uri: process.env.NEXT_PUBLIC_GQL_URL,
    ssrMode: true,
    cache: cache,
});
