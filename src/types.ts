/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// User Type Definition
export type UserRole = "GUARDIAN" | "PATIENT";

export interface GuardianInfo {
  name: string;
  relationship: string;
  phone: string;
}

export interface PatientInfo {
  name: string;
  birthdate: string;
  gender: string;
  address: string;
  diseaseNotes: string;
}

export interface SafeZone {
  address: string;
  radius: number; // in meters (300, 500, 1000)
  frequentPlaces: string[];
}

export interface Medication {
  id: string;
  name: string;
  time: string;
  frequency: number;
  memo: string;
  takenToday?: boolean;
}

export interface FamilyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  photoUrl?: string;
}

export interface MemoryCard {
  id: string;
  relation: string;
  personName: string;
  context: string;
  imageUrl: string;
  speechText?: string;
  promptTips?: string;
}

export interface CareChecklist {
  id: string;
  title: string;
  time: string;
  completed: boolean;
}

export interface HospitalSchedule {
  id: string;
  hospitalName: string;
  date: string;
  time: string;
  doctorName: string;
  memo: string;
}

export interface CognitiveRecord {
  date: string;
  score: number; // 0-100
  type: string; // e.g., "단어 연상", "도형 맞추기"
}

// Auth State Type
export type AppScreen = 
  | "SPLASH"
  | "START"
  | "LOGIN"
  | "SIGNUP"
  | "FORGOT_PASSWORD"
  | "MAIN_APP";
