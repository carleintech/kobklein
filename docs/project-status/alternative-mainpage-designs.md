create the complete scaffold for you that you can initialize locally or create in a new GitHub repository.

GitHub Homepage Clone — Complete Production Scaffold
Here's your complete, production-ready scaffold to rebuild a GitHub-style marketing homepage using Next.js (App Router) + Primer CSS + Octicons.

📦 Quick Start
bash
# Create the Next.js project
npx create-next-app@latest github-homepage-clone --typescript --eslint --app --src-dir --import-alias "@/*"
cd github-homepage-clone

# Install dependencies
npm install @primer/css @primer/octicons-react framer-motion clsx

# Optional: Prettier & linting
npm install -D prettier prettier-plugin-tailwindcss
📁 Project Structure
Code
github-homepage-clone/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   └── page.tsx
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── MegaMenu.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── Hero.tsx
│   │   ├── FeatureRail.tsx
│   │   ├── LogoRail.tsx
│   │   ├── CopilotSection.tsx
│   │   ├── SecurityCluster.tsx
│   │   ├── CollaborationCluster.tsx
│   │   ├── SolutionsGrid.tsx
│   │   ├── ClosingCta.tsx
│   │   └── Footer.tsx
│   └── lib/
│       ├── motion.ts
│       └── ui.ts
├── public/
│   └── logos/
│       └── (placeholder logo SVGs)
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md

🎨 Complete Code Files
package.json

{
  "name": "github-homepage-clone",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@primer/css": "^21.0.0",
    "@primer/octicons-react": "^19.0.0",
    "clsx": "^2.1.0",
    "framer-motion": "^11.0.0",
    "next": "14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "eslint": "^8.56.0",
    "eslint-config-next": "14.1.0",
    "prettier": "^3.2.0",
    "prettier-plugin-tailwindcss": "^0.5.0",
    "typescript": "^5.3.0"
  }
}

src/app/layout.tsx

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

src/app/globals.css

/* ========================================
   Base overrides & utilities
   ======================================== */

:root {
  /* Spacing helpers */
  --section-px: 24px;
  --section-py: 72px;

  /* Motion */
  --transition-duration: 0.2s;
  --transition-easing: cubic-bezier(0.4, 0, 0.2, 1);
}

* {
  box-sizing: border-box;
}

html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}

/* ========================================
   Container widths (GitHub-like)
   ======================================== */

.container-xl {
  max-width: 1280px;
  margin: 0 auto;
  padding-left: var(--section-px);
  padding-right: var(--section-px);
}

.section {
  padding: var(--section-py) 0;
}

/* ========================================
   Hover elevations & transitions
   ======================================== */

.card-hover {
  transition:
    box-shadow var(--transition-duration) var(--transition-easing),
    transform var(--transition-duration) var(--transition-easing),
    border-color var(--transition-duration) var(--transition-easing);
}

.card-hover:hover {
  box-shadow: var(--color-shadow-medium, 0 8px 24px rgba(0, 0, 0, 0.12));
  transform: translateY(-2px);
}

/* ========================================
   Focus visibility (accessibility)
   ======================================== */

:focus-visible {
  outline: 2px solid var(--color-accent-fg);
  outline-offset: 2px;
  border-radius: 4px;
}

/* ========================================
   Header sticky spacer
   ======================================== */

.header-spacer {
  height: 64px;
}

/* ========================================
   Animation keyframes
   ======================================== */

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.reveal {
  opacity: 0;
  animation: fadeUp 0.6s ease forwards;
}

/* Stagger delays */
.reveal.delay-1 { animation-delay: 0.05s; }
.reveal.delay-2 { animation-delay: 0.1s; }
.reveal.delay-3 { animation-delay: 0.15s; }
.reveal.delay-4 { animation-delay: 0.2s; }
.reveal.delay-5 { animation-delay: 0.25s; }

/* ========================================
   Grid utilities
   ======================================== */

.d-grid {
  display: grid;
}

