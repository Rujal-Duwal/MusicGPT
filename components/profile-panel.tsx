"use client";

import { useState } from "react";
import type { SVGProps } from "react";
import { useMusicStore } from "@/lib/music-store";
import type { GenerationStatus } from "@/lib/types";

type AvatarRingProps = {
  size: number;
  initials: string;
  showStatus?: boolean;
  statusColor?: string;
};

type GenerationPreview = {
  id: string;
  prompt: string;
  progress: number;
  statusLabel: string;
  versionLabel: string;
  gradient: string;
  isLoading?: boolean;
};

type InvalidPromptPreview = {
  title: string;
  prompt: string;
  message: string;
  hint: string;
};

const clampProgress = (value: number) =>
  Math.max(0, Math.min(100, Math.round(value)));

const splitPrompt = (prompt: string) => {
  const trimmed = prompt.trim();
  if (!trimmed) {
    return ["", ""];
  }
  const maxFirst = 24;
  if (trimmed.length <= maxFirst) {
    return [trimmed, ""];
  }
  const splitIndex = trimmed.lastIndexOf(" ", maxFirst);
  const index = splitIndex === -1 ? maxFirst : splitIndex;
  return [trimmed.slice(0, index), trimmed.slice(index).trimStart()];
};

const getStatusLabel = (status: GenerationStatus) => {
  switch (status) {
    case "pending":
      return "Starting AI audio engine";
    case "generating":
      return "Generating";
    case "completed":
      return "Ready to play";
    case "failed":
      return "Failed";
    default:
      return "Generating";
  }
};

const fallbackGradients = [
  "linear-gradient(135deg, #1a0a1a 0%, #3d1a3d 50%, #1a0a1a 100%)",
  "linear-gradient(135deg, #2d1b4e 0%, #4a2c7a 50%, #6b3fa0 100%)",
];

const fallbackGenerations: GenerationPreview[] = [
  {
    id: "fallback-1",
    prompt: "Create a funky house song with female vocals",
    progress: 0,
    statusLabel: "Generating",
    versionLabel: "v1",
    gradient: fallbackGradients[0],
    isLoading: true,
  },
  {
    id: "fallback-2",
    prompt: "Create a funky house song with female vocals",
    progress: 50,
    statusLabel: "Starting AI audio engine",
    versionLabel: "v2",
    gradient: fallbackGradients[1],
    isLoading: true,
  },
];

const fallbackInvalidPrompt: InvalidPromptPreview = {
  title: "Invalid Prompt",
  prompt: "This is not good prompt, throw invalid pr...",
  message: "Your prompt does not seem to be valid.",
  hint: "Please provide a prompt related to song creation, remixing, covers, or similar.",
};

