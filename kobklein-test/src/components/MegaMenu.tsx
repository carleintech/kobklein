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