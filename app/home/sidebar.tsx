import { CoinsIcon, LucideHome, TicketIcon, Wallet } from "lucide-react";
import Link from "next/link";


type SidebarProps = {
    key: number,
    title: string,
    path: string,
    icon?:React.ReactElement
}[];

const sidebar_props:SidebarProps = [
    {
        key: 0,
        title: "Home",
        path: "/home",
        icon: <LucideHome/>
    },
    {
        key: 1,
        title: "Wallet",
        path: "/home/wallet",
        icon: <Wallet/>
    },
    {
        key: 2,
        title: "Token",
        path: "/home/token",
        icon: <TicketIcon/>
    },
    {
        key: 3,
        title: "Airdrop",
        path: "/home/airdrop",
        icon: <CoinsIcon/>
    }
]


export default function Sidebar(){
    return(
        <div className="flex flex-col divide-y text-center space-y-1">
            {
                sidebar_props.map((prop) => {
                    return(
                        <Link
                        key={prop.key}
                        href={prop.path}
                        className="py-2 px-4 cursor-pointer rounded-md dark:hover:bg-gray-800 hover:bg-gray-500 ease-out transition-all duration-300"
                        >
                            <div className="flex space-x-2">
                            <div className="">{prop?.icon}</div>
                            <div className="lg:block hidden pl-2">{prop.title}</div>
                            </div>
                        </Link>
                    )
                })
            }
        </div>
    )
}