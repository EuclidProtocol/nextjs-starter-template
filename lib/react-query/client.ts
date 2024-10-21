import { shortenString } from "@/src/utils/string";
import { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const reactQueryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,
        },
        mutations: {
            onError: (err) => {
                if ("error" in err) {
                    err = err.error as Error;
                }
                let message: string =
                    // @ts-expect-error Error is not typed
                    err?.response?.data?.error ?? err.message ?? "No Description";
                if (
                    message.startsWith(
                        "Query failed with (6): rpc error: code = Unknown desc = failed to execute message; "
                    )
                ) {
                    message = message.replace(
                        "Query failed with (6): rpc error: code = Unknown desc = failed to execute message; ",
                        ""
                    );
                }
                toast.error(shortenString(message, 100));
            },
        },
    },
});

export default reactQueryClient;
