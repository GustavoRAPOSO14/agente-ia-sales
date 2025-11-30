export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  groundingMetadata?: GroundingMetadata;
  isError?: boolean;
}

export interface GroundingMetadata {
  groundingChunks?: GroundingChunk[];
  groundingSupports?: any[];
  webSearchQueries?: string[];
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface GeminiResponse {
  text: string;
  groundingMetadata?: GroundingMetadata;
}

export type LoadingState = 'idle' | 'loading';