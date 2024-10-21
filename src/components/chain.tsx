import { IChainConfig } from "@euclidprotocol/graphql-codegen";
import Image from "next/image";
import React, { FC } from "react";
import PromiseButton from "./PromiseButton";

interface Props {
  chain: IChainConfig;
  selected: boolean;
  isDisabled?: boolean;
  onClick?: () => void | Promise<void>;
}

const ChainItem: FC<Props> = (props) => {
  const { chain, selected, isDisabled, onClick } = props;

  return (
    <div className="text-center flex-col flex space-y-2 mt-1 justify-center items-center">
      <PromiseButton
        disabled={isDisabled}
        replaceChildrenOnLoading
        onClick={onClick}
        className={`h-16 w-16 flex justify-center items-center rounded-full overflow-hidden border-2 transition-transform transform ${selected ? "custom-euclid-gradient-bold-border" : "border-gray-300"
          } ${isDisabled ? "opacity-75 cursor-not-allowed" : "hover:scale-105"}`}
        variant="ghost"
      >
        <Image
          width={20}
          height={20}
          src={chain.logo || "https://via.placeholder.com/150"}
          alt={chain.display_name}
          className={`h-10 w-10 rounded-full transition-all ${isDisabled ? "filter grayscale brightness-10" : ""
            }`}
        />
      </PromiseButton>
      <div
        className={`text-sm px-3 mt-1 text-white p-1 rounded-full custom-euclid-gradient-border ${isDisabled ? "filter grayscale brightness-10" : ""
          } `}
      >
        {chain.display_name || chain.chain_uid}
      </div>
    </div>
  );
};

export default ChainItem;
