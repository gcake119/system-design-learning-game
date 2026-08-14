# System Design Lab

An open-source, browser-only system-design learning game. Build an architecture, predict how it will behave, run deterministic traffic and failure rounds, inspect evidence, and iterate.

This project is a fork of [SystemForge / system-design-simulator](https://github.com/vijaygupta18/system-design-simulator) by Vijay Gupta. The inherited canvas, simulator, scoring system, interview practice tools, and upstream support flow remain credited to that project.

## Foundation status

The foundation spike establishes:

- a standalone, versioned scenario JSON format;
- content provenance and independent-authorship checks;
- deterministic incident replay keyed by scenario, architecture, round, and seed;
- compatibility with the inherited 35-problem canvas and scoring model;
- static Next.js export for simple open-source hosting;
- automated tests for the simulator, scorer, scenarios, catalogs, and local storage;
- auditable content and dependency license policies.

The planned first learning levels are Short URL, Real-time Chat, Video Streaming, and Payment System. See [the product specification](docs/product-spec.md).

## Learning loop

```text
Read requirements → Build → Predict → Run incident → Inspect evidence → Revise and replay
```

A scenario is a standalone JSON contribution. New levels should not require changes to the simulation or scoring core.

## Run locally

Requirements: Node.js 20 or newer.

```bash
git clone https://github.com/gcake119/system-design-learning-game.git
cd system-design-learning-game
npm install
npm run dev
```

Open <http://localhost:3000>.

## Validate a change

```bash
npm test
npm run audit:licenses
npx tsc --noEmit
npm run lint
npm run build
```

`npm run build` creates a static site in `out/`.

## Project map

```text
src/engine/                 traffic simulation
src/scoring/                connectivity-aware scoring
src/scenarios/              scenario schema and incident engine
src/scenarios/core/         independently authored core scenarios
src/data/                   inherited components and practice problems
src/store/                  browser state and localStorage persistence
docs/product-spec.md        interaction and level specification
docs/adr/                   architecture decisions
```

## Content policy

The ByteByteGo system-design ebook discussed during planning is used only as reference material. Its prose, illustrations, diagrams, page layouts, screenshots, and exercise wording are not included in this repository. Learning content must be independently written and must declare its sources and license.

Read [CONTENT_LICENSE.md](CONTENT_LICENSE.md) before contributing a scenario.

## Contributing

1. Create a focused branch.
2. Add or update tests with behavior changes.
3. For a scenario, include the required `provenance` object and use your own wording and visuals.
4. Run all validation commands above.
5. Open a pull request explaining the learning objective and evidence.

Changes to the simulator must preserve traffic, latency, connectivity, and scoring invariants documented in `AGENTS.md` and covered by tests.

## Licenses and attribution

- Software: [MIT](LICENSE).
- Newly contributed learning content: [CC BY-SA 4.0](CONTENT_LICENSE.md).
- Upstream and package notices: [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
- Generated dependency inventory: [docs/dependency-license-inventory.md](docs/dependency-license-inventory.md).

SystemForge's upstream support interface and donation details belong to the upstream author and remain labeled accordingly in the application.
