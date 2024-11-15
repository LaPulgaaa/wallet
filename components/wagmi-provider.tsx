'use client'

import { WagmiProvider } from "wagmi"
import { config } from "@/lib/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
export default function WagmiProviderContext({children}:{children: React.ReactNode}){
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                {
                    children
                }
            </QueryClientProvider>
        </WagmiProvider>
    )
}