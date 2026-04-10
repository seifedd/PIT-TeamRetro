"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  addRetroItem,
  getRetroBoard,
  type RetroBoard,
  type RetroCategory,
  type RetroStatus,
  subscribeToBoardStore,
  updateRetroStatus,
  voteRetroItem,
} from "@/lib/boards";

const CATEGORIES: Array<{ key: RetroCategory; label: string; emoji: string; gradient: string }> = [
  { key: "WENT_WELL", label: "Went Well", emoji: "😄", gradient: "from-emerald-500 to-teal-500" },
  { key: "TO_IMPROVE", label: "To Improve", emoji: "🧐", gradient: "from-rose-500 to-pink-500" },
  { key: "ACTION_ITEMS", label: "Action Items", emoji: "🚀", gradient: "from-sky-500 to-blue-500" },
];

const STAGE_FLOW: Record<RetroStatus, { next: RetroStatus; nextLabel: string } | null> = {
  SET_STAGE: { next: "BRAINSTORM", nextLabel: "Start Brainstorming" },
  BRAINSTORM: { next: "VOTE", nextLabel: "Move to Voting" },
  VOTE: { next: "ACTIONS", nextLabel: "Review Actions" },
  ACTIONS: { next: "CLOSED", nextLabel: "Close Retro" },
  CLOSED: null,
};

