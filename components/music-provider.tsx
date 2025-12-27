'use client';

import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useMusicStore } from '@/lib/music-store';
import type { Generation } from '@/lib/types';

type Payloads = {
  'connection:ready': { items: Generation[] };
  'generation:pending': Generation;
  'generation:progress': { id: string; progress: number };
  'generation:completed': { id: string; versions: Generation['versions'] };
  'generation:failed': { id: string; error: string };
  'pagination:start': void;
  'pagination:complete': { items: Generation[] };
  'pagination:error': { error?: string };
};

const WS_DEFAULT = 'http://localhost:3000';

export default function MusicProvider({ children }: { children: React.ReactNode }) {
  const setConnection = useMusicStore((state) => state.setConnection);
  const setItems = useMusicStore((state) => state.setItems);
  const appendItems = useMusicStore((state) => state.appendItems);
  const upsertItem = useMusicStore((state) => state.upsertItem);
  const updateItem = useMusicStore((state) => state.updateItem);
  const setPaginating = useMusicStore((state) => state.setPaginating);
  const setError = useMusicStore((state) => state.setError);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_WS_URL || WS_DEFAULT;
    const socket: Socket = io(url, {
      path: '/ws',
      transports: ['websocket']
    });

    setConnection('connecting');

    socket.on('connect', () => setConnection('open'));
    socket.on('disconnect', () => setConnection('closed'));

    socket.on('connection:ready', (payload: Payloads['connection:ready']) => {
      setItems(payload.items || []);
    });

    socket.on('generation:pending', (payload: Payloads['generation:pending']) => {
      upsertItem(payload);
    });

    socket.on('generation:progress', (payload: Payloads['generation:progress']) => {
      updateItem(payload.id, { status: 'generating', progress: payload.progress });
    });

    socket.on('generation:completed', (payload: Payloads['generation:completed']) => {
      updateItem(payload.id, { status: 'completed', progress: 100, versions: payload.versions });
    });

    socket.on('generation:failed', (payload: Payloads['generation:failed']) => {
      updateItem(payload.id, { status: 'failed', progress: 100, error: payload.error });
    });

    socket.on('pagination:start', () => {
      setPaginating(true);
    });

    socket.on('pagination:complete', (payload: Payloads['pagination:complete']) => {
      setPaginating(false);
      appendItems(payload.items || []);
    });

    socket.on('pagination:error', (payload: Payloads['pagination:error']) => {
      setPaginating(false);
      setError(payload?.error || 'Failed to load more.');
    });

    return () => {
      socket.disconnect();
    };
  }, [appendItems, setConnection, setError, setItems, setPaginating, updateItem, upsertItem]);

  return <>{children}</>;
}
