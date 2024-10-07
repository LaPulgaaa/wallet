'use client'

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useEffect } from "react";

export default function Home(){
    const wallet = useWallet();
    const { connection } = useConnection();
    let balance;

    useEffect(()=>{
        async function get_balance(){
            if(wallet.publicKey)
            balance = await connection.getBalance(wallet.publicKey);
        }
    },[wallet.publicKey])
    
    return (
        <div className="flex flex-col items-center space-y-12">
            
        </div>
    )
}
