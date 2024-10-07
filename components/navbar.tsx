import Link from "next/link";

import {ModeToggle} from "@/components/mode"
import { BoxModelIcon } from "@radix-ui/react-icons";
import WalletButton from "./wallet_button";

export default function Navbar(){
    return (
        <div className="absolute sticky top-0 z-[50] w-full backdrop-blur mt-2">
            <div className="container flex justify-between h-14 max-w-screen-2xl items-center">
                <div className="mr-4 flex">
                    <Link 
                    className="mr-4 flex items-center space-x-2 lg:mr-6"
                    href="/">
                        <BoxModelIcon/>
                        <span className="font-bold">Schoolbox</span>
                    </Link>
                </div>
                <div className="flex space-x-4">
                    <div className="mt-1"><ModeToggle/></div>
                    <WalletButton/>
                </div>
            </div>
        </div>
    )
}