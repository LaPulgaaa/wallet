'use client'

import { Card ,CardContent,CardDescription,CardFooter,CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Airdrop(){
    const { toast } = useToast();
    
    const [amount,setAmount] = useState<string>("0.5");
    const [disabled,setDisabled] = useState<boolean>(true);
    const { connection } = useConnection();
    const wallet = useWallet();
    const [address,setAddress] = useState<string>("");
    useEffect(()=>{
        if(address.trim() !== "" && address.length === 44){
            setDisabled(false);
        }
        else
        setDisabled(true);
    },[address]);

    async function request_airdrop(){
        try{
            if(wallet.publicKey === null)
                throw new Error("Wallet not connected");
            const resp = await connection.requestAirdrop(wallet.publicKey,Number.parseInt(amount)*1000000000);
            toast({
                title: "Airdrop successfull",
                description: `${resp} is the transaction hash`,
                duration: 3000
            })
        }catch(err){
            toast({
                variant: "destructive",
                title: "Error!",
                description: "Could not complete airdrop",
                duration: 3000
            })
            console.log(err);
        }
    }
    return(
        <Card className="w-full justify-center">
            <CardHeader>
                <CardTitle>
                <h2 className="scroll-m-20 pb-2 text-2xl tracking-tight">
                  Request Airdrop
                </h2>
                </CardTitle>
                <CardDescription>Airdrop yourself and your friends some dev SOLs</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
                    <div className="w-full flex justify-between space-x-1">
                        <Input
                        className="w-4/5"
                        placeholder="Wallet Address"
                        value={address}
                        onChange={(e)=>{
                            setAddress(e.target.value);
                        }}
                        />
                        <div className="w-1/5">
                        <Select
                        onValueChange={(e)=>{
                            setAmount(e)
                        }}
                        defaultValue={amount}
                        >
                            <SelectTrigger id="Amount">
                                <SelectValue placeholder="Amount"/>
                            </SelectTrigger>
                            <SelectContent >
                                <SelectItem value="0.5">0.5</SelectItem>
                                <SelectItem value="1.0">1.0</SelectItem>
                                <SelectItem value="1.5">1.5</SelectItem>
                                <SelectItem value="2.0">2.0</SelectItem>
                            </SelectContent>
                        </Select>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button 
                    disabled = {disabled}
                    onClick={request_airdrop}
                    className="w-full">
                        Confirm Airdrop
                    </Button>
                </CardFooter>
        </Card>
    )
}