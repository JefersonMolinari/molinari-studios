export default function Home() {
  return (
    <main>
      <section className="hero" id="top">
        <header className="site-header shell">
          <a className="brand" href="#top" aria-label="Molinari Studios home">
            <img src="/molinari-horizontal.svg" alt="Molinari STUDIOS" />
          </a>

          <nav aria-label="Primary navigation">
            <a href="#services">Services</a>
            <a href="#process">Process</a>
            <a href="#work">Work</a>
          </nav>

          <a className="header-cta" href="#contact">
            Start a project
          </a>
        </header>

        <div className="hero-grid shell">
          <div className="hero-copy">
            <p className="eyebrow"><span /> Custom 3D printing</p>
            <h1>Ideas, made <em>tangible.</em></h1>
            <p className="hero-intro">
              From first sketch to final form, Molinari STUDIOS turns ambitious
              ideas into precisely crafted objects.
            </p>
            <div className="hero-actions">
              <a className="button button-brass" href="#contact">Start a project <span>↗</span></a>
              <a className="text-link" href="#work">Explore our work <span>↓</span></a>
            </div>
          </div>

          <div className="hero-object" aria-label="Abstract layered 3D form">
            <div className="object-ring ring-one" />
            <div className="object-ring ring-two" />
            <div className="object-core">
              <img src="/molinari-mark.svg" alt="" aria-hidden="true" />
            </div>
            <p className="object-note note-top">Layer by layer</p>
            <p className="object-note note-bottom">Made with intent</p>
          </div>
        </div>

        <div className="hero-footer shell">
          <p>Design-led fabrication</p>
          <p>Small runs · One-offs · Prototypes</p>
          <a href="#services" aria-label="Scroll to services">Scroll <span>↓</span></a>
        </div>
      </section>

      <section className="services-section section" id="services">
        <div className="shell">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Studio capabilities</p>
              <h2>From rough idea to <em>resolved object.</em></h2>
            </div>
            <p className="section-lede">
              Thoughtful fabrication for the objects that need to fit, function,
              and feel right—not just look good on screen.
            </p>
          </div>

          <div className="services-grid">
            <article className="service-card featured-service">
              <div className="service-index">01</div>
              <div className="service-symbol symbol-prototype" aria-hidden="true"><span /></div>
              <h3>Product &amp; prototyping</h3>
              <p>Proof-of-concept parts, fit checks, enclosures, and design iterations made for real-world testing.</p>
              <ul><li>Concept models</li><li>Functional parts</li><li>Design refinement</li></ul>
            </article>
            <article className="service-card">
              <div className="service-index">02</div>
              <div className="service-symbol symbol-repair" aria-hidden="true"><span /></div>
              <h3>Replacement &amp; restoration</h3>
              <p>Hard-to-find pieces thoughtfully recreated from an existing part, a sketch, or careful measurements.</p>
              <ul><li>Reverse engineering</li><li>Legacy components</li><li>Custom-fit solutions</li></ul>
            </article>
            <article className="service-card">
              <div className="service-index">03</div>
              <div className="service-symbol symbol-display" aria-hidden="true"><span /></div>
              <h3>Display &amp; decorative</h3>
              <p>Distinctive objects, display pieces, and custom forms with a finish worthy of the idea.</p>
              <ul><li>One-off objects</li><li>Scale models</li><li>Presentation pieces</li></ul>
            </article>
            <article className="service-card">
              <div className="service-index">04</div>
              <div className="service-symbol symbol-batch" aria-hidden="true"><span /><span /><span /></div>
              <h3>Small-batch production</h3>
              <p>Consistent short runs for creators and small businesses, without committing to mass production.</p>
              <ul><li>Repeatable output</li><li>Part finishing</li><li>Ready-to-use runs</li></ul>
            </article>
          </div>
        </div>
      </section>

      <section className="studio-statement section">
        <div className="shell statement-grid">
          <div className="statement-art" aria-label="Layered material study">
            <div className="material-slab slab-back" />
            <div className="material-slab slab-mid" />
            <div className="material-slab slab-front"><img src="/molinari-mark.svg" alt="" /></div>
            <span className="measure-line measure-a">0.2 mm layers</span>
            <span className="measure-line measure-b">Built to purpose</span>
          </div>
          <div className="statement-copy">
            <p className="section-kicker light">The Molinari approach</p>
            <blockquote>“Good fabrication begins long before the print starts.”</blockquote>
            <p>We consider how a part will be used, handled, assembled, and seen. That thinking shapes every decision—from geometry and material to layer direction and finish.</p>
            <div className="statement-values">
              <div><strong>Purpose</strong><span>Every detail earns its place.</span></div>
              <div><strong>Precision</strong><span>Measured, tested, refined.</span></div>
              <div><strong>Finish</strong><span>Made to be handled and kept.</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="process-section section" id="process">
        <div className="shell">
          <div className="section-heading compact-heading">
            <div>
              <p className="section-kicker">How we work</p>
              <h2>Four deliberate <em>steps.</em></h2>
            </div>
            <p className="section-lede">A clear path from what you have now to something you can hold.</p>
          </div>
          <ol className="process-list">
            <li><span className="step-number">01</span><div className="step-marker" /><div><h3>Discover</h3><p>Share the idea, use case, dimensions, and any files or reference parts you already have.</p></div></li>
            <li><span className="step-number">02</span><div className="step-marker" /><div><h3>Develop</h3><p>We clarify the geometry, material, finish, and print strategy before anything is made.</p></div></li>
            <li><span className="step-number">03</span><div className="step-marker" /><div><h3>Print</h3><p>Your piece is produced with the process and orientation chosen for its real purpose.</p></div></li>
            <li><span className="step-number">04</span><div className="step-marker" /><div><h3>Finish</h3><p>We inspect, refine, and prepare the final object so it arrives ready for what comes next.</p></div></li>
          </ol>
        </div>
      </section>

      <section className="work-section section" id="work">
        <div className="shell">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Made for the real world</p>
              <h2>Objects with a <em>job to do.</em></h2>
            </div>
            <p className="section-lede">A few of the ways considered 3D printing can move an idea forward.</p>
          </div>
          <div className="work-grid">
            <article className="work-card work-card-wide">
              <div className="work-visual functional-visual" aria-hidden="true"><div className="part part-a"/><div className="part part-b"/><div className="part part-c"/></div>
              <div className="work-meta"><div><span>Application 01</span><h3>Functional prototyping</h3></div><p>Test fit, movement, assembly, and intent before committing to the final form.</p></div>
            </article>
            <article className="work-card">
              <div className="work-visual detail-visual" aria-hidden="true"><div className="detail-column"/><div className="detail-shadow"/></div>
              <div className="work-meta"><div><span>Application 02</span><h3>Architectural detail</h3></div><p>Models and components that make scale, proportion, and detail easy to understand.</p></div>
            </article>
            <article className="work-card">
              <div className="work-visual display-visual" aria-hidden="true"><div className="display-plinth"/><div className="display-object"/></div>
              <div className="work-meta"><div><span>Application 03</span><h3>Collector display</h3></div><p>Tailored mounts, stands, and presentation pieces that quietly support what matters.</p></div>
            </article>
          </div>
        </div>
      </section>

      <section className="capabilities-strip">
        <div className="shell capabilities-list">
          <span>FDM printing</span><i />
          <span>Resin printing</span><i />
          <span>CAD refinement</span><i />
          <span>Surface finishing</span><i />
          <span>Small runs</span>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="shell contact-grid">
          <div className="contact-mark"><img src="/molinari-mark.svg" alt="" /></div>
          <div className="contact-copy">
            <p className="section-kicker light">Have something in mind?</p>
            <h2>Build your <em>project brief.</em></h2>
            <p>Start with what you know. A sketch, a broken part, a CAD file, or even a rough description is enough to begin the conversation.</p>
            <a className="button button-cream" href="mailto:?subject=Molinari%20STUDIOS%20project%20enquiry&amp;body=Project%20type%3A%0AWhat%20it%20needs%20to%20do%3A%0AApproximate%20size%3A%0AQuantity%3A%0ATimeline%3A%0AFiles%20or%20references%3A">
              Draft an enquiry <span>↗</span>
            </a>
            <small>Opens a ready-to-fill project brief in your email app.</small>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="shell footer-grid">
          <a className="footer-brand" href="#top"><img src="/molinari-horizontal.svg" alt="Molinari STUDIOS" /></a>
          <p>Custom 3D printing · Design-led fabrication</p>
          <a href="#top">Back to top ↑</a>
        </div>
      </footer>
    </main>
  );
}
