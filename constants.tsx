
import { University, ComplaintType } from './types';

export const UNIVERSITIES: University[] = [
  { id: 'u1', name: 'جامعة العلوم والتكنولوجيا الأردنية', domain: 'just.edu.jo' },
  { id: 'u2', name: 'الجامعة الأردنية', domain: 'ju.edu.jo' },
  { id: 'u3', name: 'جامعة عمان الأهلية', domain: 'amman.edu.jo' },
];

export const JORDAN_CITIES = [
  "عمان", "إربد", "الزرقاء", "المفرق", "عجلون", "جرش", "مادبا", "البلقاء", "الكرك", "الطفيلة", "معان", "العقبة"
];

export const COMPLAINT_TYPES: ComplaintType[] = [
  { id: 'ct1', label: 'سحب عصب (Root Canal)', category: 'Conservative' },
  { id: 'ct2', label: 'حشوات تجميلية', category: 'Conservative' },
  { id: 'ct3', label: 'خلع أسنان', category: 'Surgery' },
  { id: 'ct4', label: 'تنظيف لثة', category: 'Periodontics' },
  { id: 'ct5', label: 'تركيبات (Crowns)', category: 'Prosthodontics' },
  { id: 'ct6', label: 'زراعة أسنان', category: 'Implants' },
];

export const MEDICAL_DISCLAIMER_TEXT = `إخلاء مسؤولية طبية: منصة أسناني JO هي منصة تعليمية غير ربحية. جميع الإجراءات تتم تحت إشراف أكاديمي. 
1. العلاج بواسطة طلاب متدربين. 
2. الحالات تخضع للموافقة الأكاديمية. 
3. المنصة لا تتحمل المسؤولية القانونية عن النتائج. 
4. الحالات الطارئة تتوجه للمستشفيات فوراً.`;
