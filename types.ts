
export enum UserRole {
  PATIENT = 'PATIENT',
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN'
}

export enum CaseStatus {
  OPEN = 'OPEN',
  CLAIMED = 'CLAIMED',
  COMPLETED = 'COMPLETED',
  VERIFIED = 'VERIFIED'
}

export interface Appointment {
  id: string;
  date: string;
  time: string;
  studentName: string;
  location: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
}

export interface University {
  id: string;
  name: string;
  domain: string;
}

export interface ComplaintType {
  id: string;
  label: string;
  category: string;
}

export interface StudentRequirement {
  typeId: string;
  targetCount: number;
  completedCount: number;
}

export interface PatientRating {
  stars: number;
  comment: string;
  criteria: {
    punctuality: number;
    cleanliness: number;
    communication: number;
    treatmentQuality: number;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  universityId?: string;
  disclaimerAccepted: boolean;
  avatar?: string;
}

export interface Case {
  id: string;
  patientId: string;
  patientName: string;
  phone: string;
  complaintTypes: string[];
  description: string;
  universityId: string;
  status: CaseStatus;
  claimedBy?: string;
  claimedAt?: string; 
  createdAt: string;
  rating?: PatientRating;
  imageUrls?: string[];
  appointments?: Appointment[]; // قائمة المواعيد المقترحة لهذه الحالة
}
