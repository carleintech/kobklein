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