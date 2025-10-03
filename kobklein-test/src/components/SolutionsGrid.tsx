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