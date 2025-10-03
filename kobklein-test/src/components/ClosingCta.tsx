export default function ClosingCta() {
  return (
    <section className="section">
      <div className="container-xl text-center">
        <h2 className="h1-mktg mb-3">
          Join millions building on our platform
        </h2>
        <p className="f3-light color-fg-muted mb-5">
          Get started with your email. Try Copilot and ship faster—starting
          today.
        </p>

        {/* Email form */}
        <div className="d-flex flex-column flex-sm-row flex-justify-center gap-2 mb-4">
          <input
            type="email"
            className="form-control input-lg"
            placeholder="you@example.com"
            style={{ maxWidth: 360 }}
            aria-label="Email address"
          />
          <button className="btn btn-primary btn-lg">Sign up for free</button>
        </div>

        <a className="btn btn-invisible btn-large" href="#copilot">
          Try GitHub Copilot
        </a>
      </div>
    </section>
  );
}