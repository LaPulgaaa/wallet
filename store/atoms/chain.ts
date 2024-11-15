import { atom } from "recoil";

type Chain = "SOL" | "ETH";
export const chainState = atom<Chain>({
    key: "chainState",
    default: "SOL"
})