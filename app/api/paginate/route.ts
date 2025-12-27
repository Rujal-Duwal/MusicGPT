import { NextResponse } from 'next/server';
import { appendGenerations, getGenerations } from '@/server/store';
import { getIO } from '@/server/socket';
import { createCompletedItem } from '@/server/simulator';

export const runtime = 'nodejs';

export async function POST() {
  const io = getIO();
  if (io) {
    io.emit('pagination:start');
  }

  setTimeout(() => {
    const items = getGenerations();
    const baseTime = items[items.length - 1]?.createdAt || Date.now();
    const newItems = Array.from({ length: 3 }).map((_, index) =>
      createCompletedItem(
        `Archived prompt ${items.length + index + 1}`,
        baseTime - (index + 1) * 60000
      )
    );

    appendGenerations(newItems);
    if (io) {
      io.emit('pagination:complete', { items: newItems });
    }
  }, 1400);

  return NextResponse.json({ ok: true });
}
