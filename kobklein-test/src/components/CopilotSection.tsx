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