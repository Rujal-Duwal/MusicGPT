import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { addGeneration } from '@/server/store';
import { getIO } from '@/server/socket';
import { startSimulation } from '@/server/simulator';
import type { Generation } from '@/lib/types';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const prompt = String(body?.prompt || '').trim();

  if (!prompt) {
    return NextResponse.json({ ok: false, error: 'Prompt required.' }, { status: 400 });
  }

  const item: Generation = {
    id: randomUUID(),
    prompt,
    status: 'pending',
    progress: 0,
    createdAt: Date.now()
  };

  addGeneration(item);

  const io = getIO();
  if (io) {
    io.emit('generation:pending', item);
  }

  setTimeout(() => startSimulation(item.id), 600);

  return NextResponse.json({ ok: true, id: item.id });
}
