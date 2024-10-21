import { ITokenType } from "@euclidprotocol/graphql-codegen";

export const getDenomFromTokenType = (tokenType?: ITokenType) => {
    if (!tokenType) return "";
    if ("voucher" in tokenType) {
        return "";
    } else if ("native" in tokenType) {
        return tokenType.native.denom;
    } else {
        return tokenType.smart.contract_address;
    }
};

export const getKeyFromTokenType = (tokenType?: ITokenType) => {
    if (!tokenType) return "";
    if ("voucher" in tokenType) {
        return "voucher";
    } else if ("native" in tokenType) {
        return "native:" + tokenType.native.denom;
    } else {
        return "smart:" + tokenType.smart.contract_address;
    }
};

export const getTokenType = (tokenType?: ITokenType) => {
    if (!tokenType) return "";
    if ("voucher" in tokenType) {
        return "voucher";
    } else if ("native" in tokenType) {
        return "native";
    } else {
        return "smart";
    }
};