'use client';

import MusicProvider from '@/components/music-provider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return <MusicProvider>{children}</MusicProvider>;
}