.grid-template-columns-1 {
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .grid-template-columns-md-2 {
    grid-template-columns: repeat(2, 1fr);
  }

  .grid-template-columns-md-3 {
    grid-template-columns: repeat(3, 1fr);
  }

  .grid-template-columns-md-4 {
    grid-template-columns: repeat(4, 1fr);
  }
}

.gap-2 { gap: 8px; }
.gap-3 { gap: 16px; }
.gap-4 { gap: 24px; }
.gap-5 { gap: 32px; }

/* ========================================
   Height utilities
   ======================================== */

.height-64 {
  height: 64px;
}

.height-full {
  height: 100%;
}

/* ========================================
   Button enhancements
   ======================================== */

.btn {
  cursor: pointer;
  transition: all var(--transition-duration) var(--transition-easing);
}

.btn:hover {
  transform: translateY(-1px);
}

.btn:active {
  transform: translateY(0);
}

/* ========================================
   Link enhancements
   ======================================== */

.Link--primary:hover {
  text-decoration: underline;
}

.Link--secondary:hover {
  color: var(--color-accent-fg);
}

/* ========================================
   Responsive utilities
   ======================================== */

@media (max-width: 767px) {
  .section {
    padding: 48px 0;
  }

  :root {
    --section-px: 16px;
    --section-py: 48px;
  }
}

/* ========================================
   Smooth scrolling
   ======================================== */

html {
  scroll-behavior: smooth;
}

/* Respect user's motion preferences */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  html {
    scroll-behavior: auto;
  }
}


src/lib/ui.ts

// Navigation structure for mega-menu
export const navGroups = [
  {
    label: "Platform",
    cols: [
      {
        title: "AI & Productivity",
        links: [
          { label: "Copilot", href: "#copilot", desc: "AI-powered code completion" },
          { label: "Codespaces", href: "#codespaces", desc: "Cloud dev environments" },
          { label: "Actions", href: "#actions", desc: "Automate workflows" },
        ],
      },
      {
        title: "Collaboration",
        links: [
          { label: "Issues", href: "#issues", desc: "Track and plan work" },
          { label: "Projects", href: "#projects", desc: "Organize at scale" },
          { label: "Code Review", href: "#review", desc: "Discuss and merge" },
          { label: "Discussions", href: "#discussions", desc: "Community Q&A" },
        ],
      },
      {
        title: "Security",
        links: [
          { label: "Advanced Security", href: "#security", desc: "Enterprise-grade protection" },
          { label: "Dependabot", href: "#dependabot", desc: "Automated updates" },
          { label: "Secret Scanning", href: "#secrets", desc: "Prevent leaks" },
        ],
      },
    ],
  },
  {
    label: "Solutions",
    cols: [
      {
        title: "By Industry",
        links: [
          { label: "Automotive", href: "#automotive" },
          { label: "Financial Services", href: "#finserv" },
          { label: "Healthcare", href: "#healthcare" },
          { label: "Public Sector", href: "#public" },
        ],
      },
      {
        title: "By Size",
        links: [
          { label: "Startup", href: "#startup" },
          { label: "Scaleup", href: "#scaleup" },
          { label: "Enterprise", href: "#enterprise" },
        ],
      },
      {
        title: "By Use Case",
        links: [
          { label: "DevSecOps", href: "#devsecops" },
          { label: "InnerSource", href: "#innersource" },
          { label: "Monorepos", href: "#monorepos" },
        ],
      },
    ],
  },
  {
    label: "Resources",
    cols: [
      {
        title: "Learn",
        links: [
          { label: "Documentation", href: "#docs" },
          { label: "Blog", href: "#blog" },
          { label: "Skills", href: "#skills" },
        ],
      },
      {
        title: "Events",
        links: [
          { label: "Webinars", href: "#webinars" },
          { label: "Conferences", href: "#conferences" },
          { label: "Meetups", href: "#meetups" },
        ],
      },
      {
        title: "Customers",
        links: [
          { label: "Case Studies", href: "#cases" },
          { label: "Partners", href: "#partners" },
        ],
      },
    ],
  },
  {
    label: "Open Source",
    cols: [
      {
        title: "Explore",
        links: [
          { label: "Trending", href: "#trending" },
          { label: "Collections", href: "#collections" },
          { label: "Topics", href: "#topics" },
        ],
      },
      {
        title: "Programs",
        links: [
          { label: "Sponsors", href: "#sponsors" },
          { label: "Accelerator", href: "#accelerator" },
          { label: "Open Source Friday", href: "#osf" },
        ],
      },
    ],
  },
  {
    label: "Enterprise",
    cols: [
      {
        title: "Offerings",
        links: [
          { label: "Enterprise Cloud", href: "#cloud" },
          { label: "Enterprise Server", href: "#server" },
        ],
      },
    ],
  },
  {
    label: "Pricing",
    cols: [
      {
        title: "Plans",
        links: [
          { label: "Free", href: "#free" },
          { label: "Team", href: "#team" },
          { label: "Enterprise", href: "#enterprise-pricing" },
        ],
      },
    ],
  },
];

