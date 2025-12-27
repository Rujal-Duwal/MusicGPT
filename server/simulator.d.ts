import type { Generation, Version } from '@/lib/types';

export function createVersion(label: string): Version;
export function createCompletedItem(prompt: string, createdAt: number): Generation;
export function startSimulation(itemId: string): void;
