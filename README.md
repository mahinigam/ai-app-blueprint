# AI App Blueprint

A monochrome, interactive field guide to the recurring engineering decisions behind AI applications. The guide is organized around five areas—context and retrieval, latency and cost, evaluation, security, and controlled tool use—plus an integrated capstone.

## What the guide is for

Use it as a structured learning path and a design-review checklist, not as a universal architecture or a substitute for your own threat model and engineering judgment.

Each module contains:
- **Concepts** — core mental models and trade-offs.
- **Architecture** — a visual path through the relevant components.
- **Code spec** — illustrative snippets and interface ideas.
- **Incidents** — symptoms, likely causes, and diagnostic fixes.
- **Ship check** — module-specific acceptance checks and primary references.

The canvas diagrams and numerical examples are teaching aids. They are not live benchmarks. Model prices, cache behavior, and latency vary by provider, configuration, region, and workload; measure them against your own traffic.

## Run locally

This is a static single-page app; there is no build step.

1. Clone the repository.
2. Open `index.html` in a browser, or serve the directory with any static file server.
3. For example, with Python installed:

   ```bash
   python3 -m http.server 8000
   ```

   Then open `http://localhost:8000`.

The page currently uses Tailwind CSS from its CDN. An internet connection is required for the CDN stylesheet unless you replace it with a local build.

## How to improve the guide

For technical edits, prefer first-party documentation and standards (for example, OWASP GenAI Security, NIST AI RMF, provider documentation, and architecture guidance). Avoid hard-coded pricing and performance guarantees unless a dated source, test setup, and workload are stated. Treat code samples as illustrative unless their dependencies, tests, error handling, identity checks, and deployment assumptions are explicit.

## Design principles

- Preserve the near-black canvas, restrained greys, fine dotted borders, monospace metadata, and technical diagrams.
- Prefer useful interactions and concrete evidence over decorative animation.
- Make mobile layouts, keyboard access, contrast, and reduced-motion behavior part of review.
- Keep the five pillars as a learning lens; cover identity, reliability, observability, deployment, privacy, and data governance in the capstone.

## Validation

With Node.js 20 or newer installed, run the static checks locally:

```bash
node scripts/check-static.mjs
```

The check validates inline JavaScript syntax, duplicate static HTML IDs, module and tab wiring, ship-check coverage, quiz structure, and reduced-motion support. GitHub Actions runs the same check on pushes to `main` and `final-quality-pass`, and on pull requests targeting `main`.

This is a static smoke check, not a replacement for browser testing. Before release, verify responsive layouts and exercise module navigation, each simulator, the quiz, and every detail tab in current desktop and mobile browsers.
