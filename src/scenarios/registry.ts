import bookingBaseline from "./core/booking-baseline.json";
import paymentSystem from "./core/payment-system.json";
import realtimeChat from "./core/realtime-chat.json";
import shortUrl from "./core/short-url.json";
import videoStreaming from "./core/video-streaming.json";
import { parseScenario, scenarioToProblem, type GameScenario } from "./schema";

const rawScenarios: unknown[] = [
  shortUrl,
  realtimeChat,
  videoStreaming,
  paymentSystem,
  bookingBaseline,
];

export const SCENARIOS: GameScenario[] = rawScenarios.map(parseScenario);
export const RELEASE_SCENARIOS = SCENARIOS.filter((scenario) => scenario.id !== "booking-baseline");
export const SCENARIO_PROBLEMS = SCENARIOS.map(scenarioToProblem);

export function getScenarioById(id: string): GameScenario | undefined {
  return SCENARIOS.find((scenario) => scenario.id === id);
}

export function getScenarioProblemById(id: string) {
  return SCENARIO_PROBLEMS.find((problem) => problem.id === id);
}