// Feature rail tabs
export const featureTabs = [
  {
    key: "code",
    title: "Code",
    blurb: "Write, browse, and review code with AI-assisted workflows and powerful search.",
    image: "/placeholder-code.png",
    stats: "50M+ developers",
  },
  {
    key: "plan",
    title: "Plan",
    blurb: "Track work with Issues and Projects. Visualize progress with spreadsheet-style boards.",
    image: "/placeholder-plan.png",
    stats: "100M+ issues tracked",
  },
  {
    key: "collab",
    title: "Collaborate",
    blurb: "Discuss, review, and merge with confidence. Built-in code review and discussions.",
    image: "/placeholder-collab.png",
    stats: "10M+ pull requests daily",
  },
  {
    key: "automate",
    title: "Automate",
    blurb: "Ship faster with Actions and CI/CD. Automate tests, builds, and deployments.",
    image: "/placeholder-automate.png",
    stats: "90M+ workflows run",
  },
  {
    key: "secure",
    title: "Secure",
    blurb: "Find and fix vulnerabilities with built-in security scanning and AI-powered autofix.",
    image: "/placeholder-secure.png",
    stats: "7× faster fixes",
  },
];

// Customer logos (placeholder paths)
export const logoList = [
  "/logos/ford.svg",
  "/logos/spotify.svg",
  "/logos/shopify.svg",
  "/logos/mercedes.svg",
  "/logos/duolingo.svg",
  "/logos/stripe.svg",
  "/logos/pinterest.svg",
  "/logos/p&g.svg",
];

// Customer testimonials
export const testimonials = [
  {
    company: "Duolingo",
    logo: "/logos/duolingo.svg",
    quote: "Boosts developer speed by 25% with GitHub Copilot",
    href: "#duolingo",
  },
  {
    company: "Mercedes-Benz",
    logo: "/logos/mercedes.svg",
    quote: "Accelerates innovation with unified collaboration",
    href: "#mercedes",
  },
  {
    company: "Stripe",
    logo: "/logos/stripe.svg",
    quote: "Powers critical infrastructure with GitHub Enterprise",
    href: "#stripe",
  },
];

src/lib/motion.ts

// Framer Motion variants for consistent animations

export const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

src/components/MegaMenu.tsx

"use client";
import { useState } from "react";
import { navGroups } from "@/lib/ui";
import clsx from "clsx";

