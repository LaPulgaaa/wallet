'use client'

import Image from "next/image";

import { 
    Card,
    CardContent,
    CardDescription,
    CardHeader, 
    CardTitle
}
from "@/components/ui/card";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect, useState } from "react";
import SendSol from "./send_sol";
import sol from "@/public/solanaLogoMark.png";

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

    
    return (
        <div className="flex flex-col items-center space-y-12 text-center">
            {wallet.publicKey ? <Card className="">
                <CardHeader className="text-xl my-4">
                    <CardTitle className="text-center mb-2">Solana</CardTitle>
                    <CardDescription className="flex justify-center"><Image src={sol} alt="SOL Logo"/></CardDescription>
                </CardHeader>
                <CardContent className="">
                    <h2 className="text-3xl">{balance.toString()} SOL</h2>
                    <p className="text-muted-foreground text-nowrap bg-zinc-200 dark:bg-zinc-600 p-1 mt-2">{wallet.publicKey?.toBase58()}</p>
                    <div className="flex justify-between mt-4">
                        <SendSol max_bal={balance}/>
                    </div>
                </CardContent>
            </Card>: <div>Wallet not connected</div>}
        </div>
    )
}
