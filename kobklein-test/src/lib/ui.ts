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