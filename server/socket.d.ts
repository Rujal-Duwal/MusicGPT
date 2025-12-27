import type { Server } from 'socket.io';

export function setIO(io: Server): void;
export function getIO(): Server | null;
