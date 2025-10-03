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