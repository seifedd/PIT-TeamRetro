"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { addRetroItem, updateBoardStatus, getRetroBoard } from "@/app/actions/retro";

const CATEGORIES = [
  { key: "WENT_WELL",    label: "Went Well",     emoji: "😄", color: "emerald", gradient: "from-emerald-500 to-teal-500" },
  { key: "TO_IMPROVE",   label: "To Improve",    emoji: "🧐", color: "rose",    gradient: "from-rose-500 to-pink-500" },
  { key: "ACTION_ITEMS", label: "Action Items",   emoji: "🚀", color: "sky",     gradient: "from-sky-500 to-blue-500" },
];

export default function ClientRetroBoard({ initialBoard }: { initialBoard: any }) {
  const [board, setBoard] = useState(initialBoard);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [newTexts, setNewTexts] = useState<Record<string, string>>({ WENT_WELL: "", TO_IMPROVE: "", ACTION_ITEMS: "" });
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
    const data = await getRetroBoard(initialBoard.id);
    if (data) setBoard(data);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthorName(e.target.value);
    localStorage.setItem("teamretro-name", e.target.value);
  };

  const handleAddItem = async (e: React.FormEvent, category: string) => {
    e.preventDefault();
    const text = newTexts[category];
    if (!text?.trim() || !authorName.trim()) return;
    setNewTexts(prev => ({ ...prev, [category]: "" }));
    await addRetroItem(board.id, authorName, text, category);
    if (socket) socket.emit("board-updated", board.id);
    await fetchBoardData();
  };

  const handleStatusChange = async (newStatus: string) => {
    await updateBoardStatus(board.id, newStatus);
    if (socket) socket.emit("board-updated", board.id);
    await fetchBoardData();
  };

  return (
    <div className="h-full flex flex-col gap-5 max-w-7xl mx-auto w-full">
      {/* ─── Name Bar ─── */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 px-5 py-3 flex items-center gap-4 animate-fade-in-up">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
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
          <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full font-medium">Enter your name to participate</span>
        )}
      </div>

      {/* ─── Stage: Set Stage ─── */}
      {board.status === "SET_STAGE" && (
        <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm border border-slate-200/80 animate-fade-in-up delay-100">
          <div className="max-w-md text-center space-y-5 p-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center mx-auto shadow-lg shadow-indigo-200 text-3xl">
              🎯
            </div>
            <h2 className="text-3xl font-[Outfit] font-extrabold text-slate-900">Set the Stage</h2>
            <p className="text-slate-500 leading-relaxed">
              Welcome! Wait for the team to join, set context, and review any open action items before starting the brainstorm.
            </p>
            <button
              onClick={() => handleStatusChange("BRAINSTORM")}
              className="btn-primary bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200 w-full py-3 text-base"
            >
              Start Brainstorming →
            </button>
          </div>
        </div>
      )}

      {/* ─── Stage: Brainstorm ─── */}
      {board.status === "BRAINSTORM" && (
        <div className="flex-1 animate-fade-in-up delay-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 h-full items-start">
            {CATEGORIES.map(cat => {
              const items = board.items.filter((i: any) => i.category === cat.key);
              return (
                <div key={cat.key} className="bg-white rounded-2xl shadow-sm border border-slate-200/80 flex flex-col min-h-[520px] overflow-hidden">
                  {/* Column Header */}
                  <div className={`bg-gradient-to-r ${cat.gradient} px-5 py-3 flex items-center justify-between`}>
                    <h3 className="text-white font-[Outfit] font-bold text-sm flex items-center gap-2">
                      <span className="text-lg">{cat.emoji}</span> {cat.label}
                    </h3>
                    <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
                      {items.length}
                    </span>
                  </div>

                  {/* Items List */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
                    {items.map((item: any) => (
                      <div key={item.id} className="retro-card bg-slate-50 hover:bg-white p-3.5 rounded-xl border border-slate-100 transition-all">
                        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{item.text}</p>
                        <p className="text-[11px] font-medium text-slate-400 mt-2 text-right">{item.author}</p>
                      </div>
                    ))}
                    {items.length === 0 && (
                      <div className="flex-1 flex items-center justify-center py-12 text-slate-300 text-sm">
                        No items yet. Add one below!
                      </div>
                    )}
                  </div>

                  {/* Input */}
                  <form className="p-4 border-t border-slate-100 bg-slate-50/50" onSubmit={e => handleAddItem(e, cat.key)}>
                    <textarea
                      value={newTexts[cat.key]}
                      onChange={e => setNewTexts(prev => ({ ...prev, [cat.key]: e.target.value }))}
                      placeholder={`Add a ${cat.label.toLowerCase()} item…`}
                      className="w-full text-sm bg-white border border-slate-200 p-3 rounded-xl shadow-sm resize-none h-16 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition placeholder:text-slate-300"
                      onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAddItem(e, cat.key); } }}
                    />
                    <button
                      type="submit"
                      disabled={!authorName.trim() || !newTexts[cat.key]?.trim()}
                      className={`btn-primary w-full mt-2 text-white bg-gradient-to-r ${cat.gradient} hover:opacity-90 shadow-sm disabled:opacity-40`}
                    >
                      Add Item
                    </button>
                  </form>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
