
import { User, UserRole, Case, CaseStatus, StudentRequirement } from '../types';

export const mockCurrentUser: User = {
  id: 's1',
  name: 'أحمد محمود',
  email: 'ahmad@just.edu.jo',
  role: UserRole.STUDENT,
  universityId: 'u1',
  disclaimerAccepted: false,
};

export const mockRequirements: StudentRequirement[] = [
  { typeId: 'ct1', targetCount: 10, completedCount: 4 },
  { typeId: 'ct2', targetCount: 15, completedCount: 12 },
  { typeId: 'ct3', targetCount: 5, completedCount: 2 },
];

export const initialCases: Case[] = [
  {
    id: 'c1',
    patientId: 'p1',
    patientName: 'سارة خالد',
    phone: '079XXXXXXX',
    complaintTypes: ['ct1'],
    description: 'ألم شديد في الضرس العلوي عند شرب البارد',
    universityId: 'u1',
    status: CaseStatus.OPEN,
    createdAt: '2023-10-01',
  },
  {
    id: 'c2',
    patientId: 'p2',
    patientName: 'محمد علي',
    phone: '077XXXXXXX',
    complaintTypes: ['ct3', 'ct4'],
    description: 'خلع ضرس عقل وتنظيف لثة شامل',
    universityId: 'u1',
    status: CaseStatus.CLAIMED,
    claimedBy: 's1',
    createdAt: '2023-10-02',
  }
];
