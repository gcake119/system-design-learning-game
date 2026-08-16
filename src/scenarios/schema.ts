import type { Problem } from "@/types/problem";

export const SCENARIO_SCHEMA_VERSION = "1.1" as const;
export const BYTEBYTEGO_OFFICIAL_ARCHIVE_URL =
  "https://blog.bytebytego.com/p/free-system-design-pdf-158-pages" as const;

export interface ScenarioSource {
  title: string;
  url: string;
  usage: "reference-only" | "adapted";
  license?: string;
  author?: string;
}

export interface OfficialReference {
  kind: "official-documentation";
  publisher: string;
  title: string;
  url: string;
  note: string;
}

export interface EbookPageReference {
  kind: "ebook-page";
  publisher: "ByteByteGo";
  work: "Big Archive";
  edition: "2025";
  sectionTitle: string;
  pdfPages: number[];
  officialUrl: string;
}

export interface ScenarioSolution {
  summary: string;
  keyDecisions: Array<{ title: string; rationale: string }>;
  officialReferences: OfficialReference[];
  furtherReading: EbookPageReference[];
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
  successCriteria: string[];
  requirements: Problem["requirements"];
  constraints: string[];
  hints: Problem["hints"];
  tags: string[];
  architecture: {
    components: ScenarioComponent[];
    edges: ScenarioEdge[];
  };
  rounds: ScenarioRound[];
  solution: ScenarioSolution;
  provenance: ScenarioProvenance;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isHttpsUrl(value: unknown): value is string {
  if (!hasText(value)) return false;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
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
    if (!isHttpsUrl(source.url)) errors.push(`provenance.sources[${index}].url must be HTTPS`);
    if (source.usage !== "reference-only" && source.usage !== "adapted") {
      errors.push(`provenance.sources[${index}].usage is invalid`);
    }
    if (source.usage === "adapted" && !hasText(source.license)) {
      errors.push(`provenance.sources[${index}].license is required for adapted content`);
    }
  });
}

function validateSolution(value: unknown, errors: string[]): void {
  if (!isRecord(value)) {
    errors.push("solution must be an object");
    return;
  }
  if (!hasText(value.summary)) errors.push("solution.summary is required");
  if (!Array.isArray(value.keyDecisions) || value.keyDecisions.length === 0) {
    errors.push("solution.keyDecisions must contain at least one decision");
  }
  if (!Array.isArray(value.officialReferences) || value.officialReferences.length === 0) {
    errors.push("solution.officialReferences must contain at least one source");
  } else {
    value.officialReferences.forEach((reference, index) => {
      if (!isRecord(reference) || reference.kind !== "official-documentation") {
        errors.push(`solution.officialReferences[${index}] is invalid`);
        return;
      }
      for (const field of ["publisher", "title", "url", "note"] as const) {
        if (!hasText(reference[field])) errors.push(`solution.officialReferences[${index}].${field} is required`);
      }
      if (!isHttpsUrl(reference.url)) errors.push(`solution.officialReferences[${index}].url must be HTTPS`);
    });
  }
  if (!Array.isArray(value.furtherReading)) {
    errors.push("solution.furtherReading must be an array");
  } else {
    value.furtherReading.forEach((reference, index) => {
      if (!isRecord(reference) || reference.kind !== "ebook-page") {
        errors.push(`solution.furtherReading[${index}] is invalid`);
        return;
      }
      if (reference.publisher !== "ByteByteGo" || reference.work !== "Big Archive" || reference.edition !== "2025") {
        errors.push(`solution.furtherReading[${index}] must identify ByteByteGo Big Archive 2025`);
      }
      if (!hasText(reference.sectionTitle) || !hasText(reference.officialUrl)) {
        errors.push(`solution.furtherReading[${index}] needs a section title and official URL`);
      }
      if (reference.officialUrl !== BYTEBYTEGO_OFFICIAL_ARCHIVE_URL) {
        errors.push(`solution.furtherReading[${index}].officialUrl must use the official archive landing page`);
      }
      if (!Array.isArray(reference.pdfPages) || reference.pdfPages.length === 0 || reference.pdfPages.some((page) => !Number.isInteger(page) || page < 1)) {
        errors.push(`solution.furtherReading[${index}].pdfPages must contain positive integers`);
      }
    });
  }
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
  if (!Array.isArray(value.successCriteria) || value.successCriteria.length === 0) {
    errors.push("successCriteria must contain at least one criterion");
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
  validateSolution(value.solution, errors);
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
  const componentIds = new Map(
    scenario.architecture.components.map((component) => [component.id, component.componentId])
  );
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
      edges: scenario.architecture.edges.map(({ source, target, async }) => ({
        source: componentIds.get(source) ?? source,
        target: componentIds.get(target) ?? target,
        ...(async === true ? { async: true } : {}),
      })),
    },
  };
}
