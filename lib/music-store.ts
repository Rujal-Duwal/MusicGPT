import { create } from 'zustand';
import type { ConnectionState, Generation, PlayerTrack } from '@/lib/types';

type MusicState = {
  items: Generation[];
  connection: ConnectionState;
  isPaginating: boolean;
  error: string | null;
  isSubmitting: boolean;
  currentTrack: PlayerTrack | null;
  isPlaying: boolean;
  setConnection: (status: ConnectionState) => void;
  setItems: (items: Generation[]) => void;
  appendItems: (items: Generation[]) => void;
  upsertItem: (item: Generation) => void;
  updateItem: (id: string, patch: Partial<Generation>) => void;
  setPaginating: (value: boolean) => void;
  setError: (message: string | null) => void;
  setSubmitting: (value: boolean) => void;
  setTrack: (track: PlayerTrack) => void;
  togglePlay: () => void;
  clearTrack: () => void;
  submitPrompt: (prompt: string) => Promise<void>;
  loadMore: () => Promise<void>;
};

const sortItems = (items: Generation[]) =>
  [...items].sort((a, b) => b.createdAt - a.createdAt);

export const useMusicStore = create<MusicState>((set, get) => ({
  items: [],
  connection: 'connecting',
  isPaginating: false,
  error: null,
  isSubmitting: false,
  currentTrack: null,
  isPlaying: false,
  setConnection: (status) => set({ connection: status }),
  setItems: (items) => set({ items: sortItems(items) }),
  appendItems: (items) => set({ items: sortItems([...get().items, ...items]) }),
  upsertItem: (item) =>
    set((state) => {
      const existingIndex = state.items.findIndex((entry) => entry.id === item.id);
      const nextItems = [...state.items];
      if (existingIndex === -1) {
        nextItems.unshift(item);
      } else {
        nextItems[existingIndex] = { ...nextItems[existingIndex], ...item };
      }
      return { items: sortItems(nextItems) };
    }),
  updateItem: (id, patch) =>
    set((state) => ({
      items: sortItems(
        state.items.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry))
      )
    })),
  setPaginating: (value) => set({ isPaginating: value }),
  setError: (message) => set({ error: message }),
  setSubmitting: (value) => set({ isSubmitting: value }),
  setTrack: (track) =>
    set((state) => {
      const isSame = state.currentTrack?.id === track.id;
      return {
        currentTrack: track,
        isPlaying: isSame ? !state.isPlaying : true
      };
    }),
  togglePlay: () =>
    set((state) =>
      state.currentTrack ? { isPlaying: !state.isPlaying } : state
    ),
  clearTrack: () => set({ currentTrack: null, isPlaying: false }),
  submitPrompt: async (prompt) => {
    if (!prompt.trim()) {
      return;
    }
    set({ isSubmitting: true, error: null });
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
      });
      if (!response.ok) {
        throw new Error('Request failed');
      }
    } catch (error) {
      set({ error: 'Failed to submit prompt.' });
    } finally {
      set({ isSubmitting: false });
    }
  },
  loadMore: async () => {
    if (get().isPaginating) {
      return;
    }
    set({ isPaginating: true });
    try {
      const response = await fetch('/api/paginate', {
        method: 'POST'
      });
      if (!response.ok) {
        throw new Error('Pagination failed');
      }
    } catch (error) {
      set({ isPaginating: false, error: 'Failed to load more.' });
    }
  }
}));
