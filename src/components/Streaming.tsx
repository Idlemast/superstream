import { useRef, useState, useEffect } from "react"
import { PROVIDERS } from "./Config"

export default function StreamingView({ movie, onBack, onDetail }) {
  const [providerId, setProviderId] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [theater, setTheater] = useState(false);
  const iframeRef = useRef(null);

  const provider = PROVIDERS[providerId];
  useEffect(() => { setLoaded(false); }, [providerId]);

  return (
    <>
      <div
        className={`mx-auto transition-all duration-300 ${ theater ? "max-w-full p-0" : "max-w-3xl px-6" }`}>
        {/* Top bar */}
        {!theater && (
          <div className="flex items-center gap-3.5 mb-5 flex-wrap">
            <button className="btn px-5 py-2 rounded-full text-sm bg-neutral-900 border-2 border-solid border-gray-800 text-white" onClick={onBack}>
              ← Retour
            </button>
            <div className="flex-1">
              <h2 className="serif" style={{ fontSize: "clamp(16px, 3vw, 22px)" }}>{movie.title}</h2>
              <p className="text-xs text-zinc-500">{movie.release_date?.split("-")[0]}</p>
            </div>
            <button
              className="btn px-4 py-2 rounded-full text-xs bg-transparent border-2 border-solid border-orange-300 text-orange-300" onClick={() => onDetail(movie)}>
              ℹ Détails
            </button>
          </div>
        )}

        {/* Player */}
        <div
          className={`overflow-hidden bg-black shadow-2xl shadow-black ${ theater ? "rounded-none border-none" : "rounded-2xl border-0 border-solid border-gray-800"}`}>

          {/* Controls bar */}
          <div
            className="flex items-center gap-2.5 flex-wrap px-4 py-2.5 bg-neutral-900 border-b-2 border-solid border-gray-800">
            <div className="flex rounded-lg overflow-hidden border-2 border-solid border-gray-900">
              {PROVIDERS.map((p, i) => (
                <button
                  key={p.label}
                  className={`btn px-3.5 py-1.5 text-xs font-medium ${providerId === i ? "bg-orange-300 text-black" : "bg-transparent text-zinc-500"}`} onClick={() => setProviderId(i)}>
                  {p.label}
                </button>
              ))}
            </div>

            <div className="flex-1" />

            <button
              className={`btn px-3.5 py-1.5 rounded-lg text-xs bg-transparent border-2 border-solid border-gray-900 ${ theater ? "text-orange-300" : "text-zinc-500" }`} onClick={() => setTheater(v => !v)}>
              {theater ? "⊠ Quitter cinéma" : "⊡ Mode cinéma"}
            </button>
            <button
              className="btn px-3.5 py-1.5 rounded-lg text-xs bg-transparent border-2 border-solid border-gray-900 text-zinc-500" onClick={() => iframeRef.current?.requestFullscreen()}
            >
              ⛶ Plein écran
            </button>
          </div>

          {/* iFrame */}
          <div className="relative aspect-video">
            {!loaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 bg-black">
                <span className="text-5xl">🎬</span>
                <p className="serif text-lg text-orange-500">Chargement…</p>
                <p className="text-xs text-zinc-500">Source : {provider.label}</p>
              </div>
            )}
            <iframe
              ref={iframeRef}
              key={`${movie.id}-${providerId}`}
              src={provider.url(movie.id)}
              onLoad={() => setLoaded(true)}
              allowFullScreen
              allow="autoplay; fullscreen; picture-in-picture"
              className="w-full h-full border-none block"
              title={movie.title}
            />
          </div>

          {/* Footer */}
          <div className="flex items-center gap-3 flex-wrap px-4 py-2.5 bg-zinc-900">
            <span className="text-xs text-zinc-500">
              ⚠ Si le lecteur ne charge pas, essayez un autre provider.
            </span>
            <div className="flex-1" />
            <span className="text-xs text-zinc-500">
              Source : <span className="text-orange-300">{provider.label}</span>
            </span>
          </div>
        </div>

        {/* Theater overlay */}
        {theater && (
          <div className="fixed bottom-5 right-5 z-50 flex gap-2">
            <button className="btn px-5 py-2.5 rounded-full text-sm backdrop-blur-sm bg-black border-2 border-solid border-orange-300 text-orange-300" onClick={() => setTheater(false)}>
              ⊠ Quitter cinéma
            </button>
            <button className="btn px-5 py-2.5 rounded-full text-sm backdrop-blur-sm bg-black border-2 border-solid border-gray-900 text-white" onClick={onBack}>
              ← Retour
            </button>
          </div>
        )}
      </div>
    </>
  );
}