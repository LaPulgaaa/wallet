import Sidebar from "./sidebar";

export default function HomeLayout({children}:{children: React.ReactNode}){
    return (
        <section className="flex h-full mt-24 px-8 divide-x space-x-4 w-full">
            <div className="w-1/6"><Sidebar/></div>
            <div className="px-6 w-full flex justify-center">
                {children}
            </div>
        </section>
    )
}