"use client";

import { BookOpen, ExternalLink, FileText, Lightbulb, Target } from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { getScenarioById } from "@/scenarios/registry";

function formatPages(pages: number[]): string {
  if (pages.length === 1) return `PDF 第 ${pages[0]} 頁`;
  const consecutive = pages.every((page, index) => index === 0 || page === pages[index - 1] + 1);
  return consecutive ? `PDF 第 ${pages[0]}–${pages.at(-1)} 頁` : `PDF 第 ${pages.join("、")} 頁`;
}

export function SolutionGuide() {
  const selectedProblemId = useAppStore((state) => state.selectedProblemId);
  const scenario = getScenarioById(selectedProblemId);

  if (!scenario) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-700 p-4 text-center">
        <BookOpen className="mx-auto h-5 w-5 text-zinc-500" />
        <p className="mt-2 text-xs font-medium text-zinc-300">請先選擇一個學習關卡</p>
        <p className="mt-1 text-[11px] leading-relaxed text-zinc-500">
          四個正式關卡都有自行撰寫的解答、官方文件，以及電子書參考頁碼。
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <section>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          <Target className="h-3.5 w-3.5" />
          解答說明 — {scenario.title}
        </div>
        <p className="mt-2 text-xs leading-relaxed text-zinc-300">{scenario.solution.summary}</p>
      </section>

      <section className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          <Lightbulb className="h-3.5 w-3.5" />
          重要選擇
        </div>
        {scenario.solution.keyDecisions.map((decision) => (
          <div key={decision.title} className="rounded-md border border-zinc-800 bg-zinc-950/50 p-2.5">
            <p className="text-xs font-medium text-zinc-200">{decision.title}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-zinc-400">{decision.rationale}</p>
          </div>
        ))}
      </section>

      <section className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          <FileText className="h-3.5 w-3.5" />
          官方文件
        </div>
        {scenario.solution.officialReferences.map((reference) => (
          <a
            key={reference.url}
            href={reference.url}
            target="_blank"
            rel="noreferrer"
            className="block rounded-md border border-zinc-800 bg-zinc-950/50 p-2.5 transition-colors hover:border-cyan-700/60"
          >
            <span className="flex items-start justify-between gap-2 text-xs font-medium text-cyan-400">
              <span>{reference.publisher} — {reference.title}</span>
              <ExternalLink className="mt-0.5 h-3 w-3 shrink-0" />
            </span>
            <span className="mt-1 block text-[11px] leading-relaxed text-zinc-400">{reference.note}</span>
          </a>
        ))}
      </section>

      <section className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          <BookOpen className="h-3.5 w-3.5" />
          延伸閱讀 — 只標示位置
        </div>
        {scenario.solution.furtherReading.map((reference) => (
          <a
            key={`${reference.sectionTitle}-${reference.pdfPages.join("-")}`}
            href={reference.officialUrl}
            target="_blank"
            rel="noreferrer"
            className="block rounded-md border border-amber-900/40 bg-amber-950/10 p-2.5 transition-colors hover:border-amber-700/60"
          >
            <span className="flex items-start justify-between gap-2 text-xs font-medium text-amber-300">
              <span>{reference.sectionTitle}</span>
              <ExternalLink className="mt-0.5 h-3 w-3 shrink-0" />
            </span>
            <span className="mt-1 block text-[11px] text-zinc-400">
              ByteByteGo, <i>{reference.work}</i> {reference.edition} — {formatPages(reference.pdfPages)}
            </span>
          </a>
        ))}
        <p className="text-[10px] leading-relaxed text-zinc-500">
          頁碼對應官方發布的 2025 年 PDF，方便你自行閱讀。本專案不放入電子書文字、圖片或圖表。
        </p>
      </section>
    </div>
  );
}
