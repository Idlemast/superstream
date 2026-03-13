import { useState } from "react"

export default function Navbar({ onHome, onKeyChange }) {
    const [editing, setEditing] = useState(false);
    const [input, setInput] = useState("");
    const hasKey = !!localStorage.getItem("tmdb_key");

    const save = () => {
        const k = input.trim();
        if (!k) return;
        localStorage.setItem("tmdb_key", k);
        setEditing(false);
        setInput("");
        onKeyChange();
    };

    return (
        <nav className="sticky top-0 z-50 bg-neutral-950 backdrop-blur-lg border-b-2 border-solid border-gray-800 py-0 px-6 flex items-center h-16 gap-3 flex-wrap">
            <button className="btn flex items-center gap-2" onClick={onHome}>
                <span className="text-lg md:text-xl text-orange-300 font-bold">Super</span>
                <span className="text-lg md:text-xl text-white">Stream</span>
            </button>
            <div className="flex-1" />
            {editing ? (
                <div className="flex gap-2 items-center">
                    <input className="bg-zinc-900 border-solid border-2 border-orange-300 text-stone-200 py-1.5 px-3 rounded-md text-sm outline-none w-20 md:w-56"
                        autoFocus value={input} placeholder="Colle ta clé TMDB..." 
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && save()}
                    />
                    <button className="btn bg-orange-300 text-black py-1.5 px-3 rounded-md text-sm font-semibold" onClick={save}>
                        OK
                    </button>
                    <button className="btn bg-transparent text-zinc-500 border-solid border-2 border-zinc-500 py-1.5 px-3 rounded-md text-sm" onClick={() => setEditing(false)}>
                        ✕
                    </button>
                </div>
            ) : (
                <button className={`btn py-1.5 px-3 rounded-md text-sm ${ hasKey ? "bg-transparent border-solid border-2 border-gray-800 text-zinc-500" : "bg-orange-300 border-none text-black" }`} onClick={() => setEditing(true)}>
                    {hasKey ? "🔑 Changer la clé" : "🔑 Entrer la clé TMDB"}
                </button>
            )}
        </nav>
    );
}