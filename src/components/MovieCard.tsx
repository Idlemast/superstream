import { useState } from "react"
import { IMG } from "./config"

export default function MovieCard({ movie, onClick }) {
  const [err, setErr] = useState(false);
  const src  = movie.poster_path && !err ? `${IMG}/w342${movie.poster_path}` : null;
  const year = movie.release_date?.split("-")[0];

  return (
    <div className="hoverable cursor-pointer rounded-xl overflow-hidden bg-neutral-900 border-2 border-solid border-gray-800" onClick={() => onClick(movie)}>
      <div className="relative overflow-hidden aspect-2/3 bg-zinc-900">
        {src
          ? <img className="w-full h-full object-cover block" src={src} alt={movie.title} onError={() => setErr(true)} />
          : <div className="w-full h-full flex items-center justify-center text-4xl opacity-15">🎬</div>
        }
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 55%)" }} />
        {year && (
          <span className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full bg-black border-2 border-solid border-gray-800 text-zinc-500">
            {year}
          </span>
        )}
      </div>
      <div className="px-3 py-2.5">
        <p className="serif text-sm font-bold leading-tight text-white">{movie.title}</p>
      </div>
    </div>
  );
}