"use client"
import React, { useCallback, useState } from "react"
import { Button, ButtonProps } from "@/src/components/ui/button";
import { Loader2 } from "lucide-react";

interface Props extends ButtonProps {
    isLoading?: boolean
    replaceChildrenOnLoading?: boolean
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>
}

const PromiseButton = React.forwardRef<any, Props>(function PromiseButton(props, ref) {
    const { children, onClick, disabled, isLoading, replaceChildrenOnLoading = false, ...buttonProps } = props;
    const [loading, setLoading] = useState(false);

    const promiseOnClick: NonNullable<typeof onClick> = useCallback(async (e) => {
        if (loading) return;
        try {
            setLoading(true);
            await onClick?.(e)
        } finally {
            setLoading(false);
        }
    }, [onClick])

    const loadingState = loading || isLoading
    return (
        <Button
            onClick={promiseOnClick}
            disabled={loading || disabled || isLoading}
            ref={ref}
            {...buttonProps}>
            {loadingState && (
                <Loader2 className={`h-4 w-4 animate-spin ${replaceChildrenOnLoading ? "" : "mr-2"}`} />
            )}

            {(!replaceChildrenOnLoading || !loadingState) && children}
        </Button>
    )
})

export default PromiseButton