function AvatarRing({
  size,
  initials,
  showStatus = false,
  statusColor = "#6BFFAC",
}: AvatarRingProps) {
  const ringPadding = size <= 40 ? 2 : 3;
  const fontSize = Math.round(size / 3);
  const statusSize = size <= 40 ? 14 : 18;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          padding: ringPadding,
          background:
            "conic-gradient(from 180deg, #FF6200 0deg, #FF2C9B 120deg, #C800FF 240deg, #FF6200 360deg)",
        }}
      >
        <div
          className="flex h-full w-full items-center justify-center rounded-full bg-[#16191C] text-white font-medium"
          style={{ fontSize }}
        >
          {initials}
        </div>
      </div>
      {showStatus && (
        <span
          className="absolute rounded-full border-2 border-[#16191C]"
          style={{
            width: statusSize,
            height: statusSize,
            top: -2,
            right: -2,
            backgroundColor: statusColor,
          }}
        />
      )}
    </div>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M12.1065 15C13.7625 15 15.1065 13.657 15.1065 12C15.1065 10.343 13.7625 9 12.1065 9C10.4495 9 9.10547 10.343 9.10547 12C9.10547 13.657 10.4495 15 12.1065 15Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.39315 19.371L9.97715 20.686C10.1512 21.077 10.4342 21.409 10.7932 21.643C11.1522 21.876 11.5712 22 11.9992 22C12.4272 22 12.8462 21.876 13.2052 21.643C13.5642 21.409 13.8482 21.077 14.0222 20.686L14.6062 19.371C14.8142 18.905 15.1642 18.516 15.6062 18.26C16.0512 18.003 16.5652 17.894 17.0762 17.948L18.5062 18.1C18.9322 18.145 19.3612 18.066 19.7432 17.871C20.1242 17.677 20.4412 17.376 20.6552 17.006C20.8692 16.635 20.9712 16.21 20.9492 15.783C20.9262 15.355 20.7802 14.944 20.5282 14.598L19.6812 13.434C19.3802 13.017 19.2192 12.515 19.2222 12C19.2212 11.487 19.3842 10.986 19.6862 10.571L20.5332 9.408C20.7842 9.062 20.9312 8.65 20.9532 8.223C20.9762 7.795 20.8732 7.371 20.6592 7C20.4452 6.629 20.1292 6.328 19.7472 6.134C19.3662 5.94 18.9362 5.861 18.5102 5.906L17.0802 6.058C16.5702 6.111 16.0552 6.002 15.6102 5.746C15.1682 5.488 14.8172 5.097 14.6102 4.629L14.0222 3.314C13.8482 2.923 13.5642 2.591 13.2052 2.357C12.8462 2.124 12.4272 2 11.9992 2C11.5712 2 11.1522 2.124 10.7932 2.357C10.4342 2.591 10.1512 2.923 9.97715 3.314L9.39315 4.629C9.18615 5.097 8.83515 5.488 8.39315 5.746C7.94815 6.002 7.43315 6.111 6.92315 6.058L5.48815 5.906C5.06215 5.861 4.63315 5.94 4.25115 6.134C3.87015 6.328 3.55315 6.629 3.33915 7C3.12515 7.371 3.02315 7.795 3.04615 8.223C3.06815 8.65 3.21415 9.062 3.46615 9.408L4.31315 10.571C4.61515 10.986 4.77715 11.487 4.77715 12C4.77715 12.513 4.61515 13.014 4.31315 13.429L3.46615 14.592C3.21415 14.938 3.06815 15.35 3.04615 15.777C3.02315 16.205 3.12515 16.63 3.33915 17C3.55315 17.371 3.87015 17.671 4.25215 17.865C4.63315 18.06 5.06215 18.139 5.48815 18.094L6.91815 17.942C7.42915 17.889 7.94315 17.998 8.38815 18.254C8.83315 18.511 9.18415 18.902 9.39315 19.371Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InfoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 16V11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="8" r="1" fill="currentColor" />
    </svg>
  );
}

function ChevronRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M9 6L15 12L9 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AlertTriangleIcon({
  className,
  fill = "none",
  stroke = "currentColor",
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path
        d="M10.29 3.86L1.82 18C1.64 18.31 1.55 18.66 1.55 19.02C1.55 20.13 2.45 21.03 3.56 21.03H20.44C21.55 21.03 22.45 20.13 22.45 19.02C22.45 18.66 22.36 18.31 22.18 18L13.71 3.86C13.32 3.2 12.68 2.8 12 2.8C11.32 2.8 10.68 3.2 10.29 3.86Z"
        stroke={stroke}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 9V13"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="16.5" r="1" fill={stroke} />
    </svg>
  );
}

