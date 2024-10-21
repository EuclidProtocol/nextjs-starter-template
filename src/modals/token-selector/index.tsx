"use client";
import React, { useState } from "react";
import { useTokenSelectorModalStore } from "./state";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import Token from "@/src/components/token";
import { Input } from "@/src/components/ui/input";

function TokenSelectorModal() {
    const { isModalOpen, onCloseModal, tokens, title, description, onTokenSelect } = useTokenSelectorModalStore();

    const [search, setSearch] = useState("");

    const handleTokenSelect = (token: string) => {
        onTokenSelect(token);
        onCloseModal();
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onCloseModal}>
            <DialogContent className="">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={description}
                    />
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4 overflow-auto pl-4">
                        {tokens.filter(t => search ? t.includes(search) : true)?.map((token) => (
                            <div key={token} onClick={() => handleTokenSelect(token)} className="bg-slate-800/50 rounded-md p-2 cursor-pointer hover:bg-slate-800/70">
                                <Token
                                    key={token}
                                    token={token}
                                />
                            </div>
                        ))}
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
}

export default TokenSelectorModal;
