'use client';

import { useEffect, useMemo, useState } from 'react';
import { useMusic } from '@/components/music-context';

const placeholders = [
  'Dreamy ambient pads with distant choirs and vinyl crackle.',
  'Jazz-hop groove with brushed drums and mellow Rhodes.',
  'Cinematic build with low strings and shimmering synths.',
  'High-energy EDM drop with bright arps and punchy kick.',
  'Lo-fi guitar, warm tape hiss, midnight city mood.'
];

const surprisePrompts = [
  'Slow-burning techno with icy percussion and sub bass.',
  'Acoustic folk lullaby with soft harmonies and rain.',
  'Retro synthwave chase scene at 118 BPM.',
  'Trap beat with eerie bells and deep 808s.',
  'Minimal piano motif with airy textures.'
];

export default function PromptBox() {
  const { submitPrompt, isSubmitting, activeItem } = useMusic();
  const [prompt, setPrompt] = useState('');
  const [focused, setFocused] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [placeholderVisible, setPlaceholderVisible] = useState(true);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const interval = setInterval(() => {
      setPlaceholderVisible(false);
      timeoutId = setTimeout(() => {
        setPlaceholderIndex((index) => (index + 1) % placeholders.length);
        setPlaceholderVisible(true);
      }, 260);
    }, 3200);

    return () => {
      clearInterval(interval);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  const isExpanded = focused || prompt.trim().length > 0;
  const promptDisabled = isSubmitting;

  const activeStatus = useMemo(() => {
    if (!activeItem) return null;
    if (activeItem.status === 'queued') {
      return 'Queued for generation';
    }
    if (activeItem.status === 'generating') {
      return `Generating · ${Math.round(activeItem.progress)}%`;
    }
    return null;
  }, [activeItem]);

  const handleSubmit = async () => {
    await submitPrompt(prompt);
    setPrompt('');
  };

  const handleSurprise = () => {
    const next = surprisePrompts[Math.floor(Math.random() * surprisePrompts.length)];
    setPrompt(next);
  };

  return (
    <div
      className="prompt-shell"
      data-expanded={isExpanded}
    >
      <div className="prompt-shell-inner flex flex-col gap-4 px-6 py-6 sm:px-8">
        <div className="relative min-h-[88px]">
          {!prompt && (
            <div
              className={`pointer-events-none absolute inset-x-0 top-2 text-sm text-mist/80 placeholder-swap ${
                focused || !placeholderVisible ? 'placeholder-hidden' : ''
              }`}
            >
              {placeholders[placeholderIndex]}
            </div>
          )}
          <textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            maxLength={360}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                if (!promptDisabled && prompt.trim()) {
                  handleSubmit();
                }
              }
            }}
            placeholder=""
            className="min-h-[88px] w-full resize-none bg-transparent text-base leading-relaxed text-frost outline-none placeholder:text-mist/60"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-xs text-mist">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              {prompt.length}/360
            </span>
            {activeStatus ? (
              <span className="flex items-center gap-2 text-aurora">
                <span className="h-2 w-2 animate-pulse rounded-full bg-aurora" />
                {activeStatus}
              </span>
            ) : (
              <span>Ready for a new prompt</span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleSurprise}
              className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-mist transition hover:border-white/30 hover:text-frost active:scale-95"
            >
              Surprise
            </button>
            <button
              type="button"
              onClick={() => setPrompt('')}
              disabled={!prompt}
              className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-mist transition hover:border-white/30 hover:text-frost active:scale-95 disabled:cursor-not-allowed disabled:border-white/5 disabled:text-mist/40"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!prompt.trim() || promptDisabled}
              className="group relative overflow-hidden rounded-full bg-aurora/90 px-6 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-midnight shadow-glow transition hover:scale-[1.02] hover:bg-aurora active:scale-95 disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/40 disabled:shadow-none"
            >
              <span className="relative z-10">Generate</span>
              <span className="absolute inset-0 opacity-0 transition group-hover:opacity-100" style={{ background: 'linear-gradient(90deg, rgba(98,247,215,0.7), rgba(76,111,255,0.7))' }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
