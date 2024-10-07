'use client'

import { 
    Card,
    CardContent,
    CardHeader 
}
from "@/components/ui/card";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect, useState } from "react";

export default function Home(){
    const wallet = useWallet();
    const { connection } = useConnection();
    const [balance,setBalance] = useState<number>(0);

    useEffect(()=>{
        async function get_balance(){
            if(wallet.publicKey)
            {
                const balance = await connection.getBalance(wallet.publicKey)/LAMPORTS_PER_SOL;
                setBalance(balance);
            }
        }

        get_balance();
    },[wallet.publicKey])

    console.log(balance)
    
    return (
        <div className="flex flex-col items-center space-y-12 text-center">
            {wallet.publicKey ? <Card className="">
                <CardHeader className="text-xl">Solana</CardHeader>
                <CardContent className="">
                    <h2 className="text-3xl">{balance.toString()} SOL</h2>
                    <p className="text-muted-foreground text-nowrap bg-zinc-200 dark:bg-zinc-600 p-1 mt-2">{wallet.publicKey?.toBase58()}</p>
                </CardContent>
            </Card>: <div>Wallet not connected</div>}
        </div>
    )
}