function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M18 6L6 18M6 6L18 18"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GenerationCard({
  item,
  isLast,
}: {
  item: GenerationPreview;
  isLast: boolean;
}) {
  const [prefix, suffix] = splitPrompt(item.prompt);
  const prefixClass = suffix ? "text-[#898c92]" : "text-white";
  const isLoading = item.isLoading ?? false;
  const progressClass = isLoading ? "text-white/50" : "text-white/80";

  return (
    <div
      className={`bg-[#1d2125] rounded-xl p-3 flex items-center gap-3 ${
        isLast ? "mb-4" : "mb-3"
      }`}
    >
      <div className="relative w-[64px] h-[64px] rounded-[16px] overflow-hidden flex-shrink-0 bg-[#1D2125]">
        {isLoading ? (
          <div className="absolute inset-0 rounded-[16px] overflow-hidden">
            <span
              className="absolute block"
              style={{
                width: "223.14px",
                height: "64.39px",
                left: "-46px",
                top: "25px",
                background:
                  "linear-gradient(180deg, #FF6200 0%, #AA00FF 100%)",
                filter: "blur(25px)",
                transform: "matrix(0.99, -0.12, 0.33, 0.94, 0, 0)",
              }}
            />
            <span
              className="absolute block"
              style={{
                width: "62.17px",
                height: "148.42px",
                left: "-78px",
                top: "-9px",
                background:
                  "linear-gradient(180deg, #AA00FF 0%, #8962FF 100%)",
                filter: "blur(31.5px)",
                transform: "matrix(0.7, -0.71, 0.95, 0.32, 0, 0)",
              }}
            />
            <span
              className="absolute block"
              style={{
                width: "80.28px",
                height: "159.69px",
                left: "-29px",
                top: "0px",
                background: "#000000",
                filter: "blur(28.5px)",
                mixBlendMode: "overlay",
                transform: "matrix(0.7, -0.71, 0.95, 0.32, 0, 0)",
              }}
            />
          </div>
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: item.gradient }}
          />
        )}
        <div
          className="absolute inset-0 rounded-[16px]"
          style={{
            border: "1px solid transparent",
            borderImageSlice: 1,
            borderImageSource:
              "radial-gradient(227.54% 59.42% at 42.03% 86.23%, #FF6200 0%, rgba(170, 0, 255, 0.5) 30.42%, rgba(0, 0, 0, 0) 100%)",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-[12px] leading-[15px] font-medium ${progressClass}`}>
            {item.progress}%
          </span>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm truncate">
          <span className={prefixClass}>{prefix}</span>
          {suffix ? (
            <>
              {" "}
              <span className="text-white">{suffix}</span>
            </>
          ) : null}
        </p>
        <p className="text-[#5d6165] text-sm mt-0.5">{item.statusLabel}</p>
      </div>
      <div className="px-2.5 py-1 rounded-full border border-[#5d6165] text-[#898c92] text-xs flex-shrink-0">
        {item.versionLabel}
      </div>
    </div>
  );
}

export default function ProfilePanel() {
  const [open, setOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(true);
  const items = useMusicStore((state) => state.items);
  const connection = useMusicStore((state) => state.connection);
  const error = useMusicStore((state) => state.error);

  const initials = "J";
  const isOnline = connection === "open";

  const activeGenerations = items.filter((item) => item.status !== "failed");
  const generationCards =
    activeGenerations.length > 0
      ? activeGenerations.slice(0, 2).map((item, index) => {
          const palette = item.versions?.[0]?.palette;
          const fallbackGradient =
            fallbackGradients[index % fallbackGradients.length];
          return {
            id: item.id,
            prompt: item.prompt || "Untitled generation",
            progress:
              item.status === "completed"
                ? 100
                : clampProgress(item.progress || 0),
            statusLabel: getStatusLabel(item.status),
            versionLabel: `v${index + 1}`,
            gradient: palette
              ? `linear-gradient(135deg, ${palette[0]}, ${palette[1]})`
              : fallbackGradient,
            isLoading: item.status !== "completed",
          };
        })
      : fallbackGenerations;

  const failedItem = items.find((item) => item.status === "failed");
  const invalidPrompt: InvalidPromptPreview = failedItem
    ? {
        title: "Invalid Prompt",
        prompt: failedItem.prompt,
        message: failedItem.error || "Your prompt does not seem to be valid.",
        hint: "Please provide a prompt related to song creation, remixing, covers, or similar.",
      }
    : fallbackInvalidPrompt;

  const errorDetail = error || "4.9K users in the queue.";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative flex items-center justify-center transition duration-100 active:scale-95"
        aria-label="Open profile"
        aria-expanded={open}
      >
        <AvatarRing
          size={40}
          initials={initials}
          showStatus
          statusColor={isOnline ? "#6BFFAC" : "#FF7A5A"}
        />
        <span className="sr-only">
          {connection === "open" ? "Online" : "Offline"}
        </span>
      </button>

      <div
        className={`absolute right-0 mt-4 w-[400px] rounded-[20px] overflow-hidden bg-[#16191c] p-5 text-sm text-white shadow-[0_12px_24px_rgba(0,0,0,0.48)] transition-all duration-300 z-50 ${
          open
            ? "opacity-100 translate-y-0"
            : "pointer-events-none opacity-0 -translate-y-2"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <AvatarRing size={72} initials={initials} />
            <div>
              <h2 className="text-white font-semibold text-lg">Johnny</h2>
              <p className="text-[#777a80] text-sm">@johnny</p>
            </div>
          </div>
          <button
            type="button"
            className="text-[#5d6165] hover:text-white transition-colors"
            aria-label="Profile settings"
          >
            <SettingsIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-4">
          <div className="bg-[#303438] rounded-full h-[44px] flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <span className="text-white font-medium text-sm">
                120/500 credits
              </span>
              <InfoIcon className="w-4 h-4 text-[#5d6165]" />
            </div>
            <button
              type="button"
              className="flex items-center gap-1 text-[#898c92] hover:text-white transition-colors"
            >
              <span className="text-sm">Top Up</span>
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="h-px bg-[#303438] mb-4" />

        {showWarning && (
          <div className="relative mb-4">
            <div className="bg-[#262a2e] rounded-xl p-4">
              <button
                type="button"
                onClick={() => setShowWarning(false)}
                className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#303438] flex items-center justify-center text-[#5d6165] hover:text-white transition-colors"
                aria-label="Dismiss warning"
              >
                <CloseIcon className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-start gap-3">
                <AlertTriangleIcon
                  className="w-5 h-5 text-[#d89c3a] flex-shrink-0 mt-0.5"
                  fill="#d89c3a"
                  stroke="#262a2e"
                />
                <div className="flex-1">
                  <p className="text-[#d89c3a] text-sm font-medium">
                    Insufficient credits
                  </p>
                  <p className="text-[#898c92] text-sm mt-0.5">
                    Your credit balance: 0
                  </p>
                </div>
                <button
                  type="button"
                  className="px-4 py-1.5 rounded-full border border-[#5d6165] text-white text-sm hover:bg-white/5 transition-colors"
                >
                  Top Up
                </button>
              </div>
            </div>
          </div>
        )}

        {generationCards.map((item, index) => (
          <GenerationCard
            key={item.id}
            item={item}
            isLast={index === generationCards.length - 1}
          />
        ))}

        <div className="bg-[#ee0d37]/15 rounded-xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <AlertTriangleIcon className="w-5 h-5 text-[#ee0d37] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[#ee0d37] text-sm font-medium">
                Oops! Server busy.
              </p>
              <p className="text-[#bfc2c8] text-sm mt-0.5">
                {errorDetail}{" "}
                <span className="underline cursor-pointer hover:text-white">
                  Retry
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-[56px] h-[56px] rounded-xl bg-[#d89c3a] flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-semibold text-[#1d2125]">!</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold">
              {invalidPrompt.title}
            </p>
            <p className="text-[#5d6165] text-sm mt-0.5 truncate">
              {invalidPrompt.prompt}
            </p>
            <p className="text-white text-sm mt-1">{invalidPrompt.message}</p>
            <p className="text-[#898c92] text-sm">{invalidPrompt.hint}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
