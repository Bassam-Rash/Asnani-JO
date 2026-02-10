
import React from 'react';
import { Case, CaseStatus } from '../types';
import { UNIVERSITIES, COMPLAINT_TYPES } from '../constants';

interface PatientDashboardProps {
  myCases: Case[];
}

const PatientDashboard: React.FC<PatientDashboardProps> = ({ myCases }) => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-black text-slate-800 hidden md:block">لوحة التحكم</h2>
      
      {/* ملخص إحصائي سريع - مطابق للصورة */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-8 rounded-[40px] text-white shadow-xl shadow-indigo-100 relative overflow-hidden h-40 flex flex-col justify-center">
          <div className="relative z-10">
            <div className="text-indigo-100 text-sm font-bold mb-1">إجمالي الحالات المنشورة</div>
            <div className="text-5xl font-black">{myCases.length}</div>
          </div>
          <div className="absolute -left-4 -bottom-4 text-8xl opacity-10">📑</div>
          <div className="absolute top-4 left-4 bg-white/20 p-2 rounded-xl backdrop-blur-sm">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 h-40 flex flex-col justify-center">
          <div className="text-slate-400 text-sm font-bold mb-1">حالات بانتظار طالب</div>
          <div className="text-4xl font-black text-slate-800">
            {myCases.filter(c => c.status === CaseStatus.OPEN).length}
          </div>
          <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
             <div className="h-full bg-orange-400 rounded-full" style={{width: '30%'}}></div>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 h-40 flex flex-col justify-center">
          <div className="text-slate-400 text-sm font-bold mb-1">حالات قيد المتابعة</div>
          <div className="text-4xl font-black text-slate-800">
            {myCases.filter(c => c.status === CaseStatus.CLAIMED).length}
          </div>
          <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
             <div className="h-full bg-emerald-400 rounded-full" style={{width: '0%'}}></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* قائمة الحالات - مطابق للصورة */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            🦷 حالاتي الطبية
          </h2>
          {myCases.length === 0 ? (
            <div className="bg-white p-20 rounded-[40px] text-center border-2 border-dashed border-slate-100">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-slate-400 font-black text-lg">لم تقم بنشر أي حالة بعد.</p>
              <p className="text-slate-300 font-bold mt-2">انتقل لتبويب "تقديم حالة جديدة" للبدء.</p>
            </div>
          ) : (
            myCases.map(c => (
              <div key={c.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-md transition-all relative">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      c.status === CaseStatus.OPEN ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {c.status === CaseStatus.OPEN ? 'بانتظار طالب' : 'تم حجز الحالة'}
                    </span>
                    <h3 className="text-xl font-black text-slate-800 mt-4 leading-tight">
                      شكوى: {c.complaintTypes.map(id => COMPLAINT_TYPES.find(t => t.id === id)?.label).join('، ')}
                    </h3>
                  </div>
                  <div className="text-left bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400">تاريخ النشر</p>
                    <p className="text-xs font-black text-slate-600">{new Date(c.createdAt).toLocaleDateString('ar-JO')}</p>
                  </div>
                </div>
                
                <div className="bg-slate-50/50 p-6 rounded-3xl text-slate-500 text-sm mb-6 leading-relaxed font-bold border border-slate-50">
                  <span className="block text-xs text-slate-400 mb-2">شرح المريض:</span>
                  {c.description}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-xs">📍</div>
                    <span className="text-xs font-black text-slate-600">
                      مركز: {UNIVERSITIES.find(u => u.id === c.universityId)?.name}
                    </span>
                  </div>
                  {c.status === CaseStatus.CLAIMED && (
                     <span className="text-emerald-500 text-xs font-black">سيتم التواصل معك قريباً ✓</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* المواعيد القادمة - مطابق للصورة */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            📅 مواعيدي المقترحة
          </h2>
          <div className="space-y-4">
            {myCases.flatMap(c => c.appointments || []).length === 0 ? (
              <div className="bg-slate-50 p-10 rounded-[40px] text-center border border-slate-100 border-dashed">
                <div className="text-4xl mb-4 opacity-30">⏳</div>
                <p className="text-slate-400 text-sm font-bold">لا يوجد مواعيد مقترحة حالياً.</p>
              </div>
            ) : (
              myCases.flatMap(c => c.appointments || []).map(app => (
                <div key={app.id} className="bg-white p-6 rounded-[32px] border border-sky-50 shadow-sm border-r-4 border-r-sky-500 animate-in slide-in-from-right-4 duration-300">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-black bg-sky-50 text-sky-600 px-3 py-1 rounded-lg">موعد جديد</span>
                    <span className="text-xs font-bold text-slate-400">{app.time}</span>
                  </div>
                  <p className="font-black text-slate-800 mb-1">{app.date}</p>
                  <p className="text-xs text-slate-500 font-bold mb-4">مع الطالب: {app.studentName}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="py-2.5 bg-emerald-500 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-50 hover:bg-emerald-600 transition-all">تأكيد</button>
                    <button className="py-2.5 bg-slate-50 text-slate-400 rounded-xl text-xs font-black hover:bg-red-50 hover:text-red-500 transition-all">اعتذار</button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="p-8 bg-amber-50/50 rounded-[32px] border border-amber-100">
            <h4 className="text-amber-800 font-black text-sm mb-3 flex items-center gap-2">💡 نصيحة هامة</h4>
            <p className="text-amber-700 text-xs leading-relaxed font-bold">
              يرجى الحضور قبل الموعد بـ 15 دقيقة لإنهاء إجراءات التسجيل في استقبال العيادات الجامعية.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
