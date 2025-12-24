'use client';

import { MusicProvider } from '@/components/music-context';

export default function Providers({ children }: { children: React.ReactNode }) {
  return <MusicProvider>{children}</MusicProvider>;
}
