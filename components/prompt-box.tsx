'use client';

import { useEffect, useRef, useState } from 'react';
import { useMusicStore } from '@/lib/music-store';

const placeholders = [
  'Warm acoustic Christmas song for a family gathering',
  'Cinematic strings rising into a calm finale',
  'Snowy lo-fi beats with warm vinyl hiss',
  'Ambient choir pads with distant bells',
  'Neon synthwave chase at 118 BPM'
];

const presetPrompts = [
  {
    id: 'create-song',
    label: 'Create song',
    prompt: 'Warm acoustic Christmas song for a family gathering',
    icon: '/svg/icon-randomizer-create-song.svg'
  },
  {
    id: 'create-sound',
    label: 'Create Sound',
    prompt: 'Crackling fireplace, gentle wind, midnight calm',
    icon: '/svg/icon-randomizer-create-sound.svg'
  },
  {
    id: 'speak-text',
    label: 'Speak text',
    prompt: 'Text to speech: "Welcome to the winter night"',
    icon: '/svg/icon-randomizer-speak-text.svg'
  },
  {
    id: 'change-file',
    label: 'Change file',
    prompt: 'Remix with deeper bass and hazy pads',
    icon: '/svg/icon-randomizer-change-file.svg'
  },
  {
    id: 'random',
    label: 'Random',
    prompt: '',
    icon: '/svg/icon-randomizer-random.svg'
  }
];

const randomPrompts = [
  'Crisp trap beat with icy bells and sub bass',
  'Acoustic folk lullaby with soft harmonies and rain',
  'Retro synthwave chase scene at 118 BPM',
  'Slow-burning techno with airy percussion',
  'Minimal piano motif with glowing textures'
];

