'use client'

import { WalletDisconnectButton, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";

export default function WalletButton(){
    const wallet = useWallet();
    
    return (
        <div className="flex flex-col items-center space-y-12">
            <div className="flex justify-between w-full">
                {
                    wallet.connected === false ? <WalletMultiButton/>
                    : <WalletDisconnectButton/>
                }
            </div>
            
        </div>
    )
}
