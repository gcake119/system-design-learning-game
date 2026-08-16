import { afterEach, describe, expect, it, vi } from "vitest";
import { SYSTEM_COMPONENTS } from "@/data/components";
import { PROBLEMS } from "@/data/problems";
import { safeLocalStorage } from "@/store/safeStorage";

describe("foundation smoke checks", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("preserves the inherited component and problem catalogs", () => {
    expect(SYSTEM_COMPONENTS).toHaveLength(36);
    expect(PROBLEMS).toHaveLength(35);
  });

  it("uses browser localStorage through the safe adapter", () => {
    const values = new Map<string, string>();
    const localStorage = {
      getItem: vi.fn((key: string) => values.get(key) ?? null),
      setItem: vi.fn((key: string, value: string) => values.set(key, value)),
      removeItem: vi.fn((key: string) => values.delete(key)),
    };
    vi.stubGlobal("window", { localStorage });

    safeLocalStorage.setItem("scenario", "ready");
    expect(safeLocalStorage.getItem("scenario")).toBe("ready");
    safeLocalStorage.removeItem("scenario");
    expect(safeLocalStorage.getItem("scenario")).toBeNull();
  });
});
