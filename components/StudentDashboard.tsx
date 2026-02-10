
import React, { useState } from 'react';
import { StudentRequirement, Case, CaseStatus } from '../types';
import { COMPLAINT_TYPES, UNIVERSITIES } from '../constants';
import ProgressCircle from './ProgressCircle';

interface StudentDashboardProps {
  requirements: StudentRequirement[];
  setRequirements: React.Dispatch<React.SetStateAction<StudentRequirement[]>>;
  onAddExternalPatient: (newCase: Partial<Case>) => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ requirements, setRequirements, onAddExternalPatient }) => {
  const [isEditingGoals, setIsEditingGoals] = useState(false);
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [showExternalPatientModal, setShowExternalPatientModal] = useState(false);
  
  const [newGoal, setNewGoal] = useState({ typeId: '', target: 5 });
  const [goalError, setGoalError] = useState<string | null>(null);

  // الحالة الكاملة للمريض الخارجي
  const [externalPatientData, setExternalPatientData] = useState({
    patientName: '',
    phone: '',
    selectedComplaints: [] as string[],
    description: '',
    uniId: '',
    painLevel: 'متوسط',
    preferredTime: 'جميع الأوقات'
  });
  const [images, setImages] = useState<string[]>([]);

  const totalCompleted = requirements.reduce((acc, curr) => acc + curr.completedCount, 0);
  const totalTarget = requirements.reduce((acc, curr) => acc + curr.targetCount, 0);
  const overallProgress = totalTarget > 0 ? (totalCompleted / totalTarget) * 100 : 0;

  // دالة لتعديل الهدف لمتطلب معين
  const handleUpdateTarget = (typeId: string, newTarget: number) => {
    setRequirements(prev => prev.map(req => 
      req.typeId === typeId ? { ...req, targetCount: Math.max(1, newTarget) } : req
    ));
  };

  // دالة لحذف متطلب
  const handleDeleteRequirement = (typeId: string) => {
    if(window.confirm('هل أنت متأكد من رغبتك في حذف هذا الهدف الجامعي؟')) {
      setRequirements(prev => prev.filter(req => req.typeId !== typeId));
    }
  };

  const toggleComplaint = (id: string) => {
    setExternalPatientData(prev => ({
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

  const handleAddExternalSubmit = () => {
    onAddExternalPatient({
      patientName: externalPatientData.patientName,
      phone: externalPatientData.phone,
      complaintTypes: externalPatientData.selectedComplaints,
      description: externalPatientData.description,
      universityId: externalPatientData.uniId,
      imageUrls: images,
      status: CaseStatus.CLAIMED 
    });
    setShowExternalPatientModal(false);
    setExternalPatientData({ patientName: '', phone: '', selectedComplaints: [], description: '', uniId: '', painLevel: 'متوسط', preferredTime: 'جميع الأوقات' });
    setImages([]);
    window.alert('تمت إضافة المريض وحجز الحالة في سجلاتك بنجاح');
  };

  const addNewRequirement = () => {
    if (!newGoal.typeId) {
      setGoalError('يرجى اختيار نوع الشكوى');
      return;
    }
    
    if (requirements.some(req => req.typeId === newGoal.typeId)) {
      setGoalError('هذا المتطلب موجود مسبقاً');
      return;
    }

    const requirement: StudentRequirement = {
      typeId: newGoal.typeId,
      targetCount: newGoal.target,
      completedCount: 0
    };

    setRequirements(prev => [...prev, requirement]);
    setShowAddGoalModal(false);
    setNewGoal({ typeId: '', target: 5 });
    setGoalError(null);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-slate-800">لوحة التحكم السريرية</h2>
        <button 
          onClick={() => setShowExternalPatientModal(true)}
          className="px-8 py-4 bg-[#0ea5e9] text-white rounded-[24px] font-black text-sm shadow-xl shadow-sky-100 hover:scale-105 transition-all"
        >
          + إضافة مريض خارجي
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#0ea5e9] p-8 rounded-[40px] text-white shadow-xl shadow-sky-100 relative overflow-hidden h-44 flex flex-col justify-center">
          <div className="relative z-10">
            <div className="text-sky-100 text-sm font-bold mb-1">نسبة الإنجاز</div>
            <div className="text-5xl font-black">{Math.round(overallProgress)}%</div>
          </div>
          <div className="absolute -left-4 -bottom-4 text-9xl opacity-10">🦷</div>
        </div>
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 h-44 flex flex-col justify-center">
          <div className="text-slate-400 text-sm font-bold mb-1">الحالات المنجزة</div>
          <div className="text-4xl font-black text-slate-800">{totalCompleted}</div>
        </div>
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 h-44 flex flex-col justify-center">
          <div className="text-slate-400 text-sm font-bold mb-1">الحالات المتبقية</div>
          <div className="text-4xl font-black text-orange-500">{Math.max(0, totalTarget - totalCompleted)}</div>
        </div>
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 h-44 flex flex-col justify-center">
          <div className="text-slate-400 text-sm font-bold mb-1">تقييم المرضى</div>
          <div className="text-4xl font-black text-amber-500">4.8 ⭐</div>
        </div>
      </div>

      <section className="bg-white p-10 rounded-[50px] border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="text-right">
            <h2 className="text-4xl font-black text-slate-800 tracking-tight">أهدافي الجامعية</h2>
            <p className="text-slate-400 font-bold mt-1">تتبع متطلبات التخرج السريرية الخاصة بك</p>
          </div>
          <div className="flex gap-3">
            <button 
               onClick={() => setShowAddGoalModal(true)} 
               className="px-8 py-3 bg-sky-50 text-sky-600 rounded-2xl font-black text-sm hover:bg-sky-100 transition-all"
            >
              إضافة هدف
            </button>
            <button 
              onClick={() => setIsEditingGoals(!isEditingGoals)} 
              className={`px-8 py-3 rounded-2xl font-black text-sm transition-all shadow-lg ${
                isEditingGoals ? 'bg-sky-600 text-white' : 'bg-[#0ea5e9] text-white'
              }`}
            >
              {isEditingGoals ? 'حفظ' : 'تعديل الأهداف'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {requirements.map((req) => {
            const type = COMPLAINT_TYPES.find(t => t.id === req.typeId);
            const percentage = (req.completedCount / req.targetCount) * 100;
            return (
              <div key={req.typeId} className="group relative bg-[#fcfdfe] p-10 rounded-[48px] border border-slate-50 hover:border-sky-100 hover:bg-white transition-all shadow-sm">
                {isEditingGoals && (
                  <button 
                    onClick={() => handleDeleteRequirement(req.typeId)}
                    className="absolute top-6 left-6 w-8 h-8 flex items-center justify-center bg-red-50 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all z-20 shadow-sm"
                  >
                    ✕
                  </button>
                )}
                
                <div className="flex justify-between items-center mb-10">
                   <ProgressCircle percentage={percentage} size={85} strokeWidth={8} />
                   <div className="text-right flex flex-col items-end">
                      <h3 className="text-xl font-black text-slate-800 mb-2">{type?.label}</h3>
                      <span className="text-[10px] bg-slate-100 text-slate-400 px-4 py-1.5 rounded-xl font-black tracking-widest uppercase">
                        {type?.category}
                      </span>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-50">
                  <div className="text-center">
                    <p className="text-xs font-black text-slate-300 mb-2">الهدف</p>
                    {isEditingGoals ? (
                      <input 
                        type="number"
                        min="1"
                        value={req.targetCount}
                        onChange={(e) => handleUpdateTarget(req.typeId, parseInt(e.target.value) || 1)}
                        className="w-full text-center p-2 bg-sky-50 border border-sky-200 rounded-xl font-black text-sky-600 focus:ring-2 focus:ring-sky-500 outline-none"
                      />
                    ) : (
                      <p className="text-2xl font-black text-slate-700">{req.targetCount}</p>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-black text-slate-300 mb-2">المنجز</p>
                    <p className="text-2xl font-black text-[#10b981]">{req.completedCount}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* النافذة الموحدة الاحترافية لإضافة مريض خارجي */}
      {showExternalPatientModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
          <div className="bg-white rounded-[60px] max-w-4xl w-full max-h-[90vh] shadow-2xl relative animate-in slide-in-from-bottom-12 duration-500 overflow-hidden flex flex-col">
            
            <div className="p-8 pb-4 border-b border-slate-50 flex justify-between items-center shrink-0">
               <button onClick={() => setShowExternalPatientModal(false)} className="text-slate-300 hover:text-red-500 text-3xl transition-all">✕</button>
               <div className="text-right">
                 <h2 className="text-3xl font-black text-slate-800 tracking-tight">نشر حالة مريض خارجي</h2>
                 <p className="text-slate-400 font-bold text-sm mt-3">أدخل بيانات المريض ليتم حجز الحالة وتوثيقها تلقائياً باسمك</p>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12 text-right scrollbar-hide">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block font-black text-slate-500 pr-2 text-xs uppercase tracking-widest">اسم المريض الكامل</label>
                  <input type="text" placeholder="" className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[24px] font-bold outline-none focus:ring-4 focus:ring-sky-50 focus:border-sky-500 text-right" value={externalPatientData.patientName} onChange={e => setExternalPatientData({...externalPatientData, patientName: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="block font-black text-slate-500 pr-2 text-xs uppercase tracking-widest">رقم هاتف المريض</label>
                  <input type="tel" placeholder="" className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[24px] font-bold text-left outline-none focus:ring-4 focus:ring-sky-50 focus:border-sky-500" dir="ltr" value={externalPatientData.phone} onChange={e => setExternalPatientData({...externalPatientData, phone: e.target.value})} />
                </div>
              </div>

              <section>
                <label className="block font-black text-slate-800 mb-6 text-xl flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-xs font-black">1</span>
                  ما هي طبيعة الشكوى؟
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                  {COMPLAINT_TYPES.map(type => (
                    <button key={type.id} onClick={() => toggleComplaint(type.id)} className={`p-6 rounded-[28px] border-2 transition-all flex flex-col items-center gap-3 ${externalPatientData.selectedComplaints.includes(type.id) ? 'border-[#0ea5e9] bg-sky-50 shadow-lg scale-105' : 'border-slate-50 bg-slate-50/50 grayscale opacity-40 hover:opacity-100'}`}>
                      <span className="text-3xl">🦷</span>
                      <span className="text-[11px] font-black leading-tight text-center text-slate-800">{type.label}</span>
                    </button>
                  ))}
                </div>
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <section>
                  <label className="block font-black text-slate-800 mb-6 text-xl flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-xs font-black">2</span>
                    صور الأشعة
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {images.map((src, idx) => (
                      <div key={idx} className="relative aspect-square rounded-[20px] overflow-hidden border-2 border-slate-100 group">
                        <img src={src} className="w-full h-full object-cover" />
                        <button onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full text-xs shadow-lg flex items-center justify-center">✕</button>
                      </div>
                    ))}
                    <label className="aspect-square rounded-[20px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 hover:bg-slate-100 transition-colors">
                      <span className="text-3xl">📸</span>
                      <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                  </div>
                </section>

                <div className="space-y-10">
                  <div>
                    <label className="block font-black text-slate-800 mb-4 text-sm pr-2">مستوى الألم</label>
                    <div className="flex gap-2">
                      {['منخفض', 'متوسط', 'شديد'].map(lvl => (
                        <button key={lvl} onClick={() => setExternalPatientData({...externalPatientData, painLevel: lvl})} className={`flex-1 py-4 rounded-[18px] font-black text-sm transition-all ${externalPatientData.painLevel === lvl ? 'bg-[#ef4444] text-white shadow-xl shadow-red-100' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>{lvl}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block font-black text-slate-800 mb-4 text-sm pr-2">التوقيت المفضل</label>
                    <div className="flex gap-2">
                      {['الفترة الصباحية', 'الفترة المسائية', 'جميع الأوقات'].map(time => (
                        <button key={time} onClick={() => setExternalPatientData({...externalPatientData, preferredTime: time})} className={`flex-1 py-4 rounded-[18px] font-black text-[10px] transition-all ${externalPatientData.preferredTime === time ? 'bg-[#0ea5e9] text-white' : 'bg-slate-50 text-slate-400'}`}>{time}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <section>
                <label className="block font-black text-slate-800 mb-6 text-xl flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-xs font-black">3</span>
                  المركز الجامعي المعتمد
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {UNIVERSITIES.map(uni => (
                    <button key={uni.id} onClick={() => setExternalPatientData({...externalPatientData, uniId: uni.id})} className={`p-6 rounded-[28px] border-2 text-right transition-all flex items-center justify-between ${externalPatientData.uniId === uni.id ? 'border-[#0ea5e9] bg-sky-50 shadow-md' : 'border-slate-100 hover:bg-slate-50'}`}>
                      <div className="flex flex-col">
                        <span className="font-black text-[13px] text-slate-800 leading-tight">{uni.name}</span>
                        <span className="text-[10px] text-slate-400 font-bold mt-1">عيادات كليات الأسنان</span>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-4 flex items-center justify-center ${externalPatientData.uniId === uni.id ? 'border-[#0ea5e9] bg-white' : 'border-slate-200'}`}>
                         {externalPatientData.uniId === uni.id && <div className="w-2 h-2 bg-[#0ea5e9] rounded-full" />}
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <label className="block font-black text-slate-800 mb-4 text-lg pr-2">تفاصيل إضافية عن الحالة</label>
                <textarea className="w-full p-8 bg-slate-50 border border-slate-100 rounded-[32px] h-40 font-bold outline-none focus:ring-4 focus:ring-sky-50 text-right" placeholder="ألم في السن..." value={externalPatientData.description} onChange={(e) => setExternalPatientData({...externalPatientData, description: e.target.value})} />
              </section>
            </div>

            <div className="p-10 bg-white border-t border-slate-50 shrink-0 flex flex-row-reverse items-center justify-between gap-6">
              <button 
                onClick={handleAddExternalSubmit} 
                disabled={!externalPatientData.patientName || !externalPatientData.phone || externalPatientData.selectedComplaints.length === 0 || !externalPatientData.uniId} 
                className="flex-1 py-5 bg-[#0ea5e9] text-white rounded-[28px] font-black text-xl shadow-2xl shadow-sky-100 hover:scale-[1.02] transition-all disabled:opacity-20 disabled:scale-100"
              >
                حفظ ونشر الحالة
              </button>
              <button 
                onClick={() => setShowExternalPatientModal(false)} 
                className="flex-1 py-5 bg-white border-2 border-slate-300 text-slate-400 rounded-[28px] font-black text-xl hover:bg-slate-50 transition-colors"
              >
                إلغاء العملية
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddGoalModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
          <div className="bg-white rounded-[60px] p-12 max-w-lg w-full shadow-2xl animate-in zoom-in">
            <h2 className="text-3xl font-black mb-10 text-slate-800 text-center tracking-tight">إضافة متطلب أكاديمي</h2>
            <div className="space-y-6 text-right">
              <select className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[24px] font-bold outline-none" value={newGoal.typeId} onChange={(e) => { setNewGoal({...newGoal, typeId: e.target.value}); setGoalError(null); }}>
                <option value="">اختر النوع...</option>
                {COMPLAINT_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
              <input type="number" className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[24px] font-bold" value={newGoal.target} onChange={(e) => setNewGoal({...newGoal, target: parseInt(e.target.value) || 0})} />
              {goalError && <p className="text-red-500 text-center font-black text-xs">{goalError}</p>}
              <div className="flex flex-row-reverse gap-4 pt-4">
                <button onClick={addNewRequirement} className="flex-1 py-4 bg-sky-500 text-white rounded-[24px] font-black">إضافة</button>
                <button onClick={() => setShowAddGoalModal(false)} className="flex-1 py-4 text-slate-400 font-black">إلغاء</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
