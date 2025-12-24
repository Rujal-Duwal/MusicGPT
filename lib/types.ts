export type GenerationStatus = 'queued' | 'generating' | 'completed' | 'failed';

export type Version = {
  id: string;
  title: string;
  duration: string;
  bpm: number;
  key: string;
  mood: string;
  palette: [string, string];
};

export type Generation = {
  id: string;
  prompt: string;
  status: GenerationStatus;
  progress: number;
  createdAt: number;
  versions?: Version[];
  error?: string;
};

export type ConnectionState = 'connecting' | 'open' | 'closed';
