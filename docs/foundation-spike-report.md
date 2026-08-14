# Foundation spike report

## Outcome

The inherited simulator is a viable base for the open-source learning game. The spike adds a versioned scenario boundary, deterministic incident resolution, automated invariant tests, static export configuration, and explicit content/dependency licensing controls.

## Verified baseline

- Browser-only Next.js/React application with Zustand localStorage persistence.
- 36 infrastructure palette entries and 35 inherited design problems.
- Traffic simulation with fan-in, splitter behavior, capacity limits, async latency, disconnected-node handling, and cycle warnings.
- Connectivity-aware scoring in five categories capped at 20 points each.

## Added by the spike

- `src/scenarios/schema.ts`: scenario types, provenance checks, parser, and inherited-problem adapter.
- `src/scenarios/incidentEngine.ts`: deterministic incident activation based on content and architecture.
- `src/scenarios/core/booking-baseline.json`: independently authored Traditional Chinese fixture.
- Twelve automated tests covering engine, scoring, scenario, catalog, and persistence invariants.
- Static Next.js export and a dependency-license audit.
- Product specification, architecture decision, content policy, and third-party notices.

## Validation commands

```bash
npm test
npm run audit:licenses
npx tsc --noEmit
npm run lint
npm run build
```

## Risks and follow-up

- Expand structural validation before loading third-party scenario packages.
- Add a scenario registry and UI round controller.
- Define scenario-specific success criteria and prediction capture.
- Add GitHub Pages workflow after repository deployment preferences are confirmed.
- Review every contributed level for licensing and independently authored expression.
