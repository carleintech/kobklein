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