"use client";

import React from "react";

interface LoaderProps {
  /** show a small text message under the spinner */
  message?: string;
  /** when true, overlay covers the whole viewport */
  fullScreen?: boolean;
  /** spinner size */
  size?: "sm" | "md" | "lg";
  /** hide the message completely (default true) */
  showMessage?: boolean;
}

export default function Loader({ message = "", fullScreen = false, size = "md", showMessage = false }: LoaderProps) {
  const svgSizes: Record<string, string> = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={`${fullScreen ? "fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm" : "inline-flex items-center justify-center"}`}
    >
      <div className={`flex flex-col items-center ${fullScreen ? "p-0" : "p-0"}`}>
        <div className={`rounded-full bg-white/80 dark:bg-black/60 shadow-md flex items-center justify-center p-3`}>
          <svg className={`${svgSizes[size]} animate-spin`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#D0BB95" strokeWidth="2" strokeOpacity="0.22"></circle>
            <path d="M22 12a10 10 0 0 1-10 10" stroke="#D0BB95" strokeWidth="2" strokeLinecap="round" fill="none"></path>
          </svg>
        </div>

        {showMessage && message ? (
          <span className="text-sm font-medium text-gray-600 tracking-wide mt-3">{message}</span>
        ) : null}
      </div>
    </div>
  );
}