"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { addHealthMetric, getHealthBoard } from "@/app/actions/health";

const DIMENSIONS = [
  { name: "Mission & Purpose",       icon: "🎯", desc: "Clarity on what we're building and why" },
  { name: "Delivery & Process",      icon: "📦", desc: "How smooth our sprint process feels" },
  { name: "Codebase & Tech Debt",    icon: "🧱", desc: "Confidence in our code quality" },
  { name: "Support & Teamwork",      icon: "🤝", desc: "How well we collaborate and help each other" },
  { name: "Learning & Growth",       icon: "📈", desc: "Opportunities to learn and develop" },
  { name: "Fun & Engagement",        icon: "🎉", desc: "Enjoyment and energy in the team" },
];

const RATINGS = [
  { value: "GREEN",  emoji: "😊", label: "Great",   bg: "bg-emerald-500", ring: "ring-emerald-200", hover: "hover:bg-emerald-100" },
  { value: "YELLOW", emoji: "😐", label: "OK",      bg: "bg-amber-400",   ring: "ring-amber-100",   hover: "hover:bg-amber-50" },
  { value: "RED",    emoji: "😔", label: "Needs Work", bg: "bg-rose-500", ring: "ring-rose-200",    hover: "hover:bg-rose-50" },
];

export default function ClientHealthBoard({ initialBoard }: { initialBoard: any }) {
  const [board, setBoard] = useState(initialBoard);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [authorName, setAuthorName] = useState("");

  useEffect(() => {
    const savedName = localStorage.getItem("teamretro-name");
    if (savedName) setAuthorName(savedName);

    const s = io();
    setSocket(s);
    s.on("connect", () => s.emit("join-board", initialBoard.id));
    s.on("board-updated", () => fetchBoardData());
    return () => { s.disconnect(); };
  }, [initialBoard.id]);

  const fetchBoardData = async () => {
    const data = await getHealthBoard(initialBoard.id);
    if (data) setBoard(data);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthorName(e.target.value);
    localStorage.setItem("teamretro-name", e.target.value);
  };

  const handleVote = async (dimension: string, rating: string) => {
    if (!authorName.trim()) return;
    await addHealthMetric(board.id, authorName, dimension, rating);
    if (socket) socket.emit("board-updated", board.id);
    await fetchBoardData();
  };

  const getMyVote = (dimension: string) =>
    board.metrics.find((m: any) => m.dimension === dimension && m.author === authorName)?.rating;

  const countVotes = (dimension: string, rating: string) =>
    board.metrics.filter((m: any) => m.dimension === dimension && m.rating === rating).length;

  const totalVotersForDim = (dimension: string) =>
    board.metrics.filter((m: any) => m.dimension === dimension).length;

  return (
    <div className="h-full flex flex-col gap-5 max-w-4xl mx-auto w-full">
      {/* ─── Name Bar ─── */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 px-5 py-3 flex items-center justify-between animate-fade-in-up">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
            {authorName ? authorName[0].toUpperCase() : "?"}
          </div>
          <input
            type="text"
            placeholder="Your name…"
            className="text-sm bg-transparent border-none focus:outline-none focus:ring-0 font-medium text-slate-800 placeholder:text-slate-300 w-40"
            value={authorName}
            onChange={handleNameChange}
          />
        </div>
        {!authorName.trim() && (
          <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full font-medium">Enter your name to vote</span>
        )}
      </div>

      {/* ─── Dimensions Grid ─── */}
      <div className="space-y-3 animate-fade-in-up delay-100">
        {DIMENSIONS.map((dim, i) => {
          const myVote = getMyVote(dim.name);
          const total = totalVotersForDim(dim.name);

          return (
            <div key={dim.name} className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 card-hover" style={{ animationDelay: `${i * 60}ms` }}>
              {/* Dimension Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{dim.icon}</span>
                  <h3 className="font-[Outfit] font-bold text-slate-900 text-sm">{dim.name}</h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 ml-8">{dim.desc}</p>
              </div>

              {/* Vote Buttons */}
              <div className="flex items-center gap-2.5">
                {RATINGS.map(r => (
                  <button
                    key={r.value}
                    disabled={!authorName.trim()}
                    onClick={() => handleVote(dim.name, r.value)}
                    className={`group relative w-11 h-11 rounded-xl flex items-center justify-center text-xl transition-all border-2
                      ${myVote === r.value
                        ? `${r.bg} border-transparent scale-110 ring-4 ${r.ring} shadow-md`
                        : `bg-slate-50 border-slate-100 ${r.hover} hover:scale-105`}
                      disabled:cursor-not-allowed disabled:opacity-40`}
                    title={r.label}
                  >
                    {r.emoji}
                  </button>
                ))}
              </div>

              {/* Results Bar */}
              <div className="flex items-center gap-2 min-w-[120px]">
                {total === 0 ? (
                  <span className="text-xs text-slate-300">No votes</span>
                ) : (
                  <>
                    <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                      {countVotes(dim.name, "GREEN") > 0 && (
                        <div className="bg-emerald-500 h-full transition-all" style={{ width: `${(countVotes(dim.name, "GREEN") / total) * 100}%` }}></div>
                      )}
                      {countVotes(dim.name, "YELLOW") > 0 && (
                        <div className="bg-amber-400 h-full transition-all" style={{ width: `${(countVotes(dim.name, "YELLOW") / total) * 100}%` }}></div>
                      )}
                      {countVotes(dim.name, "RED") > 0 && (
                        <div className="bg-rose-500 h-full transition-all" style={{ width: `${(countVotes(dim.name, "RED") / total) * 100}%` }}></div>
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
  );
}
