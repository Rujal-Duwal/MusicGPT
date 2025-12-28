import PromptBox from "@/components/organisms/prompt-box";
import ProfilePanel from "@/components/organisms/profile-panel";
import RecentGenerations from "@/components/organisms/recent-generations";
import Sidebar from "@/components/organisms/sidebar";
import FloatingPlayer from "@/components/organisms/floating-player";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0A0C0D] text-neutral-5000">
      <div className="fixed left-0 top-0 -z-10 h-[620px] w-full bg-gradientOmniBoxWhite" />
      <Sidebar />
      <div className="relative z-0 ml-0 md:ml-[var(--sidebar-width)]">
        <div className="relative z-10 mx-auto w-full px-4 pb-10 pt-6 sm:px-8 lg:px-12">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                alt="MusicGPT"
                src="/musicgpt.png"
                width="32"
                height="32"
                className="h-8 w-8 rounded-full"
              />
              <div>
                <p className="text-sm font-semibold text-neutral-5000">
                  MusicGPT
                </p>
                <p className="text-xs text-neutral-1000">
                  Create music from prompt
                </p>
              </div>
            </div>
            <ProfilePanel />
          </header>

          <div className="min-h-[110vh]">
            <section
              data-name="PromptScreen"
              className="relative flex items-center justify-center py-2.5 min-h-[590px]"
            >
              <div data-name="HomepageCenterArea" className="relative w-full">
                <div
                  data-name="WelcomeBlock"
                  className="relative flex h-10 justify-center"
                  style={{ top: "calc(50% - 170px)" }}
                >
                  <div className="absolute left-0 right-0 top-0 h-[76px] w-full text-center text-xl2 leading-tight text-neutral-5000">
                    <div className="block">
                      <div className="w-full text-[24px] font-semibold tracking-[.32px] sm:text-[28px] md:text-[32px]">
                        What Song to Create?
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <PromptBox />
                </div>
              </div>
            </section>

            <RecentGenerations />
          </div>
        </div>
      </div>
      <FloatingPlayer />
    </main>
  );
}