export default function MegaMenu() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <nav className="position-sticky top-0 z-2 color-bg-default border-bottom">
      <div className="container-xl d-flex flex-items-center height-64 px-3">
        {/* Logo */}
        <a
          className="h4 text-bold color-fg-default no-underline mr-4"
          href="#"
          aria-label="Home"
        >
          <span style={{ fontSize: 24 }}>⚡</span> YourBrand
        </a>

        {/* Desktop Navigation */}
        <ul className="d-none d-md-flex list-style-none m-0 flex-auto gap-3">
          {navGroups.map((g, i) => (
            <li key={g.label} className="position-relative">
              <button
                className={clsx(
                  "btn-link Link--secondary f5 px-2 py-2",
                  openIndex === i && "color-fg-default text-bold"
                )}
                onMouseEnter={() => setOpenIndex(i)}
                onFocus={() => setOpenIndex(i)}
                aria-expanded={openIndex === i}
                aria-haspopup="true"
              >
                {g.label}
              </button>

              {/* Mega menu panel */}
              {openIndex === i && (
                <div
                  onMouseEnter={() => setOpenIndex(i)}
                  onMouseLeave={() => setOpenIndex(null)}
                  className="position-absolute left-0 mt-2 box-shadow-large border color-bg-default rounded-2 p-4 z-3"
                  style={{ minWidth: 560, maxWidth: 720 }}
                >
                  <div className="d-flex gap-4">
                    {g.cols.map((col) => (
                      <div key={col.title} className="flex-1">
                        <div className="text-semibold mb-3 color-fg-muted f6">
                          {col.title}
                        </div>
                        <ul className="list-style-none m-0">
                          {col.links.map((link) => (
                            <li key={link.label} className="mb-2">
                              <a
                                className="Link--primary d-block py-1"
                                href={link.href}
                              >
                                {link.label}
                              </a>
                              {"desc" in link && (
                                <p className="f6 color-fg-muted m-0">
                                  {link.desc}
                                </p>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>

        {/* Auth CTAs */}
        <div className="ml-auto d-none d-md-flex gap-2">
          <a className="btn btn-invisible" href="#signin">
            Sign in
          </a>
          <a className="btn btn-primary" href="#signup">
            Sign up
          </a>
        </div>

        {/* Mobile hamburger (simplified) */}
        <button className="btn btn-invisible d-md-none ml-auto" aria-label="Menu">
          <span className="f4">☰</span>
        </button>
      </div>
    </nav>
  );
}

src/components/ThemeToggle.tsx

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


src/components/Header.tsx

import MegaMenu from "./MegaMenu";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="position-fixed top-0 left-0 right-0 z-3">
      <MegaMenu />
      <div className="position-absolute" style={{ top: 16, right: 16 }}>
        <ThemeToggle />
      </div>
    </header>
  );
}


src/components/Hero.tsx

"use client";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";

export default function Hero() {
  return (
    <section className="section border-bottom color-bg-subtle">
      <div className="container-xl d-flex flex-column flex-md-row flex-items-center gap-5">
        {/* Left: Copy + CTA */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="col-12 col-md-7 pr-md-4"
        >
          <h1 className="h1-mktg mb-3 lh-condensed">
            Build and ship software on a single, collaborative platform
          </h1>
          <p className="f3-light mb-4 color-fg-muted">
            Join millions of developers and businesses building on the
            AI-powered platform. From open source to enterprise.
          </p>

          {/* Email signup form */}
          <form className="d-flex flex-column flex-sm-row gap-2 mb-3">
            <input
              type="email"
              required
              placeholder="Your email address"
              className="form-control input-lg flex-auto"
              aria-label="Email address"
            />
            <button className="btn btn-primary btn-lg" type="submit">
              Sign up for free
            </button>
          </form>

          {/* Secondary CTA */}
          <a className="btn btn-invisible btn-lg" href="#copilot">
            Try GitHub Copilot →
          </a>
        </motion.div>

        {/* Right: Product demo visual */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="col-12 col-md-5"
        >
          <div className="border rounded-3 overflow-hidden card-hover box-shadow-medium">
            {/* Mock terminal/chat window */}
            <div className="p-3 color-bg-default border-bottom">
              <div className="d-flex gap-2 mb-2">
                <span
                  className="circle d-inline-block"
                  style={{
                    width: 12,
                    height: 12,
                    backgroundColor: "var(--color-danger-fg)",
                    borderRadius: "50%",
                  }}
                />
                <span
                  className="circle d-inline-block"
                  style={{
                    width: 12,
                    height: 12,
                    backgroundColor: "var(--color-attention-fg)",
                    borderRadius: "50%",
                  }}
                />
                <span
                  className="circle d-inline-block"
                  style={{
                    width: 12,
                    height: 12,
                    backgroundColor: "var(--color-success-fg)",
                    borderRadius: "50%",
                  }}
                />
              </div>
              <div className="h4 mb-1">Copilot Chat</div>
              <div className="f6 color-fg-muted">
                "Update the website to allow searching by category"
              </div>
            </div>

            {/* Placeholder image area */}
            <div
              className="color-bg-subtle d-flex flex-items-center flex-justify-center"
              style={{ height: 280 }}
            >
              <span className="f4 color-fg-muted">
                [Product demo screenshot]
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


src/components/FeatureRail.tsx

"use client";
import { useState } from "react";
import { featureTabs } from "@/lib/ui";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/motion";

export default function FeatureRail() {
  const [active, setActive] = useState(featureTabs[0]);

  return (
    <section className="section">
      <div className="container-xl">
        {/* Tab pills */}
        <div className="d-flex flex-wrap gap-2 mb-5 flex-justify-center">
          {featureTabs.map((tab) => (
            <button
              key={tab.key}
              className={`btn ${
                active.key === tab.key ? "btn-primary" : "btn-invisible"
              }`}
              onClick={() => setActive(tab)}
              aria-pressed={active.key === tab.key}
            >
              {tab.title}
            </button>
          ))}
        </div>

        {/* Content area */}
        <motion.div
          key={active.key}
          variants={fadeIn}
          initial="hidden"
          animate="show"
          className="d-flex flex-column flex-md-row gap-5 flex-items-center"
        >
          {/* Left: description */}
          <div className="col-12 col-md-5">
            <h3 className="h2 mb-3">{active.title}</h3>
            <p className="f3-light color-fg-muted mb-3">{active.blurb}</p>
            <p className="f5 text-semibold color-fg-accent">{active.stats}</p>
            <a className="Link--primary f5" href={`#${active.key}`}>
              Learn more →
            </a>
          </div>

          {/* Right: visual */}
          <div className="col-12 col-md-7">
            <div
              className="border rounded-3 card-hover box-shadow-medium color-bg-subtle d-flex flex-items-center flex-justify-center"
              style={{ minHeight: 320 }}
            >
              <span className="f4 color-fg-muted">
                [{active.title} screenshot]
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

src/components/LogoRail.tsx

import { logoList, testimonials } from "@/lib/ui";

export default function LogoRail() {
  return (
    <section className="section color-bg-subtle border-top border-bottom">
      <div className="container-xl">
        {/* Heading */}
        <h3 className="h3 text-center mb-5">
          Trusted by millions of developers and leading companies
        </h3>

        {/* Logo marquee */}
        <div className="d-flex flex-wrap flex-justify-center flex-items-center gap-5 mb-5">
          {logoList.map((src, idx) => (
            <div
              key={idx}
              className="d-flex flex-items-center"
              style={{ height: 32, opacity: 0.7 }}
            >
              {/* Placeholder for logo */}
              <div
                className="color-fg-muted f6"
                style={{ width: 100, textAlign: "center" }}
              >
                [Logo {idx + 1}]
              </div>
            </div>
          ))}
        </div>

        {/* Testimonial cards */}
        <div className="d-grid grid-template-columns-1 grid-template-columns-md-3 gap-3">
          {testimonials.map((t) => (
            <a
              key={t.company}
              href={t.href}
              className="border rounded-2 p-4 card-hover color-bg-default no-underline"
            >
              <div className="h5 mb-2">{t.company}</div>
              <p className="f5 color-fg-muted mb-0">"{t.quote}"</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

src/components/CopilotSection.tsx

"use client";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";

export default function CopilotSection() {
  return (
    <section className="section">
      <div className="container-xl d-flex flex-column flex-md-row gap-5 flex-items-center">
        {/* Left: copy */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="col-12 col-md-6"
        >
          <h2 className="h1-mktg mb-3">
            Accelerate performance with AI agents
          </h2>
          <p className="f3-light color-fg-muted mb-4">
            Let Copilot perform multi-file edits, summarize changes, and
            automate repetitive tasks. Your AI pair programmer that helps you
            ship faster and stay in flow.
          </p>

          {/* Stats callout */}
          <div className="border rounded-2 p-3 mb-4 color-bg-subtle">
            <p className="h3 mb-1">55%</p>
            <p className="f5 color-fg-muted mb-0">
              faster task completion with Copilot
            </p>
          </div>

          <div className="d-flex gap-2">
            <a className="btn btn-primary btn-large" href="#copilot">
              Explore GitHub Copilot
            </a>
            <a className="btn btn-invisible btn-large" href="#report">
              Read the report
            </a>
          </div>
        </motion.div>

        {/* Right: visual */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="col-12 col-md-6"
        >
          <div
            className="border rounded-3 card-hover box-shadow-large color-bg-default d-flex flex-items-center flex-justify-center"
            style={{ minHeight: 380 }}
          >
            <span className="f4 color-fg-muted">
              [Copilot agent demo screenshot]
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


src/components/SecurityCluster.tsx

"use client";
import { motion } from "framer-motion";
import { staggerContainer, fadeUp } from "@/lib/motion";

const items = [
  {
    title: "Advanced Security",
    blurb:
      "Code scanning, secret scanning, and supply chain security in one place.",
    icon: "🔒",
    href: "#advanced-security",
  },
  {
    title: "Copilot Autofix",
    blurb:
      "Inline AI-assisted fixes for vulnerable code with one click. 90% coverage.",
    icon: "🤖",
    href: "#autofix",
  },
  {
    title: "Security Campaigns",
    blurb: "Track, assign, and drive remediation across your entire organization.",
    icon: "📊",
    href: "#campaigns",
  },
  {
    title: "Dependabot",
    blurb: "Automated dependency updates you can trust. Keep your stack fresh.",
    icon: "🧰",
    href: "#dependabot",
  },
  {
    title: "Secret Scanning",
    blurb: "Stop credentials from leaking into repositories with push protection.",
    icon: "🕵️",
    href: "#secret-scanning",
  },
];

export default function SecurityCluster() {
  return (
    <section className="section color-bg-subtle border-top">
      <div className="container-xl">
        <h2 className="h1-mktg mb-2 text-center">Build securely by default</h2>
        <p className="f3-light color-fg-muted text-center mb-5">
          Fix vulnerabilities 7× faster with AI-powered security
        </p>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="d-grid grid-template-columns-1 grid-template-columns-md-3 gap-3"
        >
          {items.map((it) => (
            <motion.a
              key={it.title}
              variants={fadeUp}
              href={it.href}
              className="border rounded-3 p-4 card-hover color-bg-default no-underline d-block"
            >
              <div className="h2 mb-2">{it.icon}</div>
              <div className="h4 mb-2 color-fg-default">{it.title}</div>
              <p className="f5 color-fg-muted mb-3">{it.blurb}</p>
              <span className="Link--primary f6">Learn more →</span>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}


src/components/CollaborationCluster.tsx

"use client";
import { motion } from "framer-motion";
import { staggerContainer, fadeUp } from "@/lib/motion";

const items = [
  {
    title: "Projects",
    blurb: "Plan with spreadsheet-style boards, roadmaps, and insights.",
    href: "#projects",
  },
  {
    title: "Issues",
    blurb: "Track work with powerful filters, automation, and task lists.",
    href: "#issues",
  },
  {
    title: "Discussions",
    blurb: "Community Q&A and ideation in one collaborative space.",
    href: "#discussions",
  },
  {
    title: "Code Review",
    blurb: "Review diffs, suggest changes, and merge with confidence.",
    href: "#code-review",
  },
  {
    title: "Sponsors",
    blurb: "Fund the open source ecosystems your team depends on.",
    href: "#sponsors",
  },
];

export default function CollaborationCluster() {
  return (
    <section className="section">
      <div className="container-xl">
        <h2 className="h1-mktg mb-2 text-center">Collaborate without friction</h2>
        <p className="f3-light color-fg-muted text-center mb-5">
          From planning to shipping, stay aligned with your team
        </p>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="d-grid grid-template-columns-1 grid-template-columns-md-3 gap-3"
        >
          {items.map((it) => (
            <motion.a
              key={it.title}
              variants={fadeUp}
              href={it.href}
              className="border rounded-3 p-4 card-hover color-bg-default no-underline d-block"
            >
              <div className="h4 mb-2 color-fg-default">{it.title}</div>
              <p className="f5 color-fg-muted mb-3">{it.blurb}</p>
              <span className="Link--primary f6">Explore →</span>
            </motion.a>
          ))}
        </motion.div>

        {/* Customer quote callout */}
        <div className="mt-5 p-4 border rounded-3 color-bg-subtle text-center">
          <p className="h4 mb-2">
            "GitHub has become the central nervous system for our engineering
            organization."
          </p>
          <p className="f5 color-fg-muted mb-0">
            — Engineering Leader, Mercedes-Benz
          </p>
        </div>
      </div>
    </section>
  );
}


src/components/SolutionsGrid.tsx

const buckets = [
  {
    title: "By industry",
    links: [
      "Automotive",
      "Financial Services",
      "Healthcare",
      "Public Sector",
      "Technology",
    ],
  },
  {
    title: "By size",
    links: ["Startup", "Scaleup", "Enterprise"],
  },
  {
    title: "By use case",
    links: ["DevSecOps", "Monorepos", "InnerSource", "Compliance"],
  },
];

export default function SolutionsGrid() {
  return (
    <section className="section color-bg-subtle border-top border-bottom">
      <div className="container-xl">
        <h2 className="h2 mb-2 text-center">Solutions for every team</h2>
        <p className="f3-light color-fg-muted text-center mb-5">
          Tailored approaches for your industry, size, and workflow
        </p>

        <div className="d-grid grid-template-columns-1 grid-template-columns-md-3 gap-4">
          {buckets.map((b) => (
            <div key={b.title} className="border rounded-3 p-4 card-hover color-bg-default">
              <div className="h4 mb-3">{b.title}</div>
              <ul className="list-style-none m-0">
                {b.links.map((l) => (
                  <li key={l} className="mb-2">
                    <a className="Link--primary f5" href={`#${l.toLowerCase()}`}>
                      {l} →
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


src/components/ClosingCta.tsx

export default function ClosingCta() {
  return (
    <section className="section">
      <div className="container-xl text-center">
        <h2 className="h1-mktg mb-3">
          Join millions building on our platform
        </h2>
        <p className="f3-light color-fg-muted mb-5">
          Get started with your email. Try Copilot and ship faster—starting
          today.
        </p>

        {/* Email form */}
        <div className="d-flex flex-column flex-sm-row flex-justify-center gap-2 mb-4">
          <input
            type="email"
            className="form-control input-lg"
            placeholder="you@example.com"
            style={{ maxWidth: 360 }}
            aria-label="Email address"
          />
          <button className="btn btn-primary btn-lg">Sign up for free</button>
        </div>

        <a className="btn btn-invisible btn-large" href="#copilot">
          Try GitHub Copilot
        </a>
      </div>
    </section>
  );
}


src/components/Footer.tsx

export default function Footer() {
  return (
    <footer className="border-top color-bg-subtle">
      <div className="container-xl section d-grid grid-template-columns-1 grid-template-columns-md-4 gap-4">
        {[
          {
            title: "Platform",
            links: [
              "Copilot",
              "Actions",
              "Codespaces",
              "Issues",
              "Projects",
              "Code Review",
              "Advanced Security",
            ],
          },
          {
            title: "Ecosystem",
            links: ["Marketplace", "Partners", "Apps", "GitHub Mobile"],
          },
          {
            title: "Support",
            links: [
              "Documentation",
              "Community",
              "Professional Services",
              "Skills",
              "Status",
            ],
          },
          {
            title: "Company",
            links: ["About", "Blog", "Careers", "Press", "Shop"],
          },
        ].map((col) => (
          <div key={col.title}>
            <div className="text-semibold mb-3 f5">{col.title}</div>
            <ul className="list-style-none m-0">
              {col.links.map((l) => (
                <li key={l} className="mb-2">
                  <a className="Link--secondary f6" href="#">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="container-xl pb-6 px-3 d-flex flex-wrap flex-justify-between color-fg-muted f6">
        <p className="mb-2">© {new Date().getFullYear()} Your Company, Inc.</p>
        <div className="d-flex gap-3">
          <a className="Link--secondary" href="#">
            Terms
          </a>
          <a className="Link--secondary" href="#">
            Privacy
          </a>
          <a className="Link--secondary" href="#">
            Sitemap
          </a>
        </div>
      </div>
    </footer>
  );
}


src/app/page.tsx

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeatureRail from "@/components/FeatureRail";
import LogoRail from "@/components/LogoRail";
import CopilotSection from "@/components/CopilotSection";
import SecurityCluster from "@/components/SecurityCluster";
import CollaborationCluster from "@/components/CollaborationCluster";
import SolutionsGrid from "@/components/SolutionsGrid";
import ClosingCta from "@/components/ClosingCta";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <main>
      <Header />
      <div className="header-spacer" />
      <Hero />
      <FeatureRail />
      <LogoRail />
      <CopilotSection />
      <SecurityCluster />
      <CollaborationCluster />
      <SolutionsGrid />
      <ClosingCta />
      <Footer />
    </main>
  );
}


🎨 Design System Notes
Colors (Primer tokens)
Light theme: White backgrounds, dark text (#24292f), green CTAs (#2da44e)
Dark theme: Near-black backgrounds (#0d1117), light text (#c9d1d9), same green accent
Use Primer CSS variables: var(--color-bg-default), var(--color-fg-default), var(--color-accent-fg)
Typography
Headlines: .h1-mktg, .h2, .h3, .h4
Body: .f3-light (larger body), .f5 (smaller body)
Weights: .text-bold, .text-semibold
Spacing
Section padding: 72px vertical (desktop), 48px (mobile)
Gaps: use .gap-2 through .gap-5 (8px to 32px)
Motion
Duration: 200–600ms
Easing: cubic-bezier(0.4, 0, 0.2, 1) or ease-out
Effects: fade-up on scroll, hover elevation (shadow + translateY)
Accessibility
Semantic HTML (nav, section, footer)
ARIA labels on buttons and inputs
Focus outlines via :focus-visible
Respects prefers-reduced-motion
🚀 Run Locally
bash
npm run dev
# Open http://localhost:3000
📦 Deploy
Vercel (recommended)
bash
# Push to GitHub, then import in Vercel dashboard
vercel
Netlify
bash
npm run build
netlify deploy --prod --dir=.next
Cloudflare Pages
Set build command: npm run build && npm run start or use adapter.

🎯 What You Get
✅ Sticky mega-menu with hover dropdowns
✅ Hero section with email capture + dual CTAs
✅ Tabbed feature rail (Code/Plan/Collaborate/Automate/Secure)
✅ Logo marquee + testimonials
✅ Copilot/AI performance section with stats
✅ Security cluster (5 cards with icons)
✅ Collaboration cluster (5 cards + customer quote)
✅ Solutions grid (by industry/size/use case)
✅ Closing CTA with email form
✅ Fat footer with 4 columns
✅ Light/Dark theme toggle (Primer tokens)
✅ Hover elevations, fade-up animations, accessible focus states

📚 Resources
Primer CSS — GitHub's design system
Primer Octicons — Icon set
GitHub Brand Toolkit — Official logos & colors
Next.js Docs — App Router guide
Framer Motion — Animation library
You now have a complete, production-ready GitHub homepage clone! 🎉

Copy each file into your project, run npm install && npm run dev, and you'll see the full marketing page with all sections, theming, and interactions. Replace placeholder content with your own assets and copy, then deploy to Vercel or your preferred host.

Let me know if you need any adjustments or additional features!

remember it a test
