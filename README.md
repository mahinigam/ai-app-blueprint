# AI App Blueprint

An interactive, monochrome field guide to the recurring engineering decisions behind AI applications. It is organized around five practical lenses—context and retrieval, latency and cost, evaluation, security, and controlled tool use—plus an integrated capstone.

## Learning path

Each module uses the same set of views:

- **Concepts** — the problem, mental model, trade-offs, and use cases.
- **Diagram** — a visual path through relevant components.
- **Code** — illustrative snippets and interface ideas.
- **Incidents** — symptoms, hypotheses, diagnostic evidence, and possible fixes.
- **Ship check** — module-specific acceptance criteria and primary references.

Treat the five lenses as a teaching framework, not a universal production architecture. Some applications need no RAG or agent loop; every system still needs requirements, identity and access controls, reliability, observability, privacy, and an operational plan.

The diagrams and simulations use illustrative values; they are not live model benchmarks. Provider pricing, cache behavior, and latency vary by provider, configuration, region, and workload. Measure your own traffic and define release thresholds from requirements.

## Run locally

This is a static single-page app.

1. Clone the repository.
2. Open `index.html` directly, or serve the directory with a static file server. For example:

   ```bash
   python3 -m http.server 8000
   ```

3. Open `http://localhost:8000`.

Tailwind CSS and fonts currently load from CDNs, so an internet connection is needed for the intended typography and layout styling unless those assets are bundled locally.

## Quality checks

Node.js 22 or newer can run the dependency-free static tests:

```bash
node --test scripts/quality.test.mjs
```

The checks validate inline JavaScript syntax, seven-module navigation, detail-tab and ship-check wiring, responsive and accessibility hooks, and the absence of selected unqualified price/performance claims. GitHub Actions runs the checks on pushes to the review branch and `main`, plus pull requests targeting `main`.

Static tests are not browser tests. Before release, also check desktop, tablet, and narrow mobile layouts; exercise every canvas control, module, quiz, and tab; verify external references; and inspect keyboard, screen-reader, and reduced-motion behavior.

## Content and design standards

- Prefer official documentation, standards, and reproducible evidence for technical claims.
- Avoid hard-coded pricing or universal latency/savings promises without a dated source, measurement setup, and workload.
- Label code that omits real adapters, authentication, authorization, secrets handling, timeouts, retries, and tests as illustrative.
- Enforce data access and tool authorization in server-side code; prompt delimiters and classifiers are defense in depth, not security boundaries.
- Preserve the near-black canvas, restrained greys, dotted borders, monospace metadata, and technical diagrams.
- Prefer useful interactions and clear evidence over decorative effects; respect reduced-motion settings and keep navigation usable at narrow widths.
