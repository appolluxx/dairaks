
export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  RECYCLE = 'RECYCLE',
  REPORT = 'REPORT',
  COMMUTE = 'COMMUTE',
  LEADERBOARD = 'LEADERBOARD',
  COMMUNITY = 'COMMUNITY',
  REWARDS = 'REWARDS',
  PROFILE = 'PROFILE',
}

export enum WasteType {
  PLASTIC = 'Plastic',
  PAPER = 'Paper',
  GLASS = 'Glass',
  METAL = 'Metal',
  ORGANIC = 'Organic',
  ELECTRONIC = 'Electronic',
  OTHER = 'Other',
}

export interface UserStats {
  ecoPoints: number;
  level: number;
  nextLevelPoints: number;
  recycleCount: number;
  reportsFiled: number;
  commuteTrips: number;
}

export interface SchoolStats {
  wasteRecycledKg: number;
  co2SavedKg: number;
  activeStudents: number;
}

export interface ActivityLog {
  id: string;
  type: 'Recycle' | 'Report' | 'Commute' | 'Community';
  points: number;
  timestamp: Date;
  details: string;
}

export interface GeoLocation {
  lat: number;
  lng: number;
}

export type Language = 'TH' | 'EN';