export default function PromptBox() {
  const submitPrompt = useMusicStore((state) => state.submitPrompt);
  const isSubmitting = useMusicStore((state) => state.isSubmitting);
  const [prompt, setPrompt] = useState('');
  const [focused, setFocused] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [placeholderVisible, setPlaceholderVisible] = useState(true);
  const [isInstrumental, setIsInstrumental] = useState(false);
  const [includeLyrics, setIncludeLyrics] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

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
  const promptDisabled = isSubmitting || !prompt.trim();
  const shellHeight = isExpanded ? 156 : 124;

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      return;
    }
    const tags = [
      isInstrumental ? 'Instrumental' : null,
      includeLyrics ? 'Lyrics' : null
    ].filter(Boolean);
    const fullPrompt = tags.length ? `${prompt} (${tags.join(', ')})` : prompt;
    await submitPrompt(fullPrompt);
    setPrompt('');
  };

  const handlePresetClick = (preset: (typeof presetPrompts)[number]) => {
    if (preset.id === 'random') {
      const next = randomPrompts[Math.floor(Math.random() * randomPrompts.length)];
      setPrompt(next);
    } else {
      setPrompt(preset.prompt);
    }
    textareaRef.current?.focus();
  };

  return (
    <div className="w-full">
      <div
        className="relative mx-auto w-full max-w-[800px] transition-[height] duration-200"
        style={{ height: `${shellHeight}px` }}
      >
        <span className="absolute inset-0 z-[1]">
          <i className="Anim12 isVisible" />
        </span>
        <span className="absolute inset-0 z-[2]">
          <i className="Anim11 isVisible" />
        </span>
        <div className="group/PromptConfigurator relative z-20 h-full w-full rounded-[27px] bg-omniBgNormal transition duration-200">
          <div className="h-full w-full">
            <form
              data-name="ToolMain"
              className="overflow-hidden pb-[50px]"
              onSubmit={(event) => {
                event.preventDefault();
                if (!promptDisabled) {
                  handleSubmit();
                }
              }}
            >
              <div className="pt-[20px]">
                <div data-name="rotating-text" className="relative">
                  {!prompt && (
                    <div className="pointer-events-none absolute left-[22px] top-[10px] z-0 h-[56px] w-full overflow-hidden bg-transparent">
                      <div className="absolute top-[10px] z-0 bg-transparent pointer-events-none h-[32px] w-[calc(100%-40px)]">
                        <div
                          className={`text-neutral-800 tracking-[.32px] transition duration-300 ${
                            placeholderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[10px]'
                          }`}
                        >
                          {placeholders[placeholderIndex]}
                        </div>
                      </div>
                    </div>
                  )}
                  <textarea
                    ref={textareaRef}
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    maxLength={360}
                    spellCheck
                    className="px-[20px] py-[20px] mt-[-20px] block outline-none resize-none pretty-scrollbar-2 w-full bg-transparent text-base text-white h-[66px]"
                    style={{ height: '64px' }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between flex-col gap-y-2 sm:flex-row absolute bottom-[12px] left-[12px] right-[12px] h-[82px] sm:h-9">
                <div className="flex w-full gap-sm">
                  <button
                    className="hover:bg-[#3a3e42] border-1 relative cursor-pointer rounded-4.5 h-9 w-[36px] active:scale-95 transition-all duration-200 ease-out flex shrink-0 grow-0 items-center justify-center shadow-none border-neutral-500 hover:border-[#44484c]"
                    type="button"
                    aria-label="Upload file"
                  >
                    <img
                      alt="attach file"
                      loading="lazy"
                      width="20"
                      height="20"
                      className="z-[1] transition-transform duration-200 ease-out"
                      src="/svg/icon-attachment-white.svg"
                    />
                  </button>
                  <button
                    className="hover:bg-[#3a3e42] border-1 relative cursor-pointer rounded-4.5 h-9 w-9 gap-1 text-sm text-neutral-5000 active:scale-95 transition-all duration-200 ease-out flex shrink-0 grow-0 items-center justify-center border-neutral-500 hover:border-[#44484c]"
                    type="button"
                    aria-label="Pro controls"
                  >
                    <img
                      alt="pro controls"
                      loading="lazy"
                      width="20"
                      height="20"
                      className="z-[1] transition-transform duration-200 ease-out"
                      src="/svg/icon-pro-control.svg"
                    />
                  </button>
                  <button
                    type="button"
                    className={`relative text-sm text-white flex items-center justify-center gap-sm border-1 border-neutral-500 hover:border-[#44484c] hover:bg-[#3a3e42] active:scale-95 transition rounded-4.5 h-9 px-base z-[1] w-full sm:w-auto ${
                      isInstrumental ? 'bg-neutral-400 border-neutral-600' : ''
                    }`}
                    onClick={() => setIsInstrumental((value) => !value)}
                  >
                    <i className="block h-5 w-5">
                      <img
                        alt="Instrumental icon"
                        loading="lazy"
                        width="20"
                        height="20"
                        className="h-full w-full object-cover"
                        src="/svg/icon-instrumental-white.svg"
                      />
                    </i>
                    <span className="block">Instrumental</span>
                  </button>
                  <button
                    type="button"
                    className={`relative text-sm text-white flex items-center justify-center gap-sm border-1 border-neutral-500 hover:border-[#44484c] hover:bg-[#3a3e42] active:scale-95 transition rounded-4.5 h-9 px-base z-[1] w-full sm:w-auto ${
                      includeLyrics ? 'bg-neutral-400 border-neutral-600' : ''
                    }`}
                    onClick={() => setIncludeLyrics((value) => !value)}
                  >
                    <i className="block h-5 w-5">
                      <img
                        alt="Lyrics icon"
                        loading="lazy"
                        width="20"
                        height="20"
                        className="h-full w-full object-cover grayscale"
                        src="/svg/icon-plus-white.svg"
                      />
                    </i>
                    <span className="block">Lyrics</span>
                  </button>
                </div>
                <div className="flex w-full items-center justify-end">
                  <div className="h-9 w-[36px]">
                    <button
                      type="submit"
                      className="h-full w-full relative flex items-center justify-center rounded-full overflow-hidden bg-neutral-600 transition duration-100 hover:bg-[#3a3e42] disabled:cursor-not-allowed"
                      disabled={promptDisabled}
                    >
                      <i className="absolute block h-full w-full transition duration-200 rounded-full bg-transparent scale-0" />
                      <i className="h-6 w-6 block relative">
                        <img
                          alt="Submit"
                          loading="lazy"
                          width="24"
                          height="24"
                          className={`h-full w-full object-cover transition duration-100 ${
                            promptDisabled ? 'opacity-40' : 'opacity-100'
                          }`}
                          src="/svg/icon-arrow-right-black.svg"
                        />
                      </i>
                    </button>
                  </div>
                </div>
              </div>
            </form>
            <button
              type="button"
              className="transition absolute bottom-3 left-3 sm:bottom-3 sm:left-auto sm:right-[60px] h-9 rounded-4.5 p-[1px] animate-rotateGradient"
              aria-label="Tools"
            >
              <div className="flex items-center gap-[5px] rounded-4.5 px-3 hover:bg-[#303438] bg-omniBgNormal h-full text-sm text-white">
                <span>Tools</span>
                <i className="block">
                  <img
                    alt="arrow-down"
                    loading="lazy"
                    width="18"
                    height="18"
                    src="/svg/icon-chevron-down-white.svg"
                  />
                </i>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-[22px] flex justify-center">
        <div className="no-scrollbar flex max-w-full items-center gap-[11px] overflow-x-auto px-4">
          {presetPrompts.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className="tracking-wide text-sm leading-tight flex shrink-0 items-center gap-sm justify-self-center px-3 h-11 rounded-[25px] transition duration-100 border-1 border-neutral-300 hover:border-[#3a3e42] hover:bg-[#1d2125] active:scale-95"
              onClick={() => handlePresetClick(preset)}
            >
              <span className="block h-5 w-5 shrink-0 grow-0">
                <img alt="" src={preset.icon} width="24" height="24" className="h-full w-full object-cover" />
              </span>
              <span>{preset.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
