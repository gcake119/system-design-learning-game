# ADR 0001: Extend the inherited simulator with versioned scenarios

Status: accepted

## Context

The fork already contains a capable canvas, traffic simulator, connectivity-aware scorer, local persistence, and 35 practice problems. The learning game needs progressive rounds, incidents, reproducible comparison, and a contribution format without destabilizing those working invariants.

## Decision

- Keep the inherited Next.js client application and domain engines.
- Add standalone, versioned JSON scenarios behind a validation and compatibility-adapter boundary.
- Seed incident decisions with scenario ID/version, round, architecture fingerprint, and learner-supplied seed.
- Keep initial persistence in localStorage and publish a static export.
- License software under MIT; license newly authored learning content under CC BY-SA 4.0 with per-scenario provenance.
- Treat the planning ebook as a reference only and exclude its expressive content from the repository.
- Use official technical documentation as primary evidence; permit only locator metadata for ebook further reading.

## Consequences

Contributors can add levels without editing the core simulator. Deterministic replay makes before/after architecture comparisons meaningful and debuggable. The compatibility adapter lets the project evolve the game schema independently while continuing to use the existing problem selector and canvas.

The initial validator is intentionally small and must grow before accepting untrusted scenario packages. Static hosting also means shared progress and multiplayer features require a later architecture decision.
