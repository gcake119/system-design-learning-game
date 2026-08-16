"use client";

import { ModalShell } from "./ModalShell";
import {
  X, BookOpen, Boxes, GraduationCap, Activity, Command, Sparkles, PlayCircle,
} from "lucide-react";

interface HowItWorksDialogProps {
  open: boolean;
  onClose: () => void;
  /** Jump the user into picking a problem (closes the dialog first). */
  onPickProblem?: () => void;
  /** Launch the animated walkthrough. */
  onPlayWalkthrough?: () => void;
}

const MODES = [
  {
    icon: BookOpen,
    title: "學習",
    color: "text-blue-400 bg-blue-500/10 ring-blue-500/25",
    body: "點選任何元件，就能查看適合使用的時機、要留意的取捨與實際例子。你也可以照著學習路徑逐步練習。",
  },
  {
    icon: Boxes,
    title: "實作",
    color: "text-emerald-400 bg-emerald-500/10 ring-emerald-500/25",
    body: "選一個題目，把元件放上畫布並連接起來，再依照模擬與評分結果反覆調整。",
  },
  {
    icon: GraduationCap,
    title: "面試",
    color: "text-cyan-400 bg-cyan-500/10 ring-cyan-500/25",
    body: "用計時方式完成需求、估算、API、資料模型、整體架構與深入討論六個階段，每個階段都有提示。",
  },
  {
    icon: Activity,
    title: "分析",
    color: "text-amber-400 bg-amber-500/10 ring-amber-500/25",
    body: "模擬流量後查看每個節點的 QPS、使用率與瓶頸，再用容量計算和取捨卡協助判斷。",
  },
];

const STEPS = [
  ["選擇題目", "從上方選單選一個題目，也可以直接從空白畫布開始。"],
  ["建立架構", "從左側把元件拖到畫布，或按 ⌘K 搜尋元件。"],
  ["連接元件", "拖曳節點的連接點建立線路；點選線路可設定 Protocol 與同步／非同步模式。"],
  ["執行模擬", "按 ⌘↵，讓每秒 1K 至 500K 個請求通過你的架構。"],
  ["取得評分", "按 ⌘⇧S，從 Scalability、Availability、Latency、Cost 與取捨等面向查看評分和改善建議。"],
  ["調整並儲存", "改善架構後可儲存，或匯出 PNG／JSON；參考架構會在唯讀分頁顯示範例答案。"],
];

export function HowItWorksDialog({ open, onClose, onPickProblem, onPlayWalkthrough }: HowItWorksDialogProps) {
  return (
    <ModalShell open={open} onClose={onClose} ariaLabel="System Design Lab 操作說明" panelClassName="max-w-2xl">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-zinc-800 bg-zinc-900/95 px-5 py-4 backdrop-blur">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-mark.svg" alt="" width={26} height={26} className="h-[26px] w-[26px]" />
          <div>
            <h2 className="font-display text-base font-bold tracking-tight text-zinc-50">System Design Lab 操作說明</h2>
            <p className="text-xs text-zinc-400">動手建立架構、模擬流量，並用面試角度檢查設計。</p>
          </div>
        </div>
        <button
          onClick={onClose}
          data-autofocus
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
          aria-label="關閉"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-6 px-5 py-5">
        {/* Animated walkthrough launcher */}
        {onPlayWalkthrough && (
          <button
            onClick={onPlayWalkthrough}
            className="group flex w-full items-center gap-3 overflow-hidden rounded-xl border border-cyan-500/30 bg-gradient-to-r from-cyan-500/15 to-blue-500/10 px-4 py-3 text-left transition-colors hover:border-cyan-400/50"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-500 text-white shadow-md shadow-cyan-500/30 transition-transform group-hover:scale-105">
              <PlayCircle className="h-5 w-5" />
            </span>
            <span className="flex-1">
              <span className="block text-sm font-semibold text-zinc-50">觀看 60 秒操作導覽</span>
              <span className="block text-xs text-zinc-400">用動畫快速看完建立架構、模擬、評分與面試練習。</span>
            </span>
            <Sparkles className="h-4 w-4 shrink-0 text-cyan-400" />
          </button>
        )}

        {/* Four modes */}
        <section>
          <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">四種使用方式</p>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {MODES.map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.title} className="rounded-lg border border-zinc-800 bg-zinc-800/40 p-3">
                  <div className="mb-1.5 flex items-center gap-2">
                    <span className={`flex h-7 w-7 items-center justify-center rounded-lg ring-1 ${m.color}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-semibold text-zinc-100">{m.title}</span>
                  </div>
                  <p className="text-xs leading-relaxed text-zinc-400">{m.body}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Core loop */}
        <section>
          <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">基本操作流程</p>
          <ol className="space-y-2">
            {STEPS.map(([title, body], i) => (
              <li key={title} className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-500/15 font-mono text-[11px] font-bold text-cyan-400">
                  {i + 1}
                </span>
                <p className="text-xs leading-relaxed text-zinc-300">
                  <span className="font-semibold text-zinc-100">{title}.</span>{" "}
                  <span className="text-zinc-400">{body}</span>
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* Tips */}
        <section className="rounded-lg border border-zinc-800 bg-zinc-800/40 p-3.5">
          <div className="flex items-start gap-2.5">
            <Command className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
            <p className="text-xs leading-relaxed text-zinc-400">
              <span className="font-semibold text-zinc-200">快速操作：</span>按下{" "}
              <kbd className="rounded border border-zinc-700 bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px] text-zinc-300">⌘K</kbd>{" "}
              就能搜尋題目、加入元件或執行操作。你也能建立自訂元件和題目，內容會自動儲存在瀏覽器。
            </p>
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 flex items-center justify-end gap-2 border-t border-zinc-800 bg-zinc-900/95 px-5 py-3 backdrop-blur">
        <button
          onClick={onClose}
          className="rounded-md px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200"
        >
          稍後再看
        </button>
        <button
          onClick={() => { onClose(); onPickProblem?.(); }}
          className="flex items-center gap-1.5 rounded-md bg-cyan-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-cyan-400"
        >
          <Sparkles className="h-3.5 w-3.5" />
          選擇題目
        </button>
      </div>
    </ModalShell>
  );
}
