"use client"

import React from "react";
import { Button } from "../ui/button";
import { useWalletModalStore } from "@/src/modals/wallet/state";
import { useWalletStore } from "@/src/zustand/wallet";
import ChainHorizontal from "../ChainHorizontal";
import { ChevronDown } from "lucide-react";

export default function Navbar() {
    const { onModalStateChange } = useWalletModalStore()
    const { isConnected, chain } = useWalletStore()
    return (
        <div className="flex flex-row items-center bg-slate-500/10 backdrop-blur-md py-3 px-6">
            <h3 className="text-md">Euclid Nextjs Starter</h3>
            <div className="flex-1 flex flex-row items-center justify-end">
                <Button onClick={() => onModalStateChange(true)} >{(isConnected && chain?.chain_uid) ?
                    <div className="flex flex-row items-center gap-x-2">
                        <ChainHorizontal chain_uid={chain?.chain_uid} />
                        <ChevronDown className="h-4 w-4" />
                    </div> : "Connect Wallet"}</Button>
            </div>
        </div>
    )
}