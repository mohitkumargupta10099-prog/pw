import { useSyncExternalStore } from "react";

export type EnrolledBatch = {
  id: string;
  name: string;
  byName: string;
  image: string;
  language: string;
  startDate: string;
  endDate: string;
  fee: number;
};

const KEY = "pw-enrolled-batches-v2";
const listeners = new Set<() => void>();
let snapshot: EnrolledBatch[] = [];
let loaded = false;

function read(): EnrolledBatch[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as EnrolledBatch[]) : [];
  } catch {
    return [];
  }
}

function emit() {
  snapshot = read();
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  if (!loaded) {
    loaded = true;
    snapshot = read();
  }
  listeners.add(cb);
  window.addEventListener("storage", emit);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", emit);
  };
}

const EMPTY: EnrolledBatch[] = [];

export function useEnrolled() {
  return useSyncExternalStore(
    subscribe,
    () => {
      if (!loaded) {
        loaded = true;
        snapshot = read();
      }
      return snapshot;
    },
    () => EMPTY,
  );
}

export function enroll(batch: EnrolledBatch) {
  const list = read();
  if (list.some((b) => b.id === batch.id)) return false;
  window.localStorage.setItem(KEY, JSON.stringify([batch, ...list]));
  emit();
  return true;
}

export function unenroll(id: string) {
  window.localStorage.setItem(
    KEY,
    JSON.stringify(read().filter((b) => b.id !== id)),
  );
  emit();
}

export function isEnrolled(list: EnrolledBatch[], id: string) {
  return list.some((b) => b.id === id);
}
