'use client';

import { useMemo } from 'react';
import { useMusicStore } from '@/lib/music-store';
import { GenerationRow } from '@/components/generation-row';

export default function RecentGenerations() {
  const items = useMusicStore((state) => state.items);
  const isPaginating = useMusicStore((state) => state.isPaginating);
  const loadMore = useMusicStore((state) => state.loadMore);
  const connection = useMusicStore((state) => state.connection);
  const error = useMusicStore((state) => state.error);
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
              {isPaginating ? 'Loading' : 'Load more'}
            </button>
            <span className={`status-dot ${connection === 'open' ? '' : 'offline'}`} />
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-6 border-1 border-neutral-300 bg-neutral-200/70 px-4 py-3 text-xs text-neutral-5000">
            {error}
          </div>
        )}

        {showEmpty ? (
          <div className="mt-4 rounded-6 border-1 border-neutral-300 bg-neutral-200/70 px-4 py-6 text-center">
            <p className="text-sm font-semibold text-neutral-5000">Start creating music</p>
            <p className="mt-2 text-xs text-neutral-1000">
              Submit a prompt above to see live progress and completed generations.
            </p>
          </div>
        ) : (
          <div data-name="CreatePageAudioList" className="mt-4 grid grid-cols-1 gap-y-1">
            {visibleItems.map((item) => (
              <GenerationRow key={item.id} item={item} showVersions />
            ))}
            {isPaginating &&
              [0, 1].map((item) => (
                <div key={item} className="skeleton h-[76px] rounded-6 bg-neutral-200/70" />
              ))}
          </div>
        )}
      </div>
    </section>
  );
}
