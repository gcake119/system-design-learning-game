import type { GameScenario, ScenarioIncident } from "./schema";

export interface IncidentOutcome {
  incident: ScenarioIncident;
  active: boolean;
  roll: number;
}

function hashText(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function architectureFingerprint(scenario: GameScenario): string {
  const nodes = scenario.architecture.components
    .map(({ id, componentId }) => `${id}:${componentId}`)
    .sort()
    .join("|");
  const edges = scenario.architecture.edges
    .map(({ source, target, async }) => `${source}>${target}:${async === true ? "a" : "s"}`)
    .sort()
    .join("|");
  return `${nodes}::${edges}`;
}

/**
 * Resolve a round without wall-clock or global randomness. Replays using the
 * same scenario version, architecture and seed always produce the same result.
 */
export function resolveRoundIncidents(
  scenario: GameScenario,
  roundId: string,
  seed: string
): IncidentOutcome[] {
  const round = scenario.rounds.find((candidate) => candidate.id === roundId);
  if (!round) throw new Error(`Unknown round: ${roundId}`);

  const base = `${scenario.id}@${scenario.version}:${roundId}:${seed}:${architectureFingerprint(scenario)}`;
  return round.incidents.map((incident) => {
    const roll = hashText(`${base}:${incident.id}`) / 0xffffffff;
    return {
      incident,
      roll,
      active: roll < Math.max(0, Math.min(1, incident.severity)),
    };
  });
}
