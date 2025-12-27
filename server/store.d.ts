import type { Generation } from '@/lib/types';

export function getGenerations(): Generation[];
export function setGenerations(items: Generation[]): void;
export function addGeneration(item: Generation): void;
export function updateGeneration(id: string, patch: Partial<Generation>): void;
export function appendGenerations(items: Generation[]): void;
