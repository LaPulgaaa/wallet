import { z } from "zod";

import Image from "next/image";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SendIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import sol from "@/public/solanaLogoMark.png";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram, Transaction ,LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useToast } from "@/hooks/use-toast";

const send_sol_form_schema = z.object({
    recipient_addr: z.string().min(43,{ message: "Enter valid address" }),
    amount: z.string(),
});

type FormValue = z.output<typeof send_sol_form_schema>;

export default function SendSol({max_bal}:{max_bal: number}){
    const { toast } = useToast();
    const wallet  = useWallet();
    const { connection } = useConnection();
    const form_details = useForm<FormValue>({
        resolver: zodResolver(send_sol_form_schema),
        defaultValues:{
            recipient_addr: "",
            amount: "1",
        }
    });

    async function onSubmit(form_details: FormValue){
        if(wallet.publicKey === null)
            return ;
        try{
            const {blockhash} = await connection.getLatestBlockhash();
            const to_pub_key = new PublicKey(form_details.recipient_addr);
            const tx = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: wallet.publicKey,
                    toPubkey: to_pub_key,
                    lamports: Number.parseInt(form_details.amount)*LAMPORTS_PER_SOL
                })
            );
            tx.recentBlockhash = blockhash;
            tx.feePayer = wallet.publicKey;
            await wallet.sendTransaction(tx,connection);
            toast({
                title: "Transaction Successful"
            });
        }catch(err){
            console.log(err);
        }
    }

    const { handleSubmit, control } = form_details;
    return (
        <Dialog>
            <DialogTrigger>
                <div className="flex flex-col items-center cursor-pointer bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 hover:dark:bg-zinc-900  m-4 py-2 px-1 w-[100px] rounded-lg ease-out transition-all duration-200">
                <div className=""><SendIcon/></div>
                <p className="text-sm text-muted-foreground mt-1">Send</p>
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader className="my-4">
                    <DialogTitle className="text-center mb-4">Send SOL</DialogTitle>
                    <DialogDescription className="flex justify-center"><Image src={sol} alt="solana"/></DialogDescription>
                </DialogHeader>
                <div>
                <Form {...form_details}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col w-full justify-between items-center space-y-2">
                        <FormField
                        control={control}
                        name="recipient_addr"
                        render={({field})=>(
                            <FormItem
                            className="w-full"
                            >
                                <FormControl>
                                    <Input
                                    type="text"
                                    {...field}
                                    placeholder="Recipient's Solana Devnet address"
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={control}
                        name="amount"
                        render={({field})=>(
                            <FormItem
                            className="w-full"
                            >
                                <FormControl>
                                    <Input
                                    type="number"
                                    {...field}
                                    placeholder="Amount"
                                    />
                                </FormControl>
                                <FormMessage/>
                                <FormDescription>
                                    Maximum amount {max_bal}
                                </FormDescription>
                            </FormItem>
                            
                        )}
                        />
                        </div>
                        <DialogFooter>
                            <Button className="w-full mt-4" type="submit" variant={"secondary"}>Send</Button>
                        </DialogFooter>
                    </form>
                </Form>
                </div>
            </DialogContent>
        </Dialog>
    )
}