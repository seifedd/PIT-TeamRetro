"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getHealthBoard,
  type HealthBoard,
  type HealthRating,
  subscribeToBoardStore,
  upsertHealthMetric,
} from "@/lib/boards";

const DIMENSIONS = [
  { name: "Mission & Purpose", icon: "🎯", desc: "Clarity on what we're building and why" },
  { name: "Delivery & Process", icon: "📦", desc: "How smooth our sprint process feels" },
  { name: "Codebase & Tech Debt", icon: "🧱", desc: "Confidence in our code quality" },
  { name: "Support & Teamwork", icon: "🤝", desc: "How well we collaborate and help each other" },
  { name: "Learning & Growth", icon: "📈", desc: "Opportunities to learn and develop" },
  { name: "Fun & Engagement", icon: "🎉", desc: "Enjoyment and energy in the team" },
];

const RATINGS: Array<{ value: HealthRating; emoji: string; label: string; bg: string; ring: string; hover: string }> = [
  { value: "GREEN", emoji: "😊", label: "Great", bg: "bg-emerald-500", ring: "ring-emerald-200", hover: "hover:bg-emerald-100" },
  { value: "YELLOW", emoji: "😐", label: "OK", bg: "bg-amber-400", ring: "ring-amber-100", hover: "hover:bg-amber-50" },
  { value: "RED", emoji: "😔", label: "Needs Work", bg: "bg-rose-500", ring: "ring-rose-200", hover: "hover:bg-rose-50" },
];

export default function ClientHealthBoard() {
  const searchParams = useSearchParams();
  const boardId = searchParams.get("id") ?? "";
  const [board, setBoard] = useState<HealthBoard | null>(null);
  const [authorName, setAuthorName] = useState("");

  useEffect(() => {
    const savedName = localStorage.getItem("teamretro-name");
    if (savedName) {
      setAuthorName(savedName);
    }
  }, []);

  useEffect(() => {
    if (!boardId) {
      setBoard(null);
      return;
    }

    const syncBoard = () => {
      setBoard(getHealthBoard(boardId));
    };

    syncBoard();
    return subscribeToBoardStore(syncBoard);
  }, [boardId]);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAuthorName(event.target.value);
    localStorage.setItem("teamretro-name", event.target.value);
  };

  const handleVote = (dimension: string, rating: HealthRating) => {
    if (!board || !authorName.trim()) {
      return;
    }

    const updatedBoard = upsertHealthMetric(board.id, authorName, dimension, rating);
    if (updatedBoard) {
      setBoard(updatedBoard);
    }
  };

  if (!boardId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/20 p-6">
        <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200/80 bg-white p-10 text-center shadow-sm">
          <h1 className="text-3xl font-[Outfit] font-extrabold text-slate-900">Missing session ID</h1>
          <p className="mt-3 text-slate-500">Open a health check from the home page or use a URL like <span className="font-mono text-slate-700">/health?id=health-1234</span>.</p>
          <Link href="/" className="btn-primary mt-6 bg-emerald-600 text-white hover:bg-emerald-700">Back Home</Link>
        </div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/20 p-6">
        <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200/80 bg-white p-10 text-center shadow-sm">
          <h1 className="text-3xl font-[Outfit] font-extrabold text-slate-900">Session not found</h1>
          <p className="mt-3 text-slate-500">This GitHub Pages build stores boards in the current browser, so this ID is only available where it was originally created.</p>
          <Link href="/" className="btn-primary mt-6 bg-emerald-600 text-white hover:bg-emerald-700">Create a New Session</Link>
        </div>
      </div>
    );
  }

  const getMyVote = (dimension: string) =>
    board.metrics.find((metric) => metric.dimension === dimension && metric.author === authorName)?.rating;

  const countVotes = (dimension: string, rating: HealthRating) =>
    board.metrics.filter((metric) => metric.dimension === dimension && metric.rating === rating).length;

  const totalVotersForDim = (dimension: string) =>
    board.metrics.filter((metric) => metric.dimension === dimension).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/20 flex flex-col">
      <header className="bg-white/70 backdrop-blur-xl border-b border-slate-200/60 px-6 py-3.5 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-sm shadow-emerald-200 group-hover:shadow-md transition">
              <span className="text-white font-bold text-xs">HC</span>
            </div>
          </Link>
          <div className="h-5 w-px bg-slate-200"></div>
          <div>
            <h1 className="text-lg font-[Outfit] font-bold tracking-tight text-slate-900 leading-tight">{board.title}</h1>
            <p className="text-[11px] font-mono text-slate-400 mt-0.5">Session: {board.id}</p>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="h-full flex flex-col gap-5 max-w-4xl mx-auto w-full">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 px-5 py-3 flex items-center justify-between animate-fade-in-up">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {authorName ? authorName[0].toUpperCase() : "?"}
              </div>
              <input
                type="text"
                placeholder="Your name..."
                className="text-sm bg-transparent border-none focus:outline-none focus:ring-0 font-medium text-slate-800 placeholder:text-slate-300 w-40"
                value={authorName}
                onChange={handleNameChange}
              />
            </div>
            {!authorName.trim() && (
              <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full font-medium">Enter your name to vote</span>
            )}
          </div>

          <div className="space-y-3 animate-fade-in-up delay-100">
            {DIMENSIONS.map((dimension, index) => {
              const myVote = getMyVote(dimension.name);
              const total = totalVotersForDim(dimension.name);

              return (
                <div key={dimension.name} className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 card-hover" style={{ animationDelay: `${index * 60}ms` }}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{dimension.icon}</span>
                      <h3 className="font-[Outfit] font-bold text-slate-900 text-sm">{dimension.name}</h3>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 ml-8">{dimension.desc}</p>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {RATINGS.map((rating) => (
                      <button
                        key={rating.value}
                        disabled={!authorName.trim()}
                        onClick={() => handleVote(dimension.name, rating.value)}
                        className={`group relative w-11 h-11 rounded-xl flex items-center justify-center text-xl transition-all border-2 ${myVote === rating.value ? `${rating.bg} border-transparent scale-110 ring-4 ${rating.ring} shadow-md` : `bg-slate-50 border-slate-100 ${rating.hover} hover:scale-105`} disabled:cursor-not-allowed disabled:opacity-40`}
                        title={rating.label}
                      >
                        {rating.emoji}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 min-w-[120px]">
                    {total === 0 ? (
                      <span className="text-xs text-slate-300">No votes</span>
                    ) : (
                      <>
                        <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                          {countVotes(dimension.name, "GREEN") > 0 && (
                            <div className="bg-emerald-500 h-full transition-all" style={{ width: `${(countVotes(dimension.name, "GREEN") / total) * 100}%` }}></div>
                          )}
                          {countVotes(dimension.name, "YELLOW") > 0 && (
                            <div className="bg-amber-400 h-full transition-all" style={{ width: `${(countVotes(dimension.name, "YELLOW") / total) * 100}%` }}></div>
                          )}
                          {countVotes(dimension.name, "RED") > 0 && (
                            <div className="bg-rose-500 h-full transition-all" style={{ width: `${(countVotes(dimension.name, "RED") / total) * 100}%` }}></div>
                          )}
                        </div>
                        <span className="text-[11px] font-mono text-slate-400 w-6 text-right">{total}</span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
