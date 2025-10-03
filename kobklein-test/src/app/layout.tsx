import "@primer/css/dist/primer.css";
import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Your Product — AI-Powered Developer Platform",
  description: "Build and ship software on a single, collaborative platform with AI assistance.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  // Primer color mode via data attributes
  // Options: light | dark | auto
  // Themes: light | dark_dimmed | dark_high_contrast
  return (
    <html 
      lang="en" 
      data-color-mode="auto" 
      data-light-theme="light" 
      data-dark-theme="dark_dimmed"
      suppressHydrationWarning
    >
      <body className="color-bg-default color-fg-default">
        {children}
      </body>
    </html>
  );
}