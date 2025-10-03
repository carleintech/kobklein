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