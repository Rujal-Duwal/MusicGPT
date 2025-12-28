"use client";

import { useMemo } from "react";
import { useMusicStore } from "@/lib/music-store";
import type { Generation } from "@/lib/types";
import { GenerationRow } from "@/components/molecules/generation-row";

type SongItemProps = {
  title: string;
  description: string;
  palette: [string, string];
  imageUrl?: string;
  isActive?: boolean;
  onClick?: () => void;
};

const fallbackPalette: [string, string] = ["#2b2f33", "#3a3e42"];

const getTitle = (item: Generation) =>
  item.versions?.[0]?.title ?? "Sound Creator";

function SongItem({
  title,
  description,
  palette,
  imageUrl,
  isActive = false,
  onClick,
}: SongItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className="flex w-full items-start gap-4 text-left transition hover:opacity-90"
    >
      <div className="relative w-20 h-20  rounded-lg overflow-hidden flex-shrink-0 bg-skeleton">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url('/svg/loaded.svg')",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          />
        )}
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        <h3 className="text-song-title text-lg font-medium truncate">
          {title}
        </h3>
        <p className="text-song-description text-base truncate">
          {description}
        </p>
      </div>
    </button>
  );
}

function SongSkeleton() {
  return (
    <div className="flex items-center gap-4">
      <div className="w-20 h-20 rounded-lg bg-skeleton flex-shrink-0" />
      <div className="flex flex-col gap-2 flex-1">
        <div className="h-5 w-48 rounded-full bg-skeleton" />
        <div className="h-5 w-80 rounded-full bg-skeleton" />
      </div>
      <div className="w-8 h-8 rounded-full bg-skeleton flex-shrink-0" />
    </div>
  );
}

export default function RecentGenerations() {
  const items = useMusicStore((state) => state.items);
  const isPaginating = useMusicStore((state) => state.isPaginating);
  const loadMore = useMusicStore((state) => state.loadMore);
  const connection = useMusicStore((state) => state.connection);
  const error = useMusicStore((state) => state.error);
  const currentTrack = useMusicStore((state) => state.currentTrack);
  const setTrack = useMusicStore((state) => state.setTrack);
  const visibleItems = useMemo(() => items.slice(0, 6), [items]);
  const showEmpty = !items.length;

  return (
    <section data-name="RecentGenerations" className="flex justify-center">
      <div className="relative mb-12 w-full max-w-[800px]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg0 font-semibold leading-[150%] tracking-[.18px] text-neutral-5000">
            Recent generations
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadMore}
              disabled={isPaginating}
              className="tracking-wide text-sm leading-tight flex shrink-0 items-center gap-sm justify-self-center px-3 h-9 rounded-4.5 transition duration-100 border-1 border-neutral-500 text-white/70 hover:border-[#44484c] hover:bg-[#1d2125] active:scale-95 disabled:opacity-40"
            >
              {isPaginating ? "Loading" : "Load more"}
            </button>
            <span
              className={`h-[9px] w-[9px] rounded-full ${
                connection === "open"
                  ? "bg-[#62f7d7] shadow-[0_0_10px_rgba(98,247,215,0.6)]"
                  : "bg-[#ff7a5a] shadow-[0_0_10px_rgba(255,122,90,0.6)]"
              }`}
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-6 border-1 border-neutral-300 bg-neutral-200/70 px-4 py-3 text-xs text-neutral-5000">
            {error}
          </div>
        )}

        {showEmpty ? (
          <div className="mt-4 rounded-6 border-1 border-neutral-300 bg-neutral-200/70 px-4 py-6 text-center">
            <p className="text-sm font-semibold text-neutral-5000">
              Start creating music
            </p>
            <p className="mt-2 text-xs text-neutral-1000">
              Submit a prompt above to see live progress and completed
              generations.
            </p>
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-5">
            {visibleItems.map((item) => {
              if (item.status !== "completed") {
                return <GenerationRow key={item.id} item={item} showVersions />;
              }

              const palette = item.versions?.[0]?.palette ?? fallbackPalette;
              const title = getTitle(item);

              return (
                <SongItem
                  key={item.id}
                  title={title}
                  description={item.prompt}
                  palette={palette}
                  isActive={currentTrack?.id === item.id}
                  onClick={() =>
                    setTrack({
                      id: item.id,
                      title,
                      prompt: item.prompt,
                      palette,
                    })
                  }
                />
              );
            })}
            {isPaginating && [0, 1].map((item) => <SongSkeleton key={item} />)}
          </div>
        )}
      </div>
    </section>
  );
}
