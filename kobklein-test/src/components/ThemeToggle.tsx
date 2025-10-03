"use client";
import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "@primer/octicons-react";

export default function ThemeToggle() {
  const [mode, setMode] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    const html = document.documentElement;
    const currentMode = html.getAttribute("data-color-mode");
    setMode(currentMode === "dark" ? "dark" : "light");
  }, []);

  const toggle = () => {
    const html = document.documentElement;
    const isDark = html.getAttribute("data-color-mode") === "dark";

    if (isDark) {
      html.setAttribute("data-color-mode", "light");
      html.setAttribute("data-light-theme", "light");
      setMode("light");
    } else {
      html.setAttribute("data-color-mode", "dark");
      html.setAttribute("data-dark-theme", "dark_dimmed");
      setMode("dark");
    }
  };

  if (!mode) return null;

  return (
    <button
      className="btn btn-sm btn-invisible"
      onClick={toggle}
      aria-label={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
    >
      {mode === "dark" ? (
        <SunIcon size={16} />
      ) : (
        <MoonIcon size={16} />
      )}
    </button>
  );
}