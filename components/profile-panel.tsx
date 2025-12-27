'use client';

import { useState } from 'react';
import { useMusicStore } from '@/lib/music-store';
import { GenerationRow } from '@/components/generation-row';

export default function ProfilePanel() {
  const [open, setOpen] = useState(true);
  const items = useMusicStore((state) => state.items);
  const connection = useMusicStore((state) => state.connection);
  const isPaginating = useMusicStore((state) => state.isPaginating);
  const error = useMusicStore((state) => state.error);

  const recent = items.slice(0, 3);
  const showEmpty = !items.length;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-3 rounded-full border-1 border-neutral-500 bg-omniBgNormal px-3 py-2 text-left text-xs text-neutral-1000 transition hover:border-[#44484c] hover:bg-[#3a3e42]"
      >
        <span className={`status-dot ${connection === 'open' ? '' : 'offline'}`} />
        <div>
          <p className="text-sm text-neutral-5000">Nova Lane</p>
          <p className="text-[11px] text-neutral-1000">Pro Studio</p>
        </div>
        <span className="text-base text-neutral-5000">▾</span>
      </button>

      <div
        className={`absolute right-0 mt-3 w-[340px] rounded-6 border-1 border-neutral-300 bg-omniBgNormal p-4 text-sm transition-all duration-300 z-50 ${
          open ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 -translate-y-2'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-neutral-5000">Nova Lane</p>
            <p className="text-xs text-neutral-1000">Recent generations</p>
          </div>
          <span className="rounded-full border-1 border-neutral-300 bg-neutral-200/70 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-neutral-1000">
            {items.length} total
          </span>
        </div>

        <div className="mt-4 grid gap-y-1">
          {error && (
            <div className="rounded-6 border-1 border-neutral-300 bg-neutral-200/70 px-3 py-2 text-xs text-neutral-5000">
              {error}
            </div>
          )}

          {showEmpty && (
            <div className="rounded-6 border-1 border-neutral-300 bg-neutral-200/70 px-4 py-3 text-xs text-neutral-1000">
              Start creating music to see generations here.
            </div>
          )}

          {recent.map((item) => (
            <GenerationRow key={item.id} item={item} />
          ))}

          {isPaginating &&
            [0, 1].map((item) => (
              <div key={item} className="skeleton h-[76px] rounded-6 bg-neutral-200/70" />
            ))}
        </div>
      </div>
    </div>
  );
}
