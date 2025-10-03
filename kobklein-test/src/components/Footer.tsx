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