export default function ClientRetroBoard() {
  const searchParams = useSearchParams();
  const boardId = searchParams.get("id") ?? "";
  const [board, setBoard] = useState<RetroBoard | null>(null);
  const [newTexts, setNewTexts] = useState<Record<RetroCategory, string>>({
    WENT_WELL: "",
    TO_IMPROVE: "",
    ACTION_ITEMS: "",
  });
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
      setBoard(getRetroBoard(boardId));
    };

    syncBoard();
    return subscribeToBoardStore(syncBoard);
  }, [boardId]);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAuthorName(event.target.value);
    localStorage.setItem("teamretro-name", event.target.value);
  };

  const handleAddItem = (event: React.FormEvent, category: RetroCategory) => {
    event.preventDefault();
    if (!board) {
      return;
    }

    const text = newTexts[category];
    if (!text.trim() || !authorName.trim()) {
      return;
    }

    const updatedBoard = addRetroItem(board.id, authorName, text, category);
    if (updatedBoard) {
      setBoard(updatedBoard);
      setNewTexts((current) => ({ ...current, [category]: "" }));
    }
  };

  const handleVote = (itemId: string) => {
    if (!board) {
      return;
    }

    const updatedBoard = voteRetroItem(board.id, itemId);
    if (updatedBoard) {
      setBoard(updatedBoard);
    }
  };

  const handleStatusChange = (status: RetroStatus) => {
    if (!board) {
      return;
    }

    const updatedBoard = updateRetroStatus(board.id, status);
    if (updatedBoard) {
      setBoard(updatedBoard);
    }
  };

  if (!boardId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/20 p-6">
        <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200/80 bg-white p-10 text-center shadow-sm">
          <h1 className="text-3xl font-[Outfit] font-extrabold text-slate-900">Missing session ID</h1>
          <p className="mt-3 text-slate-500">Open a retrospective from the home page or use a URL like <span className="font-mono text-slate-700">/retro?id=retro-1234</span>.</p>
          <Link href="/" className="btn-primary mt-6 bg-indigo-600 text-white hover:bg-indigo-700">Back Home</Link>
        </div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/20 p-6">
        <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200/80 bg-white p-10 text-center shadow-sm">
          <h1 className="text-3xl font-[Outfit] font-extrabold text-slate-900">Session not found</h1>
          <p className="mt-3 text-slate-500">This GitHub Pages build stores boards in the current browser, so this ID is only available where it was originally created.</p>
          <Link href="/" className="btn-primary mt-6 bg-indigo-600 text-white hover:bg-indigo-700">Create a New Session</Link>
        </div>
      </div>
    );
  }

  const stageInfo = STAGE_FLOW[board.status];

  const renderColumn = (category: (typeof CATEGORIES)[number], showVoting: boolean) => {
    const items = board.items
      .filter((item) => item.category === category.key)
      .sort((a, b) => (showVoting ? b.votes - a.votes : 0));

    return (
      <div key={category.key} className="bg-white rounded-2xl shadow-sm border border-slate-200/80 flex flex-col min-h-[520px] overflow-hidden">
        <div className={`bg-gradient-to-r ${category.gradient} px-5 py-3 flex items-center justify-between`}>
          <h3 className="text-white font-[Outfit] font-bold text-sm flex items-center gap-2">
            <span className="text-lg">{category.emoji}</span> {category.label}
          </h3>
          <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
            {items.length}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {items.map((item) => (
            <div key={item.id} className="retro-card bg-slate-50 hover:bg-white p-3.5 rounded-xl border border-slate-100 transition-all">
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{item.text}</p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-[11px] font-medium text-slate-400">{item.author}</p>
                {showVoting ? (
                  <button
                    onClick={() => handleVote(item.id)}
                    className="flex items-center gap-1 text-xs font-bold text-indigo-500 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-full transition-all"
                  >
                    👍 {item.votes}
                  </button>
                ) : item.votes > 0 ? (
                  <span className="text-[11px] text-slate-400 font-medium">👍 {item.votes}</span>
                ) : null}
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="flex-1 flex items-center justify-center py-12 text-slate-300 text-sm">
              No items yet{board.status === "BRAINSTORM" ? ". Add one below." : "."}
            </div>
          )}
        </div>

        {board.status === "BRAINSTORM" && (
          <form className="p-4 border-t border-slate-100 bg-slate-50/50" onSubmit={(event) => handleAddItem(event, category.key)}>
            <textarea
              value={newTexts[category.key]}
              onChange={(event) => setNewTexts((current) => ({ ...current, [category.key]: event.target.value }))}
              placeholder={`Add a ${category.label.toLowerCase()} item...`}
              className="w-full text-sm bg-white border border-slate-200 p-3 rounded-xl shadow-sm resize-none h-16 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition placeholder:text-slate-300"
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  handleAddItem(event, category.key);
                }
              }}
            />
            <button
              type="submit"
              disabled={!authorName.trim() || !newTexts[category.key].trim()}
              className={`btn-primary w-full mt-2 text-white bg-gradient-to-r ${category.gradient} hover:opacity-90 shadow-sm disabled:opacity-40`}
            >
              Add Item
            </button>
          </form>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/20 flex flex-col">
      <header className="bg-white/70 backdrop-blur-xl border-b border-slate-200/60 px-6 py-3.5 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-sm shadow-indigo-200 group-hover:shadow-md group-hover:shadow-indigo-200 transition">
              <span className="text-white font-bold text-xs">TR</span>
            </div>
          </Link>
          <div className="h-5 w-px bg-slate-200"></div>
          <div>
            <h1 className="text-lg font-[Outfit] font-bold tracking-tight text-slate-900 leading-tight">{board.title}</h1>
            <p className="text-[11px] font-mono text-slate-400 mt-0.5">ID: {board.id}</p>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <span className="bg-indigo-50 text-indigo-600 border border-indigo-100 px-3.5 py-1 rounded-full text-xs font-bold tracking-wide">
            {board.status.replace(/_/g, " ")}
          </span>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="h-full flex flex-col gap-5 max-w-7xl mx-auto w-full">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 px-5 py-3 flex items-center gap-4 animate-fade-in-up">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
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
              <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full font-medium">Enter your name to participate</span>
            )}
            <div className="ml-auto flex items-center gap-3">
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                Stage: <span className="text-slate-600 font-bold">{board.status.replace(/_/g, " ")}</span>
              </span>
              {stageInfo && (
                <button
                  onClick={() => handleStatusChange(stageInfo.next)}
                  className="text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-1.5 rounded-full shadow-sm transition"
                >
                  {stageInfo.nextLabel}
                </button>
              )}
            </div>
          </div>

          {board.status === "SET_STAGE" && (
            <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm border border-slate-200/80 animate-fade-in-up delay-100">
              <div className="max-w-md text-center space-y-5 p-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center mx-auto shadow-lg shadow-indigo-200 text-3xl">
                  🎯
                </div>
                <h2 className="text-3xl font-[Outfit] font-extrabold text-slate-900">Set the Stage</h2>
                <p className="text-slate-500 leading-relaxed">
                  This static build keeps the board in your browser. Use the shared session ID to reopen it on this device.
                </p>
                <button
                  onClick={() => handleStatusChange("BRAINSTORM")}
                  className="btn-primary bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200 w-full py-3 text-base"
                >
                  Start Brainstorming
                </button>
              </div>
            </div>
          )}

          {board.status === "BRAINSTORM" && (
            <div className="flex-1 animate-fade-in-up delay-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 h-full items-start">
                {CATEGORIES.map((category) => renderColumn(category, false))}
              </div>
            </div>
          )}

          {board.status === "VOTE" && (
            <div className="flex-1 animate-fade-in-up delay-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 h-full items-start">
                {CATEGORIES.map((category) => renderColumn(category, true))}
              </div>
            </div>
          )}

          {board.status === "ACTIONS" && (
            <div className="flex-1 animate-fade-in-up delay-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 h-full items-start">
                {CATEGORIES.map((category) => renderColumn(category, false))}
              </div>
            </div>
          )}

          {board.status === "CLOSED" && (
            <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm border border-slate-200/80 animate-fade-in-up delay-100">
              <div className="max-w-md text-center space-y-5 p-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-200 text-3xl">
                  ✅
                </div>
                <h2 className="text-3xl font-[Outfit] font-extrabold text-slate-900">Retro Complete</h2>
                <p className="text-slate-500 leading-relaxed">This retrospective has been closed.</p>
                <div className="grid grid-cols-3 gap-3 text-center pt-2">
                  {CATEGORIES.map((category) => (
                    <div key={category.key} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <p className="text-2xl">{category.emoji}</p>
                      <p className="text-lg font-bold text-slate-800">{board.items.filter((item) => item.category === category.key).length}</p>
                      <p className="text-[11px] text-slate-400">{category.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
