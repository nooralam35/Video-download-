export interface VideoMetadata {
  id: string;
  url: string;
  platform: 'youtube' | 'instagram' | 'twitter' | 'tiktok' | 'generic';
  videoType: 'short' | 'long';
  title: string;
  thumbnail: string;
  duration: string;
  author: string;
  qualityOptions: string[];
}

export interface AIGeneratedContent {
  captions: string[];
  hashtags: string[];
  description: string;
  analysis: string;
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING_URL = 'ANALYZING_URL',
  RESULT_READY = 'RESULT_READY',
  DOWNLOADING = 'DOWNLOADING',
  PROCESSING_COPYRIGHT = 'PROCESSING_COPYRIGHT',
  ERROR = 'ERROR'
}