'use client';

import { useMemo } from 'react';
import { useMusic } from '@/components/music-context';
import type { Generation, Version } from '@/lib/types';

function GenerationCard({ item }: { item: Generation }) {
  if (item.status === 'failed') {
    return (
      <div className="glass-edge rounded-3xl p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ember">Failed</p>
        <p className="mt-2 text-sm text-frost line-clamp-2">{item.prompt}</p>
        <p className="mt-2 text-xs text-ember">{item.error || 'A network glitch interrupted the render.'}</p>
      </div>
    );
  }

  if (item.status !== 'completed') {
    return (
      <div className="glass-edge rounded-3xl p-4">
        <p className="text-xs text-mist">Generating</p>
        <p className="mt-2 text-sm text-frost line-clamp-2">{item.prompt}</p>
        <div className="mt-3 progress-track">
          <div className="progress-bar" style={{ width: `${item.progress}%` }} />
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-mist">
          <span className="h-2 w-2 rounded-full bg-aurora animate-pulse" />
          {Math.round(item.progress)}% complete
        </div>
      </div>
    );
  }

  return (
    <div className="glass-edge rounded-3xl p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-mist">Completed</p>
        <span className="text-[10px] uppercase tracking-[0.2em] text-mist">2 versions</span>
      </div>
      <p className="mt-2 text-sm text-frost line-clamp-2">{item.prompt}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {(item.versions || []).map((version) => (
          <VersionCard key={version.id} version={version} />
        ))}
      </div>
    </div>
  );
}

function VersionCard({ version }: { version: Version }) {
  return (
    <div
      className="rounded-2xl border border-white/10 p-3 text-xs text-midnight"
      style={{
        backgroundImage: `linear-gradient(135deg, ${version.palette[0]}, ${version.palette[1]})`
      }}
    >
      <div className="flex items-center justify-between">
        <p className="font-semibold uppercase tracking-[0.18em]">{version.title}</p>
        <span className="rounded-full bg-white/25 px-2 py-1 text-[10px] font-semibold">
          {version.duration}
        </span>
      </div>
      <div className="mt-3 h-10 rounded-xl bg-black/20" />
      <div className="mt-3 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.2em]">
        <span>{version.bpm} bpm</span>
        <span>{version.key}</span>
        <span>{version.mood}</span>
      </div>
    </div>
  );
}

export default function RecentGenerations() {
  const { items, isPaginating, loadMore, connection, error } = useMusic();
  const visibleItems = useMemo(() => items.slice(0, 4), [items]);
  const showEmpty = !items.length;

  return (
    <section className="mt-6 w-full">
      <div className="glass-panel rounded-[32px] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-display text-lg font-semibold">Recent Generations</p>
            <p className="text-xs text-mist">
              Live sync from the generation stream. {connection === 'open' ? 'Connected' : 'Reconnecting'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadMore}
              disabled={isPaginating}
              className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-mist transition hover:border-white/30 hover:text-frost active:scale-95 disabled:cursor-not-allowed disabled:border-white/5 disabled:text-mist/40"
            >
              {isPaginating ? 'Loading' : 'Load more'}
            </button>
            <span className={`status-dot ${connection === 'open' ? '' : 'offline'}`} />
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-2xl border border-ember/40 bg-ember/10 px-4 py-3 text-xs text-ember">
            {error}
          </div>
        )}

        {showEmpty && (
          <div className="mt-6 rounded-3xl border border-dashed border-white/10 bg-white/5 p-6 text-center">
            <p className="font-display text-base font-semibold">No music yet</p>
            <p className="mt-2 text-xs text-mist">
              Submit a prompt above to see live progress, final renders, and versions.
            </p>
          </div>
        )}

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {visibleItems.map((item) => (
            <GenerationCard key={item.id} item={item} />
          ))}

          {isPaginating &&
            [0, 1].map((item) => (
              <div key={item} className="skeleton h-40 rounded-3xl" />
            ))}
        </div>
      </div>
    </section>
  );
}
