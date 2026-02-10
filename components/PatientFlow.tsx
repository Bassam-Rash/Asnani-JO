
import React, { useState } from 'react';
import { COMPLAINT_TYPES, UNIVERSITIES } from '../constants';
import { Case } from '../types';

interface PatientFlowProps {
  onAddCase?: (newCase: Partial<Case>) => void;
  onBackToDashboard: () => void;
}

const PatientFlow: React.FC<PatientFlowProps> = ({ onAddCase, onBackToDashboard }) => {
  const [step, setStep] = useState(1);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    selectedComplaints: [] as string[],
    description: '',
    uniId: '',
    phone: '',
    painLevel: 'متوسط',
    preferredTime: 'جميع الأوقات'
  });

  const toggleComplaint = (id: string) => {
    setFormData(prev => ({
      ...prev,
      selectedComplaints: prev.selectedComplaints.includes(id) 
        ? prev.selectedComplaints.filter(x => x !== id)
        : [...prev.selectedComplaints, id]
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImages = filesArray.map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (onAddCase) {
      onAddCase({
        complaintTypes: formData.selectedComplaints,
        description: formData.description,
        universityId: formData.uniId,
        imageUrls: images
      });
    }
    setStep(2);
  };

  if (step === 2) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <div className="max-w-xl w-full bg-white p-12 rounded-[40px] shadow-2xl text-center border border-emerald-50 animate-in zoom-in duration-300">
          <div className="w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 text-5xl shadow-lg shadow-emerald-100">
            ✓
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">تم استلام طلبك!</h2>
          <p className="text-slate-500 leading-relaxed mb-10 font-bold text-sm">
            تم توجيه حالتك لطلاب السنة السريرية في <strong>{UNIVERSITIES.find(u => u.id === formData.uniId)?.name || 'الجامعة المختارة'}</strong>. 
            سيتم التواصل معك فور مراجعة الحالة عبر الواتساب.
          </p>
          <button 
            onClick={onBackToDashboard}
            className="w-full py-5 bg-[#1e293b] text-white rounded-2xl font-black hover:bg-slate-900 transition-all shadow-xl"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-10 duration-500 pb-20">
      <div className="text-center">
        <h2 className="text-3xl font-black text-indigo-950 mb-2">نشر حالة علاجية جديدة</h2>
        <p className="text-slate-400 font-bold italic">العلاج مجاني بالكامل ويتم تحت إشراف أكاديمي متخصص</p>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-sm border border-slate-100 space-y-10">
        <section>
          <label className="block font-black text-slate-800 mb-6 text-xl flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">1</span>
            ما الذي تعاني منه؟ (يمكنك اختيار أكثر من واحد)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {COMPLAINT_TYPES.map(type => (
              <button
                key={type.id}
                onClick={() => toggleComplaint(type.id)}
                className={`p-5 rounded-3xl border-2 transition-all text-center flex flex-col items-center gap-3 ${
                  formData.selectedComplaints.includes(type.id) 
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-950 shadow-md scale-105' 
                    : 'border-slate-50 hover:border-indigo-200 text-slate-400 bg-slate-50/50'
                }`}
              >
                <span className="text-3xl">🦷</span>
                <span className="text-xs font-black leading-tight">{type.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <label className="block font-black text-slate-800 mb-4 text-xl flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">2</span>
            صور الأسنان أو الأشعة (اختياري)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((src, idx) => (
              <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200">
                <img src={src} className="w-full h-full object-cover" alt="Dental view" />
                <button 
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full text-xs font-bold"
                >✕</button>
              </div>
            ))}
            <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors">
              <span className="text-3xl mb-1">📸</span>
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <label className="block font-black text-slate-800 mb-4 text-lg">مستوى الألم</label>
            <div className="flex gap-2">
              {['منخفض', 'متوسط', 'شديد'].map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setFormData({...formData, painLevel: lvl})}
                  className={`flex-1 py-3 rounded-2xl font-bold transition-all ${
                    formData.painLevel === lvl ? 'bg-red-500 text-white shadow-lg' : 'bg-slate-50 text-slate-400'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block font-black text-slate-800 mb-4 text-lg">الوقت المفضل للمواعيد</label>
            <select 
              value={formData.preferredTime}
              onChange={(e) => setFormData({...formData, preferredTime: e.target.value})}
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-600 outline-none"
            >
              <option>الفترة الصباحية</option>
              <option>الفترة المسائية</option>
              <option>جميع الأوقات</option>
            </select>
          </div>
        </section>

        <section>
          <label className="block font-black text-slate-800 mb-4 text-lg">اشرح لنا حالتك بالتفصيل</label>
          <textarea 
            className="w-full p-6 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none h-32 transition-all font-bold"
            placeholder="أدخل الوصف..."
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </section>

        <section>
          <label className="block font-black text-slate-800 mb-4 text-lg">المركز الجامعي الأقرب إليك</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {UNIVERSITIES.map(uni => (
              <button
                key={uni.id}
                onClick={() => setFormData({...formData, uniId: uni.id})}
                className={`p-4 rounded-2xl border-2 text-right transition-all ${
                  formData.uniId === uni.id ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100 hover:bg-slate-50'
                }`}
              >
                <p className="font-black text-sm text-indigo-950">{uni.name}</p>
              </button>
            ))}
          </div>
        </section>

        <button 
          onClick={handleSubmit}
          disabled={formData.selectedComplaints.length === 0 || !formData.uniId || !formData.description.trim()}
          className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-3xl font-black shadow-2xl shadow-indigo-200 transition-all disabled:opacity-30"
        >
          نشر الحالة وطلب العلاج
        </button>
      </div>
    </div>
  );
};

export default PatientFlow;
