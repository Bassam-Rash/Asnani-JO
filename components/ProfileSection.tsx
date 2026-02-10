
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { UNIVERSITIES, JORDAN_CITIES } from '../constants';

interface ProfileSectionProps {
  user: User;
  onUpdate: (updatedUser: User) => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    universityId: user.universityId || '',
    city: 'عمان', // Initial value for demo
    phone: '07XXXXXXXX' // Initial value for demo
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      ...user,
      name: formData.name,
      universityId: formData.universityId
    });
    setIsEditing(false);
    alert('تم تحديث الملف الشخصي بنجاح');
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
        {/* Profile Header */}
        <div className="h-32 bg-indigo-600 relative">
          <div className="absolute -bottom-16 right-10 flex items-end gap-6">
            <div className="w-32 h-32 rounded-[32px] bg-white p-2 shadow-xl">
              <div className="w-full h-full rounded-[24px] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl font-black text-white">
                {user.name.charAt(0)}
              </div>
            </div>
            <div className="mb-4">
              <h2 className="text-3xl font-black text-white drop-shadow-sm">{user.name}</h2>
              <span className="bg-white/20 backdrop-blur-md text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-24 p-10">
          <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-50">
            <div>
              <h3 className="text-xl font-black text-slate-800">المعلومات الشخصية</h3>
              <p className="text-slate-400 text-sm">أدر بياناتك الشخصية وإعدادات الحساب</p>
            </div>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={`px-6 py-2 rounded-xl font-black text-sm transition-all ${
                isEditing ? 'bg-slate-100 text-slate-600' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
              }`}
            >
              {isEditing ? 'إلغاء التعديل' : 'تعديل البيانات'}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase mb-2 tracking-wider">الاسم الكامل</label>
                <input 
                  type="text" 
                  disabled={!isEditing}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-600 disabled:bg-slate-50 disabled:text-slate-400 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase mb-2 tracking-wider">البريد الإلكتروني</label>
                <input 
                  type="email" 
                  disabled
                  value={formData.email}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-slate-400 cursor-not-allowed font-mono text-left" 
                  dir="ltr"
                />
              </div>

              {user.role === UserRole.PATIENT && (
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase mb-2 tracking-wider">رقم الهاتف</label>
                  <input 
                    type="tel" 
                    disabled={!isEditing}
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-600 disabled:text-slate-400 font-bold"
                  />
                </div>
              )}
            </div>

            <div className="space-y-6">
              {user.role === UserRole.STUDENT ? (
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase mb-2 tracking-wider">الجامعة</label>
                  <select 
                    disabled={!isEditing}
                    value={formData.universityId}
                    onChange={(e) => setFormData({...formData, universityId: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-600 disabled:text-slate-400 font-bold"
                  >
                    <option value="">اختر الجامعة</option>
                    {UNIVERSITIES.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>
              ) : user.role === UserRole.PATIENT ? (
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase mb-2 tracking-wider">المدينة</label>
                  <select 
                    disabled={!isEditing}
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-600 disabled:text-slate-400 font-bold"
                  >
                    {JORDAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              ) : null}

              <div className="p-6 bg-indigo-50 rounded-[32px] border border-indigo-100 mt-6">
                <h4 className="text-sm font-black text-indigo-950 mb-2">إخلاء المسؤولية</h4>
                <p className="text-xs text-indigo-600 leading-relaxed font-bold">
                  لقد وافقت على بنود المسؤولية الطبية بتاريخ التسجيل. لا يمكن التراجع عن الموافقة لضمان قانونية الإجراءات السريرية.
                </p>
              </div>
            </div>

            {isEditing && (
              <div className="md:col-span-2 pt-6">
                <button 
                  type="submit"
                  className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3"
                >
                  حفظ التعديلات
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
