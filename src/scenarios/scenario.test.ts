import { describe, expect, it } from "vitest";
import bookingJson from "./core/booking-baseline.json";
import { resolveRoundIncidents } from "./incidentEngine";
import { parseScenario, scenarioToProblem, validateScenario } from "./schema";
import { RELEASE_SCENARIOS, SCENARIOS } from "./registry";

describe("scenario schema and incident engine", () => {
  it("loads a standalone JSON scenario and adapts it to an inherited problem", () => {
    const scenario = parseScenario(bookingJson);
    const problem = scenarioToProblem(scenario);
    expect(problem.id).toBe("booking-baseline");
    expect(problem.referenceSolution.nodes).toHaveLength(6);
    expect(problem.referenceSolution.edges).toHaveLength(5);
    expect(problem.referenceSolution.edges[0]).toEqual({
      source: "api-gateway",
      target: "rate-limiter",
    });
    expect(problem.referenceSolution.edges.at(-1)).toEqual({
      source: "app-server",
      target: "message-queue",
      async: true,
    });
  });

  it("rejects content without independent provenance", () => {
    const invalid = structuredClone(bookingJson) as Record<string, unknown>;
    invalid.provenance = { author: "anonymous", license: "", independentlyAuthored: false, sources: [] };
    const result = validateScenario(invalid);
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toContain("independentlyAuthored");
  });

  it("is deterministic for the same scenario version, architecture and seed", () => {
    const scenario = parseScenario(bookingJson);
    const first = resolveRoundIncidents(scenario, "opening-spike", "classroom-demo");
    const second = resolveRoundIncidents(scenario, "opening-spike", "classroom-demo");
    expect(second).toEqual(first);
  });

  it("includes the architecture fingerprint in deterministic randomness", () => {
    const scenario = parseScenario(bookingJson);
    const changed = structuredClone(scenario);
    changed.architecture.components[0].componentId = "cdn";
    const original = resolveRoundIncidents(scenario, "opening-spike", "classroom-demo");
    const modified = resolveRoundIncidents(changed, "opening-spike", "classroom-demo");
    expect(modified[0].roll).not.toBe(original[0].roll);
  });

  it("registers four release scenarios with official docs and ebook locators", () => {
    expect(SCENARIOS).toHaveLength(5);
    expect(RELEASE_SCENARIOS).toHaveLength(4);
    for (const scenario of RELEASE_SCENARIOS) {
      expect(scenario.solution.officialReferences.length).toBeGreaterThan(0);
      expect(scenario.solution.furtherReading.length).toBeGreaterThan(0);
      expect(scenario.solution.furtherReading.every((reference) => reference.edition === "2025")).toBe(true);
    }
  });

  it("rejects unofficial ebook download URLs", () => {
    const invalid = structuredClone(bookingJson);
    invalid.solution.furtherReading[0].officialUrl = "https://example.com/archive.pdf";
    const result = validateScenario(invalid);
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toContain("official archive landing page");
  });
});
