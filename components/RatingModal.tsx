
import React, { useState } from 'react';
import { PatientRating } from '../types';

interface RatingModalProps {
  caseId: string;
  onSubmit: (rating: PatientRating) => void;
  onClose: () => void;
}

const RatingModal: React.FC<RatingModalProps> = ({ caseId, onSubmit, onClose }) => {
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState('');
  const [criteria, setCriteria] = useState({
    punctuality: 5,
    cleanliness: 5,
    communication: 5,
    treatmentQuality: 5
  });

  const handleCriteriaChange = (key: keyof typeof criteria, val: number) => {
    setCriteria(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-indigo-900/40 backdrop-blur-md p-4" dir="rtl">
      <div className="bg-white rounded-[40px] p-10 max-w-xl w-full shadow-2xl border border-indigo-100 animate-in slide-in-from-top-10 duration-300">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🌟</div>
          <h2 className="text-2xl font-black text-slate-800">كيف كانت تجربتك العلاجية؟</h2>
          <p className="text-slate-400 font-medium">تقييمك يساعد الطالب على التحسن ويضمن جودة الخدمة</p>
        </div>

        <div className="space-y-6">
          <CriterionRow label="الدقة في المواعيد" value={criteria.punctuality} onChange={(v) => handleCriteriaChange('punctuality', v)} />
          <CriterionRow label="النظافة والتعقيم" value={criteria.cleanliness} onChange={(v) => handleCriteriaChange('cleanliness', v)} />
          <CriterionRow label="مهارات التواصل" value={criteria.communication} onChange={(v) => handleCriteriaChange('communication', v)} />
          <CriterionRow label="جودة العلاج النهائي" value={criteria.treatmentQuality} onChange={(v) => handleCriteriaChange('treatmentQuality', v)} />

          <div className="pt-4">
            <label className="block text-sm font-black text-slate-600 mb-2">ملاحظات إضافية (اختياري)</label>
            <textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-indigo-500 outline-none h-24"
              placeholder="اكتب تجربتك هنا..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <button onClick={onClose} className="py-4 font-bold text-slate-400">تخطي الآن</button>
            <button 
              onClick={() => onSubmit({ stars, comment, criteria })}
              className="py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
            >
              إرسال التقييم
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CriterionRow = ({ label, value, onChange }: { label: string, value: number, onChange: (v: number) => void }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm font-bold text-slate-600">{label}</span>
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map(star => (
        <button 
          key={star} 
          onClick={() => onChange(star)}
          className={`text-xl transition-all ${star <= value ? 'grayscale-0 scale-110' : 'grayscale opacity-30 scale-100'}`}
        >
          {star <= value ? '⭐' : '☆'}
        </button>
      ))}
    </div>
  </div>
);

export default RatingModal;
