import type { Problem } from "@/types/problem";

export const SCENARIO_SCHEMA_VERSION = "1.0" as const;

export interface ScenarioSource {
  title: string;
  url: string;
  license: string;
  author?: string;
}

export interface ScenarioProvenance {
  author: string;
  license: string;
  independentlyAuthored: boolean;
  sources: ScenarioSource[];
}

export interface ScenarioComponent {
  id: string;
  componentId: string;
  x: number;
  y: number;
}

export interface ScenarioEdge {
  source: string;
  target: string;
  async?: boolean;
}

export interface ScenarioIncident {
  id: string;
  type: "traffic-spike" | "dependency-latency" | "node-failure";
  title: string;
  description: string;
  severity: number;
  affectedComponentIds: string[];
}

export interface ScenarioRound {
  id: string;
  title: string;
  trafficRps: number;
  incidents: ScenarioIncident[];
}

export interface GameScenario {
  schemaVersion: typeof SCENARIO_SCHEMA_VERSION;
  id: string;
  version: string;
  title: string;
  difficulty: Problem["difficulty"];
  summary: string;
  learningObjectives: string[];
  requirements: Problem["requirements"];
  constraints: string[];
  hints: Problem["hints"];
  tags: string[];
  architecture: {
    components: ScenarioComponent[];
    edges: ScenarioEdge[];
  };
  rounds: ScenarioRound[];
  provenance: ScenarioProvenance;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function validateProvenance(value: unknown, errors: string[]): void {
  if (!isRecord(value)) {
    errors.push("provenance must be an object");
    return;
  }
  if (!hasText(value.author)) errors.push("provenance.author is required");
  if (!hasText(value.license)) errors.push("provenance.license is required");
  if (value.independentlyAuthored !== true) {
    errors.push("provenance.independentlyAuthored must be true");
  }
  if (!Array.isArray(value.sources)) {
    errors.push("provenance.sources must be an array");
    return;
  }
  value.sources.forEach((source, index) => {
    if (!isRecord(source)) {
      errors.push(`provenance.sources[${index}] must be an object`);
      return;
    }
    if (!hasText(source.title)) errors.push(`provenance.sources[${index}].title is required`);
    if (!hasText(source.url)) errors.push(`provenance.sources[${index}].url is required`);
    if (!hasText(source.license)) errors.push(`provenance.sources[${index}].license is required`);
  });
}

export function validateScenario(value: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!isRecord(value)) return { valid: false, errors: ["scenario must be an object"] };

  if (value.schemaVersion !== SCENARIO_SCHEMA_VERSION) {
    errors.push(`schemaVersion must be ${SCENARIO_SCHEMA_VERSION}`);
  }
  for (const field of ["id", "version", "title", "summary"] as const) {
    if (!hasText(value[field])) errors.push(`${field} is required`);
  }
  if (!Array.isArray(value.learningObjectives) || value.learningObjectives.length === 0) {
    errors.push("learningObjectives must contain at least one objective");
  }
  if (!isRecord(value.architecture)) {
    errors.push("architecture must be an object");
  } else {
    if (!Array.isArray(value.architecture.components)) errors.push("architecture.components must be an array");
    if (!Array.isArray(value.architecture.edges)) errors.push("architecture.edges must be an array");
  }
  if (!Array.isArray(value.rounds) || value.rounds.length === 0) {
    errors.push("rounds must contain at least one round");
  }
  validateProvenance(value.provenance, errors);
  return { valid: errors.length === 0, errors };
}

export function parseScenario(value: unknown): GameScenario {
  const result = validateScenario(value);
  if (!result.valid) throw new Error(`Invalid scenario: ${result.errors.join("; ")}`);
  return value as unknown as GameScenario;
}

/** Compatibility adapter for the inherited problem selector and reference canvas. */
export function scenarioToProblem(scenario: GameScenario): Problem {
  return {
    id: scenario.id,
    title: scenario.title,
    difficulty: scenario.difficulty,
    description: scenario.summary,
    requirements: scenario.requirements,
    constraints: scenario.constraints,
    hints: scenario.hints,
    tags: scenario.tags,
    referenceSolution: {
      nodes: scenario.architecture.components.map((component) => ({
        componentId: component.componentId,
        x: component.x,
        y: component.y,
      })),
      edges: scenario.architecture.edges.map(({ source, target }) => ({ source, target })),
    },
  };
}
