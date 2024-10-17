'use client'

import { z } from "zod";

import { 
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,CardFooter
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { ASSOCIATED_TOKEN_PROGRAM_ID, ExtensionType, LENGTH_SIZE, TOKEN_2022_PROGRAM_ID, TYPE_SIZE, createAssociatedTokenAccountInstruction, createInitializeMetadataPointerInstruction, createInitializeMintInstruction ,createMintToInstruction,getAssociatedTokenAddressSync,getMintLen } from "@solana/spl-token"
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { pack, createInitializeInstruction } from "@solana/spl-token-metadata"
import { Textarea } from "@/components/ui/textarea";


const create_token_form = z.object({
  name: z.string().min(5),
  symbol: z.string().min(3),
  url: z.string().url(),
  decimal: z.string().min(1),
  supply: z.string().min(1),
  description: z.string(),
});

type FormValue = z.output<typeof create_token_form>;

export default function Token(){

  const {toast} = useToast();

  const form = useForm<FormValue>({
    resolver: zodResolver(create_token_form),
    defaultValues: {
      name: "",
      symbol: "",
      url: "",
      decimal: "1",
      supply: "1",
      description: "",
    },
    mode: "onChange"
  });

  const { control, formState:{isDirty, isSubmitting}, handleSubmit } = form;
  const { connection } = useConnection();
  const wallet  = useWallet();

  async function create_mint_transaction(form_details: FormValue){
    const keypair = Keypair.generate();

    if(wallet.publicKey !== null)
    {
      try{
        const metadata = {
          mint: keypair.publicKey,
          name: form_details.name,
          symbol: form_details.symbol,
          uri: "https://cdn.100xdevs.com/metadata.json",
          additionalMetadata: [["description",form_details.description] as const],
        }

        const minlen = getMintLen([ExtensionType.MetadataPointer]);
        const metadata_len = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;
        const min_lamports = await connection.getMinimumBalanceForRentExemption(minlen+metadata_len);

        const transaction = new Transaction().add(
          SystemProgram.createAccount({
            fromPubkey: wallet.publicKey,
            newAccountPubkey: keypair.publicKey,
            space: minlen,
            lamports: min_lamports,
            programId: TOKEN_2022_PROGRAM_ID,
          }),
          createInitializeMetadataPointerInstruction(
            keypair.publicKey,
            wallet.publicKey,
            keypair.publicKey,
            TOKEN_2022_PROGRAM_ID
          ),
          createInitializeMintInstruction(
            keypair.publicKey,
            Number.parseInt(form_details.decimal),
            wallet.publicKey,
            wallet.publicKey,
            TOKEN_2022_PROGRAM_ID
          ),
          createInitializeInstruction({
            programId: TOKEN_2022_PROGRAM_ID,
            mint: keypair.publicKey,
            metadata: keypair.publicKey,
            name: metadata.name,
            symbol: metadata.symbol,
            uri: metadata.uri,
            mintAuthority: wallet.publicKey,
            updateAuthority: wallet.publicKey,
          })
        );
        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = wallet.publicKey;
  
        transaction.partialSign(keypair);
        const resp = await wallet.sendTransaction(transaction,connection);
        toast({
          title: "Transaction Success!",
          duration: 3000,
          description:  `Transaction hash ${resp}`
        });

        //find/calculate associated token address from mint address, wallet address, token_id

        const asso_token_addr = getAssociatedTokenAddressSync(
          keypair.publicKey,
          wallet.publicKey,
          false,
          TOKEN_2022_PROGRAM_ID
        );

        // create associated token account
        const create_ata_tx = new Transaction().add(
          createAssociatedTokenAccountInstruction(
            wallet.publicKey,
            asso_token_addr,
            wallet.publicKey,
            keypair.publicKey,
            TOKEN_2022_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID
          )
        );

        await wallet.sendTransaction(create_ata_tx,connection);

        //mint token to wallet address
        const mint_token_tx = new Transaction().add(
          createMintToInstruction(
            keypair.publicKey,
            asso_token_addr,
            wallet.publicKey,
            Number.parseInt(form_details.supply),
            [],
            TOKEN_2022_PROGRAM_ID
          )
        );

        await wallet.sendTransaction(mint_token_tx,connection);

        toast({
          title: `Minted ${form_details.supply} ${form_details.name} tokens`,
          description: `Address: ${wallet.publicKey}`,
          duration: 5000,
        })

      }catch(err){
        console.log(err);
        toast({
          variant: "destructive",
          duration: 2000,
          title: "Transaction failed",
        })
      }
    }
    
  }

  return (
      <div className='m-18 flex  flex-col items-center'>
      <h2 className="scroll-m-20 border-b pb-2 m-6 text-3xl font-semibold tracking-tight first:mt-0 ">
        Solana Token Creator
      </h2>
      <Card className='w-full p-6'>
        <CardHeader>
          <CardTitle>Create a token</CardTitle>
          <CardDescription>Easily create your solana SPL token without coding!!</CardDescription>
        </CardHeader>
          <Form {...form}>
            <form onSubmit={handleSubmit(create_mint_transaction)}>
              <CardContent
              className="grid lg:grid-cols-2 grid-cols-1 gap-4 space-x-2 "
              >
                <FormField
                control={control}
                name="name"
                render={({field})=>(
                 <FormItem>
                   <FormLabel>Name</FormLabel>
                   <FormControl>
                     <Input
                     type="text"
                     placeholder="Put the name of your token"
                     {...field}
                     />
                   </FormControl>
                   <FormMessage/>
                 </FormItem>
                )}
                />
                <FormField
                control={control}
                name="symbol"
                render={({field})=>(
                 <FormItem>
                   <FormLabel>Symbol</FormLabel>
                   <FormControl>
                     <Input
                     type="text"
                     placeholder="Put the symbol of your token"
                     {...field}
                     />
                   </FormControl>
                   <FormMessage/>
                 </FormItem>
                )}
                />
                <FormField
                control={control}
                name="decimal"
                render={({field})=>(
                 <FormItem>
                   <FormLabel>Decimals</FormLabel>
                   <FormControl>
                     <Input
                     type = "text"
                     placeholder="Enter your initial supply"
                     {...field}
                     />
                   </FormControl>
                   <FormMessage/>
                 </FormItem>
                )}
                />
                <FormField
                control={control}
                name="supply"
                render={({field})=>(
                 <FormItem>
                   <FormLabel>Supply</FormLabel>
                   <FormControl>
                     <Input
                     type = "text"
                     placeholder="Enter your initial supply"
                     {...field}
                     />
                   </FormControl>
                   <FormMessage/>
                 </FormItem>
                )}
                />
                <FormField
                control={control}
                name="url"
                render={({field})=>(
                 <FormItem>
                   <FormLabel>Image Url</FormLabel>
                   <FormControl>
                     <Textarea
                     placeholder="Add image URL"
                     {...field}
                     />
                   </FormControl>
                   <FormMessage/>
                 </FormItem>
                )}
                />
                <FormField
                control={control}
                name="description"
                render={({field})=>(
                 <FormItem>
                   <FormLabel>Description</FormLabel>
                   <FormControl>
                     <Textarea
                     placeholder="Put the description of your token"
                     {...field}
                     />
                   </FormControl>
                   <FormMessage/>
                 </FormItem>
                )}
                />
                </CardContent>
                <CardFooter className="flex flex-col">
                  <Button 
                  disabled = {
                    !isDirty || 
                    isSubmitting
                  }
                  type="submit"
                  className='w-1/4 my-2'>Create Token</Button>
                </CardFooter>
            </form>
          </Form>
    </Card>
  </div>
  )
}
