import restClient from "@/lib/rest";
import { useQuery } from "@tanstack/react-query";

interface Route {
    route: string[];
    amount_out: number;
}

interface IRestApiRoutes {
    paths?: Route[];
}

export const useGetRoutes = ({
    tokenIn,
    tokenOut,
    amountIn,
}: {
    tokenIn: string;
    tokenOut: string;
    amountIn: string;
}) => {
    return useQuery({
        queryKey: ["rest", "routes", { tokenIn, tokenOut, amountIn }],
        queryFn: async () => {
            const data = await restClient.post("/routes", {
                token_in: tokenIn,
                token_out: tokenOut,
                amount_in: amountIn,
            }).then((res) => res as IRestApiRoutes);
            return data;
        },
        enabled: !!tokenIn && !!tokenOut && !!amountIn,
    });
};
