import PromptBox from '@/components/prompt-box';
import ProfilePanel from '@/components/profile-panel';
import RecentGenerations from '@/components/recent-generations';

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-midnight text-frost">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-[10%] h-72 w-72 rounded-full bg-aurora/20 blur-[120px] animate-float" />
        <div className="absolute top-24 right-[12%] h-80 w-80 rounded-full bg-tide/20 blur-[120px] animate-float" />
        <div className="absolute bottom-24 left-[35%] h-64 w-64 rounded-full bg-ember/20 blur-[110px] animate-float" />
        <div className="noise-layer" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col px-6 pb-10 pt-8 sm:px-10 lg:px-16">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-aurora/40 via-tide/40 to-ember/40 text-lg font-semibold text-white shadow-glow">
              ♪
            </div>
            <div>
              <p className="font-display text-lg font-semibold">MusicGPT</p>
              <p className="text-xs text-mist">Create music from prompt</p>
            </div>
          </div>
          <ProfilePanel />
        </header>

        <section className="flex flex-1 flex-col items-center justify-center">
          <div className="w-full max-w-4xl">
            <div className="mb-8 text-center">
              <p className="font-display text-4xl font-semibold leading-tight sm:text-5xl">
                Shape a track from a single line of text
              </p>
              <p className="mx-auto mt-3 max-w-2xl text-sm text-mist sm:text-base">
                Describe mood, tempo, and instrumentation. We will orchestrate the rest in real time.
              </p>
            </div>
            <PromptBox />
          </div>
        </section>

        <RecentGenerations />
      </div>
    </main>
  );
}
