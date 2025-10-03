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