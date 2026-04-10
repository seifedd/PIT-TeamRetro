"use client";

export type RetroStatus = "SET_STAGE" | "BRAINSTORM" | "VOTE" | "ACTIONS" | "CLOSED";
export type RetroCategory = "WENT_WELL" | "TO_IMPROVE" | "ACTION_ITEMS";
export type HealthRating = "GREEN" | "YELLOW" | "RED";

export interface RetroItem {
  id: string;
  boardId: string;
  author: string;
  text: string;
  category: RetroCategory;
  votes: number;
  createdAt: string;
  updatedAt: string;
}

export interface RetroAction {
  id: string;
  boardId: string;
  text: string;
  assignee: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RetroBoard {
  id: string;
  title: string;
  status: RetroStatus;
  items: RetroItem[];
  actions: RetroAction[];
  createdAt: string;
  updatedAt: string;
}

export interface HealthCheckMetric {
  id: string;
  boardId: string;
  author: string;
  dimension: string;
  rating: HealthRating;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface HealthBoard {
  id: string;
  title: string;
  metrics: HealthCheckMetric[];
  createdAt: string;
  updatedAt: string;
}

interface BoardStore {
  retroBoards: Record<string, RetroBoard>;
  healthBoards: Record<string, HealthBoard>;
}

const STORAGE_KEY = "teamretro-store-v1";
const CHANGE_EVENT = "teamretro:store-changed";
const CHANNEL_NAME = "teamretro:boards";

function emptyStore(): BoardStore {
  return {
    retroBoards: {},
    healthBoards: {},
  };
}

function now() {
  return new Date().toISOString();
}

function createId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
  }

  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function readStore(): BoardStore {
  if (typeof window === "undefined") {
    return emptyStore();
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return emptyStore();
  }

  try {
    return JSON.parse(raw) as BoardStore;
  } catch {
    return emptyStore();
  }
}

function broadcastChange() {
  window.dispatchEvent(new Event(CHANGE_EVENT));

  if (typeof BroadcastChannel !== "undefined") {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channel.postMessage("changed");
    channel.close();
  }
}

function writeStore(store: BoardStore) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  broadcastChange();
}

export function subscribeToBoardStore(onChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      onChange();
    }
  };
  const handleLocal = () => onChange();

  window.addEventListener("storage", handleStorage);
  window.addEventListener(CHANGE_EVENT, handleLocal);

  let channel: BroadcastChannel | null = null;
  if (typeof BroadcastChannel !== "undefined") {
    channel = new BroadcastChannel(CHANNEL_NAME);
    channel.addEventListener("message", handleLocal);
  }

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(CHANGE_EVENT, handleLocal);
    channel?.removeEventListener("message", handleLocal);
    channel?.close();
  };
}

export function createRetroBoard(title: string) {
  const store = readStore();
  const timestamp = now();
  const board: RetroBoard = {
    id: createId("retro"),
    title: title.trim(),
    status: "SET_STAGE",
    items: [],
    actions: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  store.retroBoards[board.id] = board;
  writeStore(store);
  return board;
}

export function createHealthBoard(title: string) {
  const store = readStore();
  const timestamp = now();
  const board: HealthBoard = {
    id: createId("health"),
    title: title.trim(),
    metrics: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  store.healthBoards[board.id] = board;
  writeStore(store);
  return board;
}

export function getRetroBoard(id: string) {
  return readStore().retroBoards[id] ?? null;
}

export function getHealthBoard(id: string) {
  return readStore().healthBoards[id] ?? null;
}

export function addRetroItem(boardId: string, author: string, text: string, category: RetroCategory) {
  const store = readStore();
  const board = store.retroBoards[boardId];
  if (!board) {
    return null;
  }

  const timestamp = now();
  const updatedBoard: RetroBoard = {
    ...board,
    items: [
      ...board.items,
      {
        id: createId("item"),
        boardId,
        author: author.trim(),
        text: text.trim(),
        category,
        votes: 0,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    ],
    updatedAt: timestamp,
  };

  store.retroBoards[boardId] = updatedBoard;
  writeStore(store);
  return updatedBoard;
}

export function voteRetroItem(boardId: string, itemId: string) {
  const store = readStore();
  const board = store.retroBoards[boardId];
  if (!board) {
    return null;
  }

  const timestamp = now();
  const updatedBoard: RetroBoard = {
    ...board,
    items: board.items.map((item) =>
      item.id === itemId
        ? {
            ...item,
            votes: item.votes + 1,
            updatedAt: timestamp,
          }
        : item,
    ),
    updatedAt: timestamp,
  };

  store.retroBoards[boardId] = updatedBoard;
  writeStore(store);
  return updatedBoard;
}

export function updateRetroStatus(boardId: string, status: RetroStatus) {
  const store = readStore();
  const board = store.retroBoards[boardId];
  if (!board) {
    return null;
  }

  const updatedBoard: RetroBoard = {
    ...board,
    status,
    updatedAt: now(),
  };

  store.retroBoards[boardId] = updatedBoard;
  writeStore(store);
  return updatedBoard;
}

export function upsertHealthMetric(boardId: string, author: string, dimension: string, rating: HealthRating) {
  const store = readStore();
  const board = store.healthBoards[boardId];
  if (!board) {
    return null;
  }

  const trimmedAuthor = author.trim();
  const timestamp = now();
  const existingMetric = board.metrics.find(
    (metric) => metric.author === trimmedAuthor && metric.dimension === dimension,
  );

  const metrics = existingMetric
    ? board.metrics.map((metric) =>
        metric.id === existingMetric.id
          ? {
              ...metric,
              rating,
              updatedAt: timestamp,
            }
          : metric,
      )
    : [
        ...board.metrics,
        {
          id: createId("metric"),
          boardId,
          author: trimmedAuthor,
          dimension,
          rating,
          comment: null,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      ];

  const updatedBoard: HealthBoard = {
    ...board,
    metrics,
    updatedAt: timestamp,
  };

  store.healthBoards[boardId] = updatedBoard;
  writeStore(store);
  return updatedBoard;
}
