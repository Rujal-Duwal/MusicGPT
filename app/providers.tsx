'use client';

import MusicProvider from '@/components/providers/music-provider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return <MusicProvider>{children}</MusicProvider>;
}
