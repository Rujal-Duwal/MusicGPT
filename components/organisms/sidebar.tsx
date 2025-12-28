"use client";

import ModelV6 from "@/components/atoms/model-v6";

const navLinks = [
  { label: "Home", icon: "/svg/icon-home.svg", active: false },
  { label: "Create", icon: "/svg/icon-star-filled.svg", active: true },
  { label: "Explore", icon: "/svg/icon-compass.svg", active: false },
];

const libraryLinks = [
  { label: "Profile", icon: "/svg/icon-profile.svg" },
  { label: "Liked", icon: "/svg/icon-liked.svg" },
];

export default function Sidebar() {
  return (
    <aside
      data-name="DesktopNavigation"
      className="fixed hidden md:flex flex-col justify-between w-[var(--sidebar-width)] bg-white/[0.03] h-screen shrink-0 z-[1]"
    >
      <div className="p-4 flex flex-col gap-8">
        <a className="block active:scale-95 transition duration-100" href="#">
          <span className="flex items-center gap-base">
            <span className="relative block h-8 w-8">
              <img
                alt="MusicGPT logo"
                width="32"
                height="32"
                className="w-auto"
                src="/musicgpt.png"
              />
            </span>
            <span className="block text-lg0 font-medium text-white">
              MusicGPT
            </span>
          </span>
        </a>

        <button
          type="button"
          className="flex w-screen cursor-pointer flex-row items-center gap-3 md:w-[168px]"
        >
          <div className="group relative z-[2] h-[37px] gap-2 px-4 text-sm flex flex-row items-center border border-1 w-[260px] rounded-[30px] md:w-[168px] border-alpha-light-8 hover:border-transparent hover:bg-alpha-light-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 flex-none text-neutral-5000"
              aria-hidden="true"
            >
              <path d="m21 21-4.34-4.34" />
              <circle cx="11" cy="11" r="8" />
            </svg>
            <div className="appearance-none font-medium text-white w-16">
              Search
            </div>
            <div className="pointer-events-none flex w-10 items-center justify-end text-tinier text-neutral-1000">
              <span className="text-base">K</span>
            </div>
          </div>
        </button>

        <div className="flex flex-col gap-1 items-start">
          {navLinks.map((item) => (
            <a
              key={item.label}
              className={`group/navlink flex relative items-center text-sm px-4 rounded-full h-9 font-medium gap-2 text-white hover:bg-white/[0.08] active:scale-95 ${
                item.active ? "bg-white/[0.08]" : ""
              }`}
              href="#"
            >
              <img
                alt={item.label}
                loading="lazy"
                width="20"
                height="20"
                className="rounded-[6px] aspect-square transition-opacity duration-50"
                src={item.icon}
              />
              <span>{item.label}</span>
            </a>
          ))}
        </div>
      </div>

      <nav className="p-4 flex flex-col gap-8 overflow-y-auto overflow-x-visible transition-colors duration-200 h-[calc(100vh-200px)] border-t-1 border-transparent pretty-scrollbar-4 overscroll-contain">
        <div className="flex flex-col items-start gap-2">
          <div className="px-4 text-sm font-medium leading-9 text-neutral-1100">
            Library
          </div>
          {libraryLinks.map((item) => (
            <a
              key={item.label}
              className="group/navlink flex relative items-center text-sm px-4 rounded-full h-9 font-medium gap-2 text-white hover:bg-white/[0.08] active:scale-95"
              href="#"
            >
              <img
                alt={item.label}
                loading="lazy"
                width="20"
                height="20"
                className="rounded-[6px] aspect-square transition-opacity duration-50"
                src={item.icon}
              />
              <span>{item.label}</span>
            </a>
          ))}
          <span
            role="button"
            className="flex h-9 cursor-pointer items-center gap-2 rounded-full px-4 text-sm font-medium text-white hover:bg-white/[0.08]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-neutral-5000"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            <span>New Playlist</span>
          </span>
        </div>
      </nav>

      <div
        data-name="SidebarFooterSection"
        className="flex flex-col gap-5 px-5 py-4 sm:p-4"
      >
        <ModelV6 className="w-full" />
        <div className="flex flex-row flex-wrap items-center text-sm text-white/50 gap-x-6 gap-y-5 sm:gap-x-3 sm:gap-y-1">
          {["Pricing", "Affiliate", "API", "About", "Terms", "Privacy"].map(
            (item) => (
              <a key={item} className="text-tinier" href="#">
                {item}
              </a>
            )
          )}
        </div>
      </div>
    </aside>
  );
}
