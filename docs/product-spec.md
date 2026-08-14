# System Design Lab — product specification

Status: foundation spike approved  
Target: open-source, browser-only interactive learning game

## Product goal

Turn system-design study into a repeatable decision-and-feedback loop. A learner receives requirements, assembles an architecture, predicts its behavior, runs deterministic incidents, reviews evidence, and revises the design.

The project teaches general concepts. It may use independently written explanations informed by public technical sources. It does not reproduce the ByteByteGo ebook's prose, illustrations, diagrams, layouts, or exercise wording.

## Core interaction loop

1. Choose a scenario and read its objectives, scale, constraints, and success criteria.
2. Drag infrastructure components onto the canvas and connect the request/data paths.
3. Record a prediction: bottleneck, latency risk, availability risk, and trade-off rationale.
4. Start a round. The engine applies the round's traffic and deterministic incidents.
5. Inspect node metrics, bottlenecks, warnings, and connectivity-aware score feedback.
6. Modify the architecture and replay with the same seed to compare outcomes fairly.

Completion means the learner passes the scenario criteria and records at least one justified trade-off. A score alone is supporting evidence, not the sole learning outcome.

## Initial level catalog

| Level | Primary concepts | Example incidents |
| --- | --- | --- |
| Short URL | key generation, read-heavy cache, datastore scaling | hot key, cache miss storm |
| Real-time chat | persistent connections, ordering, fan-out, offline delivery | gateway loss, reconnect surge |
| Video streaming | upload/transcode pipeline, object storage, CDN, adaptive bitrate | viral video, transcode backlog |
| Payment system | idempotency, ledger consistency, reconciliation, compensating actions | provider timeout, duplicate callback |

The foundation includes one independently authored booking scenario as a schema and incident-engine fixture. It is not part of the four-level release promise unless promoted during content review.

## Scenario contribution contract

Each scenario is standalone JSON with:

- schema, scenario, and content versions;
- learning objectives and measurable requirements;
- reference architecture identifiers and edges;
- one or more rounds with deterministic incidents;
- author, content license, independent-authorship declaration, and sources.

Contributors can add a scenario without changing the simulator or scoring core. Schema changes require a version increment, migration notes, and tests.

## Functional requirements

- Run completely in the browser and persist learner state to localStorage.
- Load versioned scenario JSON and adapt it to the inherited problem/canvas model.
- Preserve traffic propagation, async-latency, connectivity-scoring, and 20-point category caps.
- Produce deterministic incident outcomes for the same scenario version, architecture, round, and seed.
- Export as static assets for GitHub Pages or equivalent hosting.
- Support keyboard, pointer, and touch interactions inherited from the simulator.

## Non-functional requirements

- No account, server database, analytics, or external learner-data transfer in the initial release.
- Tests cover engine invariants, scenario validation, deterministic replay, catalogs, and storage.
- Production build must be a static export.
- Content and dependency licensing must remain auditable in the repository.

## Out of scope for the foundation

- Multiplayer sessions, cloud saves, leaderboards, AI-generated grading, payments, and a backend.
- Copying or transforming ebook diagrams or chapter text.
- Replacing the inherited simulator UI in the first spike.

## Acceptance criteria

- A standalone scenario validates and converts to the inherited `Problem` shape.
- Replaying a round with an identical seed returns identical incident rolls.
- Existing catalogs and simulation/scoring invariants pass automated tests.
- `next build` produces a static export.
- License audit reports no package with unknown license metadata.
