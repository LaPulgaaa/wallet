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
import { Button } from "@/components/ui/button";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect, useRef, useState } from "react";
import SendSol from "./send_sol";
import sol from "@/public/solanaLogoMark.png";
import { ClipboardCopyIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Home(){
    const wallet = useWallet();
    const { connection } = useConnection();
    const [balance,setBalance] = useState<number>(0);
    const pub_key_ref = useRef<HTMLParagraphElement>(null);
    const { toast } = useToast();

    useEffect(()=>{
        async function get_balance(){
            if(wallet.publicKey)
            {
                const balance = await connection.getBalance(wallet.publicKey)/LAMPORTS_PER_SOL;
                setBalance(balance);
            }
        }

        get_balance();
    },[wallet.publicKey,connection])

    function copy_to_clipboard(){
        const pub_key_node = pub_key_ref.current;

        if(pub_key_node !== null){
            const pub_key_elem = pub_key_node.querySelector("#public_key");
            if(pub_key_elem !== null){
                navigator.clipboard.writeText(pub_key_elem.textContent ?? "").then(
                    () => {
                        toast({
                            title: "Copied to Clipboard!",
                            duration: 2000,
                        })
                    }
                )
            }
        }
    }

    return (
        <div className="flex flex-col items-center space-y-12 text-center">
            {wallet.publicKey ? <Card className="">
                <CardHeader className="text-xl my-4">
                    <CardTitle className="text-center mb-2">Solana</CardTitle>
                    <CardDescription className="flex justify-center"><Image src={sol} alt="SOL Logo"/></CardDescription>
                </CardHeader>
                <CardContent className="">
                    <h2 className="text-3xl">{balance.toString()} SOL</h2>
                    <div
                    ref={pub_key_ref}
                    className="flex w-full bg-zinc-200 dark:bg-zinc-600 rounded-md">
                    <p
                    id="public_key"
                    className="text-muted-foreground text-nowrap p-2 m-1">
                        {wallet.publicKey?.toBase58()}
                    </p>
                    <Button 
                    onClick={copy_to_clipboard}
                    className="m-2"
                    variant={"secondary"} size={"icon"}><ClipboardCopyIcon className=""/></Button>
                    </div>
                    <div className="flex justify-between mt-4">
                        <SendSol max_bal={balance}/>
                    </div>
                </CardContent>
            </Card>: <div>Wallet not connected</div>}
        </div>
    )
}
