import { ExecuteInstruction } from "@cosmjs/cosmwasm-stargate";
import { ITokenType } from "@euclidprotocol/graphql-codegen";


export interface TxResult {
    chain_id: string;
    contract: string;
    msgs: ExecuteInstruction[];
    rest_url: string;
    rpc_url: string;
    sender: {
        address: string;
        chain_uid: string;
    };
}

export interface TokenWithDenom {
    token: string;
    token_type: ITokenType;
}


export interface CrossChainUserWithLimit {
    limit?: string | null;
    user: CrossChainUser;
}

export interface CrossChainUser {
    address: string;
    chain_uid: string;
}