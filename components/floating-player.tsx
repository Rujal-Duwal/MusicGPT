"use client";

import { useMusicStore } from "@/lib/music-store";

export default function FloatingPlayer() {
  const currentTrack = useMusicStore((state) => state.currentTrack);
  const isPlaying = useMusicStore((state) => state.isPlaying);
  const togglePlay = useMusicStore((state) => state.togglePlay);
  const clearTrack = useMusicStore((state) => state.clearTrack);

  if (!currentTrack) {
    return null;
  }

  const gradient = `linear-gradient(135deg, ${currentTrack.palette[0]}, ${currentTrack.palette[1]})`;

  return (
    <div className="fixed bottom-4 left-0 right-0 z-[60] pointer-events-none">
      <div className="mx-auto w-full max-w-[560px] px-4 pointer-events-auto">
        <div className="flex items-center gap-3 rounded-[18px] border border-[#2a2f33] bg-[#16191C]/95 p-3 shadow-[0_20px_40px_rgba(0,0,0,0.55)] backdrop-blur">
          <div
            className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-[12px]"
            style={{ backgroundImage: gradient }}
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white truncate">
              {currentTrack.title}
            </p>
            <p className="text-xs text-[#777a80] truncate">
              {currentTrack.prompt}
            </p>
          </div>
          <button
            type="button"
            onClick={togglePlay}
            aria-pressed={isPlaying}
            aria-label={isPlaying ? "Pause track" : "Play track"}
            className="h-10 w-10 rounded-full border border-[#2a2f33] bg-[#202428] transition hover:border-[#3a3f44] hover:bg-[#262a2e]"
          >
            <img
              src={
                isPlaying
                  ? "/svg/icon-control-pause-white.svg"
                  : "/svg/icon-control-play-white-2.svg"
              }
              alt=""
              className="mx-auto h-4 w-4"
            />
          </button>
          <button
            type="button"
            onClick={clearTrack}
            aria-label="Close player"
            className="h-10 w-10 rounded-full border border-[#2a2f33] text-[#777a80] transition hover:border-[#3a3f44] hover:text-white"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto h-4 w-4"
              aria-hidden="true"
            >
              <path
                d="M6 6L18 18M6 18L18 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
