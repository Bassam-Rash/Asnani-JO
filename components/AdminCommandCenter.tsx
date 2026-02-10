
import React, { useState } from 'react';
import { UNIVERSITIES, COMPLAINT_TYPES } from '../constants';

const AdminCommandCenter: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState('universities');

  return (
    <div className="space-y-8 font-['Cairo']">
      <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit">
        <TabBtn active={activeSubTab === 'universities'} onClick={() => setActiveSubTab('universities')} label="الجامعات والنطاقات" />
        <TabBtn active={activeSubTab === 'complaints'} onClick={() => setActiveSubTab('complaints')} label="أنواع الحالات" />
        <TabBtn active={activeSubTab === 'monitoring'} onClick={() => setActiveSubTab('monitoring')} label="مراقبة الأداء" />
      </div>

      {activeSubTab === 'universities' && (
        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-300">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
              <h3 className="text-xl font-black text-slate-800">إدارة نطاقات الجامعات (Smart Domain Mapping)</h3>
              <p className="text-slate-400 text-sm mt-1">يتحكم هذا الجدول في عملية التسجيل التلقائي للطلاب</p>
            </div>
            <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-black text-sm shadow-lg shadow-indigo-100">+ إضافة جامعة جديدة</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="text-slate-400 text-sm border-b border-slate-50">
                  <th className="px-8 py-5 font-bold">اسم المؤسسة التعليمية</th>
                  <th className="px-8 py-5 font-bold">النطاق المعتمد (Domain)</th>
                  <th className="px-8 py-5 font-bold text-center">عدد الطلاب</th>
                  <th className="px-8 py-5 font-bold">الحالة</th>
                  <th className="px-8 py-5 font-bold text-left">التحكم</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {UNIVERSITIES.map(uni => (
                  <tr key={uni.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5 font-black text-slate-800">{uni.name}</td>
                    <td className="px-8 py-5">
                      <code className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg font-mono font-bold" dir="ltr">@{uni.domain}</code>
                    </td>
                    <td className="px-8 py-5 text-center font-bold text-slate-500">120</td>
                    <td className="px-8 py-5">
                      <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">نشط</span>
                    </td>
                    <td className="px-8 py-5 text-left">
                      <button className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg transition-colors">📝</button>
                      <button className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section> section>
      )}

      {activeSubTab === 'monitoring' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
             <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl font-black text-slate-800">طلاب في حالة خطر (At Risk)</h3>
               <span className="bg-red-100 text-red-600 px-4 py-1 rounded-full text-xs font-black">تحتاج تدخل</span>
             </div>
             <div className="space-y-6">
               <StudentProgressRow name="زيد عمر" progress={12} uni="جامعة العلوم والتكنولوجيا" />
               <StudentProgressRow name="مريم خليل" progress={18} uni="الجامعة الأردنية" />
               <StudentProgressRow name="ياسين محمود" progress={22} uni="جامعة العلوم والتكنولوجيا" />
             </div>
          </div>
          
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
             <h3 className="text-xl font-black text-slate-800 mb-8">أحدث تقييمات الجودة</h3>
             <div className="space-y-6">
               {[1, 2, 3].map(i => (
                 <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                   <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">👤</div>
                   <div className="flex-1">
                     <div className="flex justify-between">
                       <span className="font-black text-slate-700">مريض مجهول</span>
                       <span className="text-amber-500 font-bold">⭐⭐⭐⭐⭐</span>
                     </div>
                     <p className="text-xs text-slate-400 mt-1 line-clamp-1 italic">"الطالب كان محترفاً جداً والعيادة نظيفة..."</p>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TabBtn = ({ active, onClick, label }: any) => (
  <button 
    onClick={onClick}
    className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${active ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
  >
    {label}
  </button>
);

const StudentProgressRow = ({ name, progress, uni }: any) => (
  <div className="space-y-2">
    <div className="flex justify-between text-sm">
      <span className="font-black text-slate-700">{name} <span className="text-xs text-slate-400 font-medium">({uni})</span></span>
      <span className="font-bold text-red-600">{progress}%</span>
    </div>
    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
      <div className="bg-red-500 h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
    </div>
  </div>
);

export default AdminCommandCenter;
