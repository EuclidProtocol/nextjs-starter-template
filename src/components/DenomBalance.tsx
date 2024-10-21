import React from "react";
import { useCodegenGeneratedTokenTokenMetadataByIdQuery } from "@euclidprotocol/graphql-codegen/dist/src/react";
import { ITokenType } from "@euclidprotocol/graphql-codegen";
import { convertMicroToMacro, formatAmountToInternational, UNITS } from "@andromedaprotocol/andromeda.js";
import { useGetBalance } from "../hooks/useGetBalance";


interface BalanceValueProps {
  tokenId: string;
  selectedDenom: ITokenType | null;
  onMax?: (microValue: string, decimals: UNITS) => void;
}

export const BalanceValue: React.FC<BalanceValueProps> = ({
  tokenId,
  selectedDenom,
  onMax,
}) => {
  const { data: balance } = useGetBalance(selectedDenom, tokenId);

  const { data: metdata } = useCodegenGeneratedTokenTokenMetadataByIdQuery({
    variables: {
      token_token_metadata_by_id_token_id: tokenId,
    },
  });

  const decimals = metdata?.token?.token_metadata_by_id?.coinDecimal ?? 6;

  const macroBalance = formatAmountToInternational(
    convertMicroToMacro(balance, decimals),
    2
  );

  return (
    <div className="flex flex-row gap-x-4">
      <div className="flex flex-row items-center gap-2 text-sm">
        <div className="text-opacity-50 text-white">In wallet:</div>
        <div>{macroBalance}</div>
      </div>
      {onMax && (
        <div
          className="ml-2 font-bold text-sm cursor-pointer underline "
          onClick={() => onMax(balance, decimals)}
        >
          Max
        </div>
      )}
    </div>
  );
};
