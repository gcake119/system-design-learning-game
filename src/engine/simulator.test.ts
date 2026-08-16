import type { Edge, Node } from "@xyflow/react";
import { describe, expect, it } from "vitest";
import type { ComponentNodeData } from "@/store/canvasStore";
import { runSimulation } from "./simulator";

function node(
  id: string,
  componentId: string,
  overrides: Partial<ComponentNodeData> = {}
): Node<ComponentNodeData> {
  return {
    id,
    position: { x: 0, y: 0 },
    data: {
      componentId,
      label: id,
      icon: "Server",
      category: "compute",
      replicas: 1,
      maxQPS: 10000,
      latencyMs: 10,
      scalable: true,
      ...overrides,
    },
  };
}

describe("runSimulation", () => {
  it("splits load-balancer traffic evenly across children", () => {
    const nodes = [
      node("lb", "load-balancer"),
      node("a", "app-server"),
      node("b", "app-server"),
    ];
    const edges: Edge[] = [
      { id: "lb-a", source: "lb", target: "a" },
      { id: "lb-b", source: "lb", target: "b" },
    ];

    const result = runSimulation(nodes, edges, 1000);
    expect(result.nodeMetrics.get("a")?.incomingQPS).toBe(500);
    expect(result.nodeMetrics.get("b")?.incomingQPS).toBe(500);
  });

  it("excludes async work from user-facing latency", () => {
    const nodes = [
      node("app", "app-server", { latencyMs: 20 }),
      node("queue", "message-queue", { latencyMs: 50, category: "messaging" }),
    ];
    const edges: Edge[] = [
      { id: "async", source: "app", target: "queue", data: { async: true } },
    ];

    expect(runSimulation(nodes, edges, 100).totalLatencyMs).toBe(20);
  });

  it("ignores annotation edges and does not treat disconnected nodes as entries", () => {
    const nodes = [node("entry", "api-gateway"), node("app", "app-server"), node("idle", "cache")];
    const edges: Edge[] = [
      { id: "entry-app", source: "entry", target: "app" },
      { id: "annotation-idle", source: "text-note", target: "idle" },
    ];

    const result = runSimulation(nodes, edges, 900);
    expect(result.nodeMetrics.get("entry")?.incomingQPS).toBe(900);
    expect(result.nodeMetrics.get("idle")?.incomingQPS).toBe(0);
    expect(result.nodeMetrics.get("idle")?.status).toBe("idle");
  });

  it("sanitizes invalid capacity and caps delivered throughput", () => {
    const nodes = [
      node("broken", "app-server", { maxQPS: Number.NaN, replicas: -3 }),
      node("db", "sql-db", { maxQPS: 1000, category: "storage" }),
    ];
    const edges: Edge[] = [{ id: "broken-db", source: "broken", target: "db" }];

    const result = runSimulation(nodes, edges, 500);
    expect(result.nodeMetrics.get("broken")?.effectiveQPS).toBe(0);
    expect(result.nodeMetrics.get("broken")?.status).toBe("critical");
    expect(result.throughput).toBe(0);
  });
});
