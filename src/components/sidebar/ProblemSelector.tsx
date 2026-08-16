"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { PROBLEMS } from "@/data/problems";
import { useAppStore } from "@/store/appStore";
import { useCustomProblemsStore } from "@/store/customProblemsStore";
import { RELEASE_SCENARIOS } from "@/scenarios/registry";

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case "Easy":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
    case "Medium":
      return "border-amber-500/30 bg-amber-500/10 text-amber-400";
    case "Hard":
      return "border-rose-500/30 bg-rose-500/10 text-rose-400";
    default:
      return "";
  }
}

function getDifficultyLabel(difficulty: string) {
  if (difficulty === "Easy") return "簡單";
  if (difficulty === "Medium") return "中等";
  if (difficulty === "Hard") return "困難";
  return difficulty;
}

interface ProblemSelectorProps {
  onCreateProblem?: () => void;
}

export function ProblemSelector({ onCreateProblem }: ProblemSelectorProps) {
  const selectedProblemId = useAppStore((s) => s.selectedProblemId);
  const setSelectedProblem = useAppStore((s) => s.setSelectedProblem);
  const customProblems = useCustomProblemsStore((s) => s.problems);
  const deleteProblem = useCustomProblemsStore((s) => s.deleteProblem);

  const handleDeleteCustom = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteProblem(id);
    // If the deleted problem was selected, switch to the first learning scenario.
    if (selectedProblemId === id) {
      setSelectedProblem(RELEASE_SCENARIOS[0].id);
    }
    useAppStore.getState().showToast("自訂題目已刪除", "info");
  };

  return (
    <ScrollArea className="h-full">
      <div className="space-y-1 p-3">
        <p className="px-2.5 pb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
          學習關卡
        </p>
        {RELEASE_SCENARIOS.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => setSelectedProblem(scenario.id)}
            aria-pressed={scenario.id === selectedProblemId}
            className={`flex w-full flex-col gap-1.5 rounded-md px-2.5 py-2 text-left transition-colors ${
              scenario.id === selectedProblemId
                ? "border border-cyan-700/60 bg-cyan-950/20"
                : "border border-transparent hover:bg-zinc-800"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className={`text-xs font-medium ${scenario.id === selectedProblemId ? "text-cyan-400" : "text-zinc-300"}`}>
                {scenario.title}
              </span>
              <Badge
                variant="outline"
                className={`h-4 shrink-0 px-1.5 text-[11px] font-medium ${getDifficultyColor(scenario.difficulty)}`}
              >
                {getDifficultyLabel(scenario.difficulty)}
              </Badge>
            </div>
            <span className="text-[11px] text-zinc-500">{scenario.rounds.length} 回合 · 解答與參考資料</span>
          </button>
        ))}

        <div className="!my-3 h-px bg-zinc-800" />

        {/* Create Problem button */}
        <button
          onClick={onCreateProblem}
          className="flex w-full items-center gap-2 rounded-md border border-dashed border-zinc-600 px-2.5 py-2 text-left text-xs font-medium text-violet-400 transition-colors hover:border-violet-500/50 hover:bg-violet-500/5"
        >
          <Plus className="h-3.5 w-3.5" />
          建立自訂題目
        </button>

        {/* Custom problems — row is a div[role=button] so the delete X can be
            a real <button> (button-in-button is invalid HTML) */}
        {customProblems.map((problem) => (
          <div
            key={problem.id}
            role="button"
            tabIndex={0}
            onClick={() => setSelectedProblem(problem.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSelectedProblem(problem.id);
              }
            }}
            aria-pressed={problem.id === selectedProblemId}
            className={`group flex w-full cursor-pointer flex-col gap-1.5 rounded-md px-2.5 py-2 text-left transition-colors ${
              problem.id === selectedProblemId
                ? "border border-zinc-700 bg-zinc-800"
                : "border border-transparent hover:bg-zinc-800"
            }`}
          >
            <div className="flex items-center justify-between gap-1">
              <span
                className={`flex-1 truncate text-xs font-medium ${
                  problem.id === selectedProblemId
                    ? "text-cyan-500"
                    : "text-zinc-300"
                }`}
              >
                {problem.title}
              </span>
              <div className="flex items-center gap-1">
                <Badge
                  variant="outline"
                  className="h-4 shrink-0 border-violet-500/30 bg-violet-500/10 px-1.5 text-[11px] font-medium text-violet-400"
                >
                  自訂
                </Badge>
                <Badge
                  variant="outline"
                  className={`h-4 shrink-0 px-1.5 text-[11px] font-medium ${getDifficultyColor(
                    problem.difficulty
                  )}`}
                >
                  {getDifficultyLabel(problem.difficulty)}
                </Badge>
                <button
                  onClick={(e) => handleDeleteCustom(e, problem.id)}
                  className="flex h-4 w-4 shrink-0 items-center justify-center rounded text-zinc-500 opacity-60 transition-opacity hover:text-rose-400 group-focus-within:opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100"
                  title="刪除自訂題目"
                  aria-label={`刪除自訂題目 ${problem.title}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {problem.tags.map((tag, i) => (
                <span key={tag} className="text-[11px] text-zinc-400">
                  {tag}{i < problem.tags.length - 1 ? " ·" : ""}
                </span>
              ))}
            </div>
          </div>
        ))}

        {/* Separator if there are custom problems */}
        {customProblems.length > 0 && (
          <div className="!my-2 h-px bg-zinc-800" />
        )}

        <p className="px-2.5 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
          練習題庫
        </p>

        {/* Predefined problems */}
        {PROBLEMS.map((problem) => (
          <button
            key={problem.id}
            onClick={() => setSelectedProblem(problem.id)}
            aria-pressed={problem.id === selectedProblemId}
            className={`flex w-full flex-col gap-1.5 rounded-md px-2.5 py-2 text-left transition-colors ${
              problem.id === selectedProblemId
                ? "border border-zinc-700 bg-zinc-800"
                : "border border-transparent hover:bg-zinc-800"
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-xs font-medium ${
                  problem.id === selectedProblemId
                    ? "text-cyan-500"
                    : "text-zinc-300"
                }`}
              >
                {problem.title}
              </span>
              <Badge
                variant="outline"
                className={`h-4 px-1.5 text-[11px] font-medium ${getDifficultyColor(
                  problem.difficulty
                )}`}
              >
                {getDifficultyLabel(problem.difficulty)}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-1">
              {problem.tags.map((tag, i) => (
                <span key={tag} className="text-[11px] text-zinc-400">
                  {tag}{i < problem.tags.length - 1 ? " ·" : ""}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}
