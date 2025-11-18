import { LogOut, UserRound } from "lucide-react";

export function NavBar() {
  return (
    <div className="z-10 py-5 px-10 frosted-glass bg-[rgba(255,255,255,0.2)] md:w-1/2 rounded-b-3xl m-auto flex items-center justify-between">
      <h3>Ulliri Order System</h3>
        <div className="actions flex items-center gap-4">
            <div className="flex gap-1 text-zinc-200">
                <UserRound width={20}/>
                <h3>Kristiana Trupja</h3>
            </div>
            <button className="p-2 w-fit h-fit rounded-md bg-zinc-600/80 hover:bg-zinc-600/95 active:bg-zinc-700/80 shadow-[0_0_1px_rgba(255,255,255,.5)] transition-colors">
                <LogOut width={20}/>
            </button>
        </div>
    </div>
  );
}