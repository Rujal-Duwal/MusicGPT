'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import type { ConnectionState, Generation } from '@/lib/types';

type State = {
  items: Generation[];
  connection: ConnectionState;
  isPaginating: boolean;
  error: string | null;
  isSubmitting: boolean;
};

type Action =
  | { type: 'connection'; status: ConnectionState }
  | { type: 'set-items'; items: Generation[] }
  | { type: 'append-items'; items: Generation[] }
  | { type: 'upsert-item'; item: Generation }
  | { type: 'update-item'; id: string; patch: Partial<Generation> }
  | { type: 'pagination'; active: boolean }
  | { type: 'error'; message: string | null }
  | { type: 'submitting'; value: boolean };

const initialState: State = {
  items: [],
  connection: 'connecting',
  isPaginating: false,
  error: null,
  isSubmitting: false
};

const MusicContext = createContext<
  (State & {
    submitPrompt: (prompt: string) => Promise<void>;
    loadMore: () => Promise<void>;
    activeItem?: Generation;
    latestFailed?: Generation;
  }) | null
>(null);

const sortItems = (items: Generation[]) =>
  [...items].sort((a, b) => b.createdAt - a.createdAt);

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'connection':
      return { ...state, connection: action.status };
    case 'set-items':
      return { ...state, items: sortItems(action.items) };
    case 'append-items': {
      const nextItems = [...state.items, ...action.items];
      return { ...state, items: sortItems(nextItems) };
    }
    case 'upsert-item': {
      const existingIndex = state.items.findIndex((item) => item.id === action.item.id);
      const nextItems = [...state.items];
      if (existingIndex === -1) {
        nextItems.unshift(action.item);
      } else {
        nextItems[existingIndex] = { ...nextItems[existingIndex], ...action.item };
      }
      return { ...state, items: sortItems(nextItems) };
    }
    case 'update-item': {
      const nextItems = state.items.map((item) =>
        item.id === action.id ? { ...item, ...action.patch } : item
      );
      return { ...state, items: sortItems(nextItems) };
    }
    case 'pagination':
      return { ...state, isPaginating: action.active };
    case 'error':
      return { ...state, error: action.message };
    case 'submitting':
      return { ...state, isSubmitting: action.value };
    default:
      return state;
  }
};

const WS_DEFAULT = 'ws://localhost:4000/ws';
const API_DEFAULT = 'http://localhost:4000';

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const wsRef = useRef<WebSocket | null>(null);

  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case 'connection:ready':
          dispatch({ type: 'set-items', items: message.payload.items || [] });
          break;
        case 'generation:queued':
          dispatch({ type: 'upsert-item', item: message.payload });
          break;
        case 'generation:progress':
          dispatch({
            type: 'update-item',
            id: message.payload.id,
            patch: { status: 'generating', progress: message.payload.progress }
          });
          break;
        case 'generation:completed':
          dispatch({
            type: 'update-item',
            id: message.payload.id,
            patch: {
              status: 'completed',
              progress: 100,
              versions: message.payload.versions
            }
          });
          break;
        case 'generation:failed':
          dispatch({
            type: 'update-item',
            id: message.payload.id,
            patch: {
              status: 'failed',
              progress: 100,
              error: message.payload.error
            }
          });
          break;
        case 'pagination:start':
          dispatch({ type: 'pagination', active: true });
          break;
        case 'pagination:complete':
          dispatch({ type: 'pagination', active: false });
          if (message.payload?.items) {
            dispatch({ type: 'append-items', items: message.payload.items });
          }
          break;
        case 'pagination:error':
          dispatch({ type: 'pagination', active: false });
          dispatch({ type: 'error', message: message.payload?.error || 'Failed to load more.' });
          break;
        default:
          break;
      }
    } catch (err) {
      dispatch({ type: 'error', message: 'Malformed WebSocket message.' });
    }
  }, []);

  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || WS_DEFAULT;
    const socket = new WebSocket(wsUrl);
    wsRef.current = socket;

    socket.onopen = () => dispatch({ type: 'connection', status: 'open' });
    socket.onclose = () => dispatch({ type: 'connection', status: 'closed' });
    socket.onerror = () => dispatch({ type: 'connection', status: 'closed' });
    socket.onmessage = handleMessage;

    return () => {
      socket.close();
    };
  }, [handleMessage]);

  const submitPrompt = useCallback(async (prompt: string) => {
    if (!prompt.trim()) {
      return;
    }
    dispatch({ type: 'submitting', value: true });
    dispatch({ type: 'error', message: null });
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE || API_DEFAULT;
      const response = await fetch(`${base}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
      });
      if (!response.ok) {
        throw new Error('Request failed');
      }
    } catch (err) {
      dispatch({ type: 'error', message: 'Failed to submit prompt.' });
    } finally {
      dispatch({ type: 'submitting', value: false });
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (state.isPaginating) {
      return;
    }
    dispatch({ type: 'pagination', active: true });
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE || API_DEFAULT;
      const response = await fetch(`${base}/api/paginate`, {
        method: 'POST'
      });
      if (!response.ok) {
        throw new Error('Pagination failed');
      }
    } catch (err) {
      dispatch({ type: 'pagination', active: false });
      dispatch({ type: 'error', message: 'Failed to load more.' });
    }
  }, [state.isPaginating]);

  const activeItem = useMemo(
    () =>
      state.items.find((item) => item.status === 'queued' || item.status === 'generating'),
    [state.items]
  );

  const latestFailed = useMemo(
    () => state.items.find((item) => item.status === 'failed'),
    [state.items]
  );

  const value = useMemo(
    () => ({
      ...state,
      submitPrompt,
      loadMore,
      activeItem,
      latestFailed
    }),
    [state, submitPrompt, loadMore, activeItem, latestFailed]
  );

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within MusicProvider');
  }
  return context;
}
