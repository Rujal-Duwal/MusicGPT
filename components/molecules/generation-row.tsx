"use client";

import type { Generation, Version } from "@/lib/types";
import styles from "./generation-row.module.css";

const fallbackPalette: [string, string] = ["#2b2f33", "#3a3e42"];

const clampProgress = (value: number) =>
  Math.max(0, Math.min(100, Math.round(value)));

const getTitle = (item: Generation) =>
  item.versions?.[0]?.title ?? "Sound Creator";

function VersionPreview({ version }: { version: Version }) {
  return (
    <div className="rounded-base border-1 border-neutral-300 bg-neutral-200/70 px-3 py-[10px] text-xs text-neutral-5000">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-neutral-1000">
        <span>{version.title}</span>
        <span>{version.duration}</span>
      </div>
      <div
        className="h-full w-full"
        style={{
          backgroundImage: "url('/svg/loaded.svg')",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      />
      <div className="mt-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-neutral-1000">
        <span>{version.bpm} bpm</span>
        <span>{version.key}</span>
        <span>{version.mood}</span>
      </div>
    </div>
  );
}

export function GenerationRow({
  item,
  showVersions = false,
}: {
  item: Generation;
  showVersions?: boolean;
}) {
  if (item.status === "failed") {
    return (
      <div data-name="GenerationItemRoot" className="relative">
        <div
          data-name="PromptErrorPrediction"
          className="group/PromptErrorPrediction relative rounded-6 bg-orange-base/10 py-[16px] px-[8px] flex gap-2"
        >
          <div className="w-[60px] h-[60px] bg-orange-base rounded-base flex items-center justify-center text-[32px] flex-none">
            !
          </div>
          <div className="flex-1">
            <div className="text-white font-bold truncate">
              Generation Failed
            </div>
            <div className="text-neutral-700 truncate">{item.prompt}</div>
            <div className="text-neutral-5000 font-normal mt-[6px]">
              {item.error || "Network error. Please try again."}
            </div>
            <div className="mt-2 flex gap-2">
              <button
                data-name="RegularButton"
                className="rounded-base border-1 border-neutral-800 text-sm leading-tight text-white px-3 py-[7px] bg-transparent transition duration-100 active:scale-95"
                type="button"
              >
                Retry
              </button>
              <button
                data-name="RegularButton"
                className="rounded-base border-1 border-neutral-800 text-sm leading-tight text-white px-3 py-[7px] bg-transparent transition duration-100 active:scale-95"
                type="button"
              >
                Copy Prompt
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const showProgress = item.status !== "completed";
  const progress = clampProgress(item.progress);
  const palette = item.versions?.[0]?.palette ?? fallbackPalette;

  return (
    <div data-name="GenerationItemRoot" className="relative">
      <div
        data-name="GenerationEl"
        className="relative min-h-[76px] rounded-6 py-2 transition duration-400 bg-transparent before:absolute before:-inset-x-2 before:inset-y-0 before:rounded-6 before:transition-colors before:duration-100 hover:before:bg-[#1d2125]"
      >
        <div
          data-name="GenerationItemRoot.BackgroundProgressBar"
          className={`absolute -inset-x-2 inset-y-0 overflow-hidden rounded-6 transition-opacity duration-300 ${
            showProgress ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            data-percent={`${progress}%`}
            className="h-full bg-gradientBgProgressBar transition-all duration-300 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="relative">
          <div className="relative h-[60px] w-[60px]">
            <button
              type="button"
              className="w-full h-full relative outline-none transition-transform origin-center active:scale-95"
              data-name="PlayableThumbnail"
            >
              <span className="relative overflow-hidden rounded-basePlus transition duration-100 flex justify-center items-center w-full h-full bg-neutral-300 transform-gpu">
                <span
                  className="block z-0 w-full h-full"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${palette[0]}, ${palette[1]})`,
                  }}
                />
              </span>
            </button>
          </div>
          <span
            data-name="SpinningGradient"
            className={`block absolute w-[60px] h-[60px] top-0 left-0 z-[2] pointer-events-none rounded-[25.974%] overflow-hidden transition duration-300 ${
              showProgress ? "opacity-100" : "opacity-0"
            }`}
          >
            <span className="block absolute inset-0" style={{ opacity: 1 }}>
              <i data-name="SpinningGradient1" className={styles.spinningGradient} />
            </span>
            <b className="font-normal text-white opacity-50 absolute inset-0 flex justify-center items-center">
              {progress}%
            </b>
          </span>
          <div className="flex flex-col absolute left-[70px] right-0 top-[7px]">
            <div
              data-name="LabelPrimary1"
              className="truncate text-base text-white"
            >
              <button type="button">{getTitle(item)}</button>
            </div>
            <div
              data-name="LabelSecondary1"
              className="text-neutral-1000 text-sm truncate"
            >
              {item.prompt}
            </div>
          </div>
        </div>
      </div>
      {showVersions &&
        item.status === "completed" &&
        item.versions &&
        item.versions.length > 0 && (
          <div className="ml-[70px] mt-2 grid gap-2 sm:grid-cols-2">
            {item.versions.slice(0, 2).map((version) => (
              <VersionPreview key={version.id} version={version} />
            ))}
          </div>
        )}
    </div>
  );
}
