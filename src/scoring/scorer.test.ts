import type { Edge, Node } from "@xyflow/react";
import { describe, expect, it } from "vitest";
import type { ComponentNodeData } from "@/store/canvasStore";
import { scoreDesign } from "./scorer";

function node(
  id: string,
  componentId: string,
  category: string,
  overrides: Partial<ComponentNodeData> = {}
): Node<ComponentNodeData> {
  return {
    id,
    position: { x: 0, y: 0 },
    data: {
      componentId,
      label: id,
      icon: "Box",
      category,
      replicas: 1,
      maxQPS: 10000,
      latencyMs: 5,
      scalable: true,
      ...overrides,
    },
  };
}

describe("scoreDesign", () => {
  it("keeps five categories capped at 20 and the total capped at 100", () => {
    const nodes = [
      node("cdn", "cdn", "networking"),
      node("lb", "load-balancer", "networking"),
      node("gateway", "api-gateway", "networking"),
      node("limiter", "rate-limiter", "networking"),
      node("app", "app-server", "compute"),
      node("auth", "auth-service", "compute"),
      node("cache", "cache", "storage"),
      node("sql", "sql-db", "storage", { replicas: 2 }),
      node("nosql", "nosql-db", "storage", { replicas: 2 }),
      node("queue", "message-queue", "messaging"),
      node("monitor", "monitoring", "infrastructure"),
    ];
    const edges: Edge[] = nodes.slice(1).map((target, index) => ({
      id: `e-${index}`,
      source: nodes[index].id,
      target: target.id,
    }));

    const result = scoreDesign(nodes, edges);
    expect(result.categories).toHaveLength(5);
    expect(result.categories.every((category) => category.maxScore === 20)).toBe(true);
    expect(result.categories.every((category) => category.score <= 20)).toBe(true);
    expect(result.total).toBeLessThanOrEqual(100);
  });

  it("does not award request-path scalability points to disconnected features", () => {
    const baseNodes = [node("entry", "api-gateway", "networking"), node("app", "app-server", "compute")];
    const edges: Edge[] = [{ id: "entry-app", source: "entry", target: "app" }];
    const withDisconnected = [
      ...baseNodes,
      node("cache", "cache", "storage"),
      node("queue", "message-queue", "messaging"),
      node("lb", "load-balancer", "networking"),
    ];

    const base = scoreDesign(baseNodes, edges).categories.find((c) => c.category === "Scalability");
    const extra = scoreDesign(withDisconnected, edges).categories.find((c) => c.category === "Scalability");
    expect(extra?.score).toBe(base?.score);
  });
});
