'use client';

import { useState } from 'react';
import { useMusic } from '@/components/music-context';

export default function ProfilePanel() {
  const { items, connection, activeItem, latestFailed, isPaginating } = useMusic();
  const [open, setOpen] = useState(true);
  const recent = items.slice(0, 3);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-left text-xs text-mist transition hover:border-white/30 hover:text-frost"
      >
        <span className={`status-dot ${connection === 'open' ? '' : 'offline'}`} />
        <div>
          <p className="font-display text-sm text-frost">Nova Lane</p>
          <p className="text-[11px] text-mist">Pro Studio</p>
        </div>
        <span className="text-base">▾</span>
      </button>

      <div
        className={`glass-panel absolute right-0 mt-3 w-[320px] rounded-3xl p-4 text-sm transition-all duration-300 ${
          open ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 -translate-y-2'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-base font-semibold">Nova Lane</p>
            <p className="text-xs text-mist">Recently generated tracks</p>
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-mist">
            {items.length} total
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {!items.length && (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-xs text-mist">
              No generations yet. Your first prompt will appear here live.
            </div>
          )}

          {activeItem && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs text-mist">Generating</p>
              <p className="mt-1 line-clamp-2 text-sm text-frost">{activeItem.prompt}</p>
              <div className="mt-3 progress-track">
                <div className="progress-bar" style={{ width: `${activeItem.progress}%` }} />
              </div>
            </div>
          )}

          {latestFailed && (
            <div className="rounded-2xl border border-ember/40 bg-ember/10 p-3 text-xs text-ember">
              <p className="font-semibold uppercase tracking-[0.18em]">Failed</p>
              <p className="mt-1 text-sm text-frost">{latestFailed.prompt}</p>
              <p className="mt-1">{latestFailed.error || 'Network error. Try again.'}</p>
            </div>
          )}

          {recent.map((item) => (
            <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-mist">
                  {item.status === 'completed'
                    ? 'Complete'
                    : item.status === 'failed'
                    ? 'Failed'
                    : 'In progress'}
                </p>
                <span className="text-[10px] uppercase tracking-[0.2em] text-mist">
                  {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-frost">{item.prompt}</p>
              {item.status !== 'completed' && item.status !== 'failed' && (
                <div className="mt-2 progress-track">
                  <div className="progress-bar" style={{ width: `${item.progress}%` }} />
                </div>
              )}
            </div>
          ))}

          {isPaginating && (
            <div className="space-y-2">
              {[0, 1].map((item) => (
                <div key={item} className="skeleton h-14 rounded-2xl" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
