// types/conspiracy.ts
export interface Category {
    id: string;
    label: string;
    icon: React.ReactNode;
    color: string;
  }
  
  export interface TelemetryData {
    latitude: number;
    longitude: number;
    altitude: number;
    bearing: number;
    velocity: number;
    signalStrength: number;
  }
  
  export interface SystemStatus {
    status: 'OPERATIONAL' | 'MAINTENANCE' | 'CRITICAL';
    cpu: number;
    memory: number;
    uptime: number;
  }
  
  export interface ConspiracyTheory {
    id?: string;
    content: string;
    category: string;
    createdAt: Date;
    classification: 'TOP SECRET' | 'SECRET' | 'CONFIDENTIAL';
  }
  
  export type SharePlatform = 'facebook' | 'twitter' | 'reddit';
  
  export interface ShareData {
    text: string;
    url: string;
    platform: SharePlatform;
  }