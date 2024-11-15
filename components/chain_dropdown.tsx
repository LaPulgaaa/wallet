'use client'

import Image from "next/image";

import { 
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from "./ui/select";

import { useRecoilState } from "recoil";
import { chainState } from "@/store/atoms/chain";

import Sol from "@/public/solanaLogo.png";
import Eth from "@/public/ethlogo.png";

type Chains = 'SOL' | 'ETH';
export default function ChainDropdown(){
  const [chain,setChain] = useRecoilState(chainState);

  return (
    <Select
    onValueChange={(e: Chains)=>{
      setChain(e);
    }}
    defaultValue={chain}
    >
      <SelectTrigger id="Chain">
        <SelectValue placeholder="Chain" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="SOL"><Image src={Sol} alt="SOL"/></SelectItem>
        <SelectItem value="ETH"><Image src={Eth} alt="SOL"/></SelectItem>
      </SelectContent>
    </Select>
  )
}