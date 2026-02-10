
import React, { useState, useEffect, useMemo } from 'react';
import { User, UserRole, StudentRequirement, Case, CaseStatus, Appointment } from './types';
import { mockCurrentUser, mockRequirements, initialCases } from './services/mockData';
import { UNIVERSITIES, JORDAN_CITIES, COMPLAINT_TYPES } from './constants';
import Layout from './components/Layout';
import DisclaimerModal from './components/DisclaimerModal';
import StudentDashboard from './components/StudentDashboard';
import PatientDashboard from './components/PatientDashboard';
import PatientFlow from './components/PatientFlow';
import AdminCommandCenter from './components/AdminCommandCenter';
import ProfileSection from './components/ProfileSection';
import AboutSection from './components/AboutSection';

// Add missing AuthScreen type definition
type AuthScreen = 'LANDING' | 'PATIENT_LOGIN' | 'PATIENT_SIGNUP' | 'STUDENT_LOGIN' | 'STUDENT_SIGNUP';

const SparkleToothIcon = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 85C55 85 62 78 68 70C75 60 78 45 78 35C78 22 70 15 50 15C30 15 22 22 22 35C22 45 25 60 32 70C38 78 45 85 50 85Z" fill="#e0f2fe" opacity="0.3" />
    <path d="M50 82C54 82 58 78 63 70C68 62 72 50 72 38C72 25 65 18 50 18C35 18 28 25 28 38C28 50 32 62 37 70C42 78 46 82 50 82Z" fill="white" stroke="#0ea5e9" strokeWidth="2.5" />
    <path d="M38 28C42 25 46 25 50 28C54 25 58 25 62 28" stroke="#0ea5e9" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M15 35L18 38L21 35L18 32L15 35Z" fill="white" stroke="#0ea5e9" strokeWidth="1" />
    <path d="M85 25L88 28L91 25L88 22L85 25Z" fill="white" stroke="#0ea5e9" strokeWidth="1" />
    <path d="M80 60L83 65L88 68L83 71L80 76L77 71L72 68L77 65L80 60Z" fill="white" stroke="#0ea5e9" strokeWidth="1" />
  </svg>
);

const ShareIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [requirements, setRequirements] = useState<StudentRequirement[]>(mockRequirements);
  const [cases, setCases] = useState<Case[]>(initialCases);
  const [activeTab, setActiveTab] = useState<string>('');
  const [authScreen, setAuthScreen] = useState<AuthScreen>('LANDING');
  const [showToast, setShowToast] = useState(false);
  const [previewCase, setPreviewCase] = useState<Case | null>(null);

  useEffect(() => {
    if (user) {
      if (user.role === UserRole.STUDENT) setActiveTab('dashboard');
      else if (user.role === UserRole.PATIENT) setActiveTab('patient-dashboard');
      else if (user.role === UserRole.ADMIN) setActiveTab('admin-dashboard');
    } else {
      setActiveTab('');
    }
  }, [user]);

  const handleAuthSubmit = (role: UserRole, data: any) => {
    setUser({
      id: Math.random().toString(36).substr(2, 9),
      name: data.name || (role === UserRole.PATIENT ? 'مريض جديد' : 'طالب جديد'),
      email: data.email || 'user@example.com',
      role: role,
      universityId: data.universityId || 'u1',
      disclaimerAccepted: false
    });
  };

  const addNewCase = (newCase: Partial<Case>) => {
    const freshCase: Case = {
      id: Math.random().toString(36).substr(2, 9),
      patientId: user?.id || 'manual',
      patientName: newCase.patientName || user?.name || 'مريض جديد',
      phone: newCase.phone || '07XXXXXXXX',
      complaintTypes: newCase.complaintTypes || [],
      description: newCase.description || '',
      universityId: newCase.universityId || user?.universityId || 'u1',
      status: newCase.status || CaseStatus.OPEN,
      claimedBy: newCase.status === CaseStatus.CLAIMED ? user?.id : undefined,
      claimedAt: newCase.status === CaseStatus.CLAIMED ? new Date().toISOString() : undefined,
      createdAt: new Date().toISOString(),
      imageUrls: newCase.imageUrls || [],
    };
    setCases(prev => [freshCase, ...prev]);
  };

  const claimCase = (caseId: string) => {
    setCases(prev => prev.map(c => c.id === caseId ? { ...c, status: CaseStatus.CLAIMED, claimedBy: user?.id, claimedAt: new Date().toISOString() } : c));
    setPreviewCase(null);
    setActiveTab('pending-cases');
  };

  const unclaimCase = (caseId: string) => {
    setCases(prev => prev.map(c => c.id === caseId ? { ...c, status: CaseStatus.OPEN, claimedBy: undefined, claimedAt: undefined } : c));
  };

  const handleShare = (c: Case) => {
    const shareText = `حالة علاجية: ${c.description}. المنصة: أسناني JO`;
    navigator.clipboard.writeText(shareText);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white font-['Cairo'] text-right" dir="rtl">
        <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 h-20 border-b border-sky-50 px-6">
          <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setAuthScreen('LANDING'); setActiveTab(''); }}>
              <SparkleToothIcon className="w-10 h-10" />
              <span className="text-2xl font-black text-sky-500 tracking-tight">أسناني JO</span>
            </div>
            <div className="hidden md:flex items-center gap-10 font-bold text-slate-500 text-sm">
               <button 
                 onClick={() => { setAuthScreen('LANDING'); setActiveTab(''); }}
                 className={`${activeTab === '' ? 'text-sky-500' : 'hover:text-sky-500'} transition-colors`}
               >
                 الرئيسية
               </button>
               <button 
                 onClick={() => { setAuthScreen('LANDING'); setActiveTab('about'); }}
                 className={`${activeTab === 'about' ? 'text-sky-500' : 'hover:text-sky-500'} transition-colors`}
               >
                 عن المنصة
               </button>
               <button 
                 onClick={() => setAuthScreen('STUDENT_LOGIN')} 
                 className="bg-sky-500 text-white px-6 py-2.5 rounded-xl font-black text-xs shadow-lg shadow-sky-100 hover:scale-105 transition-all"
               >
                 لوحة التحكم
               </button>
            </div>
          </div>
        </nav>

        {authScreen === 'LANDING' ? (
          <main className="pt-20">
            {activeTab === 'about' ? (
               <div className="pt-10">
                 <AboutSection 
                    onPatientSignup={() => setAuthScreen('PATIENT_SIGNUP')} 
                    onStudentLogin={() => setAuthScreen('STUDENT_LOGIN')} 
                 />
               </div>
            ) : (
              <>
                <section className="hero-gradient pt-24 pb-20 px-6 text-center">
                  <div className="max-w-5xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-sky-50 text-sky-600 rounded-full text-xs font-black mb-8 border border-sky-100">
                      💙 منصة غير ربحية تربط المرضى مع طلاب طب الأسنان
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-[900] text-slate-900 leading-tight mb-8">
                      احصل على علاج أسنان <br/> <span className="text-sky-500">مجاني من طلاب موثقين</span>
                    </h1>
                    <p className="text-xl text-slate-500 font-bold max-w-3xl mx-auto mb-16 leading-relaxed">
                      من كليات طب الأسنان في الجامعات الأردنية تحت إشراف أكاديمي متخصص لضمان أعلى مستويات الجودة والأمان.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                      <button onClick={() => setAuthScreen('PATIENT_LOGIN')} className="group bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm hover:border-sky-200 transition-all flex flex-col items-center gap-6">
                        <div className="w-20 h-20 bg-sky-50 rounded-3xl flex items-center justify-center text-4xl">👤</div>
                        <div className="text-center">
                          <h2 className="text-2xl font-black text-slate-800">انشر حالتي</h2>
                          <p className="text-slate-400 font-bold mt-2">أبحث عن علاج أسنان مجاني</p>
                        </div>
                      </button>
                      <button onClick={() => setAuthScreen('STUDENT_LOGIN')} className="group bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm hover:border-sky-200 transition-all flex flex-col items-center gap-6">
                        <div className="w-20 h-20 bg-sky-50 rounded-3xl flex items-center justify-center text-4xl">🎓</div>
                        <div className="text-center">
                          <h2 className="text-2xl font-black text-slate-800"> طالب طب أسنان</h2>
                          <p className="text-slate-400 font-bold mt-2">أبحث عن حالات سريرية</p>
                        </div>
                      </button>
                    </div>
                  </div>
                </section>

                <section className="py-24 bg-slate-50 px-6">
                  <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">كيف تعمل المنصة؟</h2>
                    <p className="text-slate-500 font-bold mb-16">خطوات بسيطة للحصول على علاج أسنان مجاني</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <LandingStep num="١" icon="📝" title="سجّل حالتك" desc="أدخل معلوماتك ووصف مشكلة الأسنان التي تعاني منها بكل دقة." />
                      <LandingStep num="٢" icon="📩" title="انتظر التواصل" desc="طالب طب أسنان موثق من جامعة أردنية سيتواصل معك لترتيب موعد." />
                      <LandingStep num="٣" icon="👩🏻‍⚕️" title="احصل على العلاج" desc="علاج مجاني بالكامل داخل عيادات الجامعة وتحت إشراف أكاديمي." />
                    </div>
                  </div>
                </section>

                <section className="py-24 px-6 bg-white text-center">
                  <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">لماذا أسناني JO؟</h2>
                  <p className="text-slate-500 font-bold mb-16">نقدم خدمة موثوقة تجمع بين الفائدة التعليمية والمجتمعية</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <WhyUsCard icon="💰" title="خدمة مجانية" desc="لا يتم تقاضي أي أجر مقابل العلاج." />
                    <WhyUsCard icon="🛡️" title="طلاب موثقون" desc="طلاب من جامعات أردنية معتمدة." />
                    <WhyUsCard icon="👨‍🏫" title="إشراف أكاديمي" desc="جميع الحالات تحت إشراف متخصص." />
                  </div>
                </section>

                <section className="py-20 bg-sky-500 text-white px-6 text-center">
                  <h2 className="text-3xl font-black mb-10 tracking-tight">الجامعات المشاركة</h2>
                  <div className="flex flex-wrap justify-center gap-8 mb-10">
                    <div className="bg-white/10 px-8 py-4 rounded-2xl font-black border border-white/20">الجامعة الأردنية</div>
                    <div className="bg-white/10 px-8 py-4 rounded-2xl font-black border border-white/20">جامعة العلوم والتكنولوجيا</div>
                  </div>
                  <p className="font-bold text-sm">يتم التحقق من جميع طلاب طب الأسنان عبر بريدهم الجامعي الرسمي لضمان المصداقية.</p>
                </section>

                <section className="py-24 px-6 bg-slate-50">
                  <div className="max-w-4xl mx-auto bg-white p-12 rounded-[40px] border border-slate-100 shadow-sm">
                    <h2 className="text-2xl font-black mb-6 tracking-tight">⚖️ إخلاء مسؤولية طبية</h2>
                    <div className="space-y-6 text-slate-600 font-bold text-sm leading-relaxed text-right">
                      <p>منصة أسناني JO هي منصة تعليمية غير ربحية تهدف إلى ربط المرضى بطلاب طب الأسنان لأغراض التدريب السريري. جميع الإجراءات الطبية تتم تحت إشراف مباشر من أعيئة التدريس المتخصصين في كليات طب الأسنان المعتمدة.</p>
                      <p className="text-slate-900">يرجى العلم بأن:</p>
                      <ul className="list-disc pr-5 space-y-3">
                        <li>العلاج يقدمه طلاب طب أسنان تحت التدريب وليس أطباء مرخصين بشكل كامل</li>
                        <li>جميع الحالات تخضع للمراجعة والموافقة الأكاديمية قبل البدء بالعلاج</li>
                        <li>المنصة لا تتحمل المسؤولية القانونية عن نتائج العلاج النهائية</li>
                        <li>يجب على المرضى التوقيع على موافقة مستنيرة قبل بدء أي إجراء طبي</li>
                        <li>الحالات الطارئة يجب توجيهها إلى المستشفيات والعيادات المتخصصة فوراً</li>
                      </ul>
                      <p className="mt-8 opacity-70">باستخدامك لهذه المنصة، فإنك توافق على هذه الشروط وتقر بفهمك الكامل للطبيعة التعليمية للخدمة المقدمة.</p>
                    </div>
                  </div>
                </section>

                <section className="py-24 px-6 text-center">
                  <h2 className="text-4xl font-black mb-6 text-slate-900 tracking-tight">جاهز للبدء؟</h2>
                  <p className="text-xl text-slate-500 font-bold mb-10">سجّل الآن واحصل على علاج أسنان مجاني من طلاب موثقين في عيادات الجامعات.</p>
                  <button onClick={() => setAuthScreen('PATIENT_SIGNUP')} className="px-12 py-5 bg-sky-500 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-sky-100 hover:scale-105 transition-all">ابدأ الآن</button>
                </section>

                <footer className="bg-slate-900 text-white py-20 px-6">
                  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-right">
                    <div className="col-span-2">
                      <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => { setAuthScreen('LANDING'); setActiveTab(''); }}>
                        <SparkleToothIcon className="w-10 h-10" />
                        <span className="text-2xl font-black text-sky-400">أسناني JO</span>
                      </div>
                      <p className="text-slate-400 font-bold mb-6 max-w-sm leading-relaxed text-xs">منصة غير ربحية تربط المرضى مع طلاب طب الأسنان من الجامعات الأردنية لتقديم علاج مجاني تحت إشراف أكاديمي متخصص.</p>
                      <div className="inline-block px-4 py-2 bg-sky-500/10 border border-sky-500/20 rounded-xl text-sky-400 text-xs font-black">
                        ⚠️ خدمة مجانية 100% لأغراض تعليمية ومجتمعية فقط
                      </div>
                    </div>
                    <div>
                      <h4 className="font-black mb-6 text-sky-400 text-lg tracking-tight">روابط سريعة</h4>
                      <ul className="space-y-4 text-slate-400 font-bold text-sm">
                        <li className="cursor-pointer hover:text-white" onClick={() => { setAuthScreen('LANDING'); setActiveTab(''); }}>الرئيسية</li>
                        <li className="cursor-pointer hover:text-white" onClick={() => { setAuthScreen('LANDING'); setActiveTab('about'); }}>عن المنصة</li>
                        <li className="cursor-pointer hover:text-white" onClick={() => setAuthScreen('PATIENT_SIGNUP')}>تسجيل مريض</li>
                        <li className="cursor-pointer hover:text-white" onClick={() => setAuthScreen('STUDENT_LOGIN')}>دخول الطلاب</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-black mb-6 text-sky-400 text-lg tracking-tight">الدعم</h4>
                      <ul className="space-y-4 text-slate-400 font-bold text-sm">
                        <li className="cursor-pointer hover:text-white">المساعدة</li>
                        <li className="cursor-pointer hover:text-white">الخصوصية</li>
                        <li className="cursor-pointer hover:text-white">الشروط والأحكام</li>
                        <li className="cursor-pointer hover:text-white">تواصل معنا</li>
                      </ul>
                    </div>
                  </div>
                  <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 space-y-6">
                    <p className="text-center text-slate-500 text-[10px] font-bold leading-relaxed max-w-3xl mx-auto italic uppercase">
                       ⚠️ الخدمة مجانية بالكامل، ولا يتم تقاضي أي أجر. جميع الحالات لأغراض تعليمية وتحت إشراف أكاديمي متخصص في عيادات كليات طب الأسنان المعتمدة.
                    </p>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold text-slate-600 uppercase">
                      <p>© 2026 أسناني JO - جميع الحقوق محفوظة</p>
                      <div className="flex gap-4">
                        <span>الجامعة الأردنية</span>
                        <span>•</span>
                        <span>جامعة العلوم والتكنولوجيا الأردنية</span>
                      </div>
                    </div>
                  </div>
                </footer>
              </>
            )}
          </main>
        ) : (
          <div className="pt-32 px-6 flex justify-center pb-20 bg-slate-50/50 min-h-screen">
            <div className="bg-white w-full max-w-md p-10 rounded-[32px] shadow-2xl border border-sky-50 self-start mt-10">
               {authScreen === 'PATIENT_LOGIN' && (
                 <form onSubmit={(e) => { e.preventDefault(); handleAuthSubmit(UserRole.PATIENT, {}); }} className="space-y-6 text-right">
                    <div className="text-center mb-10">
                      <h2 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">تسجيل دخول المرضى</h2>
                      <p className="text-slate-400 font-bold text-sm">أدخل بياناتك للدخول</p>
                    </div>
                    <InputGroup label="رقم الهاتف" name="phone" placeholder="07xxxxxxxx" icon="📞" type="tel" />
                    <InputGroup label="كلمة المرور" name="password" placeholder="أدخل كلمة المرور" icon="🔒" type="password" />
                    <button type="submit" className="w-full py-4 bg-sky-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-sky-100">تسجيل الدخول</button>
                    <div className="text-center">
                      <button type="button" onClick={() => setAuthScreen('PATIENT_SIGNUP')} className="text-sky-500 font-black text-sm">ليس لديك حساب؟ سجل الآن</button>
                    </div>
                    <button type="button" onClick={() => setAuthScreen('LANDING')} className="w-full py-3 bg-white border border-slate-100 text-slate-800 rounded-2xl font-black text-sm">رجوع للصفحة الرئيسية</button>
                 </form>
               )}

               {authScreen === 'PATIENT_SIGNUP' && (
                 <form onSubmit={(e) => { e.preventDefault(); handleAuthSubmit(UserRole.PATIENT, {}); }} className="space-y-6 text-right">
                    <div className="text-center mb-10">
                      <h2 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">إنشاء حساب مريض</h2>
                      <p className="text-slate-400 font-bold text-sm">سجل بياناتك لإنشاء حساب جديد</p>
                    </div>
                    <InputGroup label="الاسم الكامل" name="name" placeholder="أدخل اسمك الكامل" icon="👤" type="text" />
                    <InputGroup label="رقم الهاتف" name="phone" placeholder="07xxxxxxxx" icon="📞" type="tel" subtext="سيستخدم هذا الرقم للتواصل معك عبر واتساب" />
                    <InputGroup label="كلمة المرور" name="password" placeholder="أدخل كلمة المرور" icon="🔒" type="password" />
                    <button type="submit" className="w-full py-4 bg-sky-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-sky-100">إنشاء حساب</button>
                    <div className="text-center">
                      <button type="button" onClick={() => setAuthScreen('PATIENT_LOGIN')} className="text-sky-500 font-black text-sm">لديك حساب؟ تسجيل الدخول</button>
                    </div>
                    <button type="button" onClick={() => setAuthScreen('LANDING')} className="w-full py-3 bg-white border border-slate-100 text-slate-800 rounded-2xl font-black text-sm">رجوع للصفحة الرئيسية</button>
                 </form>
               )}

               {authScreen === 'STUDENT_LOGIN' && (
                 <form onSubmit={(e) => { e.preventDefault(); handleAuthSubmit(UserRole.STUDENT, {}); }} className="space-y-6 text-right">
                    <div className="text-center mb-10">
                      <h2 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">تسجيل دخول الطلاب</h2>
                      <p className="text-slate-400 font-bold text-sm">أدخل بياناتك للدخول</p>
                    </div>
                    <InputGroup label="البريد الإلكتروني الجامعي" name="email" placeholder="student@university.edu.jo" icon="✉️" type="email" subtext="يجب استخدام البريد الجامعي للتحقق" />
                    <InputGroup label="كلمة المرور" name="password" placeholder="أدخل كلمة المرور" icon="🔒" type="password" />
                    <button type="submit" className="w-full py-4 bg-sky-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-sky-100">تسجيل الدخول</button>
                    <div className="text-center">
                      <button type="button" onClick={() => setAuthScreen('STUDENT_SIGNUP')} className="text-sky-500 font-black text-sm">ليس لديك حساب؟ سجل الآن</button>
                    </div>
                    <button type="button" onClick={() => setAuthScreen('LANDING')} className="w-full py-3 bg-white border border-slate-100 text-slate-800 rounded-2xl font-black text-sm">رجوع للصفحة الرئيسية</button>
                 </form>
               )}

               {authScreen === 'STUDENT_SIGNUP' && (
                 <form onSubmit={(e) => { e.preventDefault(); handleAuthSubmit(UserRole.STUDENT, {}); }} className="space-y-6 text-right">
                    <div className="text-center mb-10">
                      <h2 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">إنشاء حساب طالب</h2>
                      <p className="text-slate-400 font-bold text-sm">سجل بياناتك لإنشاء حساب جديد</p>
                    </div>
                    <InputGroup label="الاسم الكامل" name="name" placeholder="أدخل اسمك الكامل" icon="👤" type="text" />
                    <InputGroup label="رقم الهاتف" name="phone" placeholder="07xxxxxxxx" icon="📞" type="tel" />
                    <InputGroup label="البريد الإلكتروني الجامعي" name="email" placeholder="student@university.edu.jo" icon="✉️" type="email" subtext="يجب استخدام البريد الجامعي للتحقق" />
                    <InputGroup label="اسم الجامعة" name="university" placeholder="مثال: جامعة الأردن" icon="🏛️" type="text" />
                    <InputGroup label="كلمة المرور" name="password" placeholder="أدخل كلمة المرور" icon="🔒" type="password" />
                    <button type="submit" className="w-full py-4 bg-sky-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-sky-100">إنشاء حساب</button>
                    <div className="text-center">
                      <button type="button" onClick={() => setAuthScreen('STUDENT_LOGIN')} className="text-sky-500 font-black text-sm">لديك حساب؟ تسجيل الدخول</button>
                    </div>
                    <button type="button" onClick={() => setAuthScreen('LANDING')} className="w-full py-3 bg-white border border-slate-100 text-slate-800 rounded-2xl font-black text-sm">رجوع للصفحة الرئيسية</button>
                 </form>
               )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Layout user={user} onLogout={() => setUser(null)} activeTab={activeTab} setActiveTab={setActiveTab}>
      {!user.disclaimerAccepted && <DisclaimerModal onAccept={() => setUser({ ...user, disclaimerAccepted: true })} />}
      {showToast && <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-slate-800 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-2xl">✓ تم النسخ</div>}
      
      {activeTab === 'dashboard' && user.role === UserRole.STUDENT && (
        <StudentDashboard requirements={requirements} setRequirements={setRequirements} onAddExternalPatient={addNewCase} />
      )}
      
      {activeTab === 'patient-dashboard' && user.role === UserRole.PATIENT && (
        <PatientDashboard myCases={cases.filter(c => c.patientId === user.id || c.patientId === 'p1')} />
      )}

      {activeTab === 'cases' && user.role === UserRole.STUDENT && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
          {cases.filter(c => c.status === CaseStatus.OPEN).map(c => (
            <CaseCard key={c.id} c={c} onPreview={() => setPreviewCase(c)} onShare={() => handleShare(c)} />
          ))}
          {cases.filter(c => c.status === CaseStatus.OPEN).length === 0 && (
             <div className="col-span-full py-20 text-center text-slate-400 font-bold">لا توجد حالات متاحة حالياً.</div>
          )}
        </div>
      )}

      {activeTab === 'pending-cases' && user.role === UserRole.STUDENT && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cases.filter(c => c.claimedBy === user.id && c.status === CaseStatus.CLAIMED).map(c => (
             <div key={c.id} className="bg-white p-8 rounded-[40px] border border-sky-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 bg-sky-500 text-white px-4 py-1 text-[10px] font-black rounded-bl-xl">محجوزة لك</div>
                <h3 className="text-2xl font-black mb-1">{c.patientName}</h3>
                <p className="text-[10px] text-slate-400 font-bold mb-4">تاريخ النشر: {new Date(c.createdAt).toLocaleDateString('ar-JO')}</p>
                <p className="text-slate-500 mb-6 text-sm leading-relaxed">{c.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <a href={`https://wa.me/${c.phone}`} target="_blank" className="flex items-center justify-center bg-emerald-500 text-white py-4 rounded-2xl font-black shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-all">واتساب المريض</a>
                  <button onClick={() => unclaimCase(c.id)} className="bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 py-4 rounded-2xl font-black transition-all">إلغاء الحجز</button>
                </div>
             </div>
          ))}
          {cases.filter(c => c.claimedBy === user.id && c.status === CaseStatus.CLAIMED).length === 0 && (
             <div className="col-span-full py-20 text-center text-slate-400 font-bold">لا توجد حالات محجوزة لديك حالياً.</div>
          )}
        </div>
      )}

      {activeTab === 'submit-case' && user.role === UserRole.PATIENT && (
        <PatientFlow onAddCase={addNewCase} onBackToDashboard={() => setActiveTab('patient-dashboard')} />
      )}
      {activeTab === 'profile' && <ProfileSection user={user} onUpdate={setUser} />}
      {activeTab === 'admin-dashboard' && user.role === UserRole.ADMIN && <AdminCommandCenter />}
      {activeTab === 'about' && (
        <div className="pt-4">
          <AboutSection 
            onPatientSignup={() => setAuthScreen('PATIENT_SIGNUP')} 
            onStudentLogin={() => setAuthScreen('STUDENT_LOGIN')} 
          />
        </div>
      )}

      {/* مودال معاينة الحالة */}
      {previewCase && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 overflow-y-auto" dir="rtl">
          <div className="bg-white rounded-[40px] p-8 md:p-12 max-w-2xl w-full shadow-2xl relative animate-in zoom-in duration-300 my-8">
            <button onClick={() => setPreviewCase(null)} className="absolute top-6 left-6 text-slate-300 hover:text-red-500 text-2xl transition-colors">✕</button>
            
            <div className="mb-8 text-right">
              <span className="bg-sky-50 text-sky-600 px-4 py-1.5 rounded-full text-xs font-black uppercase mb-4 inline-block tracking-widest">معاينة تفاصيل الحالة</span>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">{previewCase.patientName}</h2>
              <p className="text-sm text-slate-400 font-bold mt-2">نُشرت بتاريخ: {new Date(previewCase.createdAt).toLocaleDateString('ar-JO')}</p>
            </div>

            <div className="space-y-8 max-h-[50vh] overflow-y-auto pr-2 scrollbar-hide text-right">
              <section>
                <h4 className="font-black text-slate-700 text-sm mb-3">شرح الحالة:</h4>
                <div className="bg-slate-50 p-6 rounded-3xl text-slate-600 font-bold leading-relaxed border border-slate-100">
                  {previewCase.description}
                </div>
              </section>

              {previewCase.imageUrls && previewCase.imageUrls.length > 0 && (
                <section>
                  <h4 className="font-black text-slate-700 text-sm mb-3">الصور والأشعة:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {previewCase.imageUrls.map((url, i) => (
                      <img key={i} src={url} className="w-full aspect-square object-cover rounded-2xl border border-slate-100 shadow-sm" alt="case" />
                    ))}
                  </div>
                </section>
              )}

              <section className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
                <p className="text-amber-800 text-xs font-black leading-relaxed">
                  ⚠️ لا يمكن عرض رقم الهاتف إلا بعد حجز الحالة لضمان التزام الطلاب وجدية المواعيد.
                </p>
              </section>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-10 pt-8 border-t border-slate-50">
              <button onClick={() => setPreviewCase(null)} className="py-4 font-black text-slate-400 text-sm">إغلاق المعاينة</button>
              <button 
                onClick={() => claimCase(previewCase.id)}
                className="py-4 bg-sky-500 text-white rounded-2xl font-black shadow-xl shadow-sky-100 hover:bg-sky-600 transition-all text-sm"
              >
                حجز الحالة الآن
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

const LandingStep = ({ num, icon, title, desc }: any) => (
  <div className="bg-white p-10 rounded-[40px] text-center border border-slate-100 relative hover:shadow-xl transition-all group overflow-hidden">
    <div className="absolute top-0 right-0 w-2 h-full bg-sky-100 group-hover:bg-sky-500 transition-colors"></div>
    <div className="w-12 h-12 bg-sky-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 font-black text-xl shadow-lg shadow-sky-100">{num}</div>
    <div className="text-4xl mb-6">{icon}</div>
    <h3 className="text-xl font-black mb-4 text-slate-800">{title}</h3>
    <p className="text-slate-400 font-bold text-sm leading-relaxed">{desc}</p>
  </div>
);

const WhyUsCard = ({ icon, title, desc }: any) => (
  <div className="group text-center">
    <div className="w-20 h-20 bg-sky-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-4xl group-hover:scale-110 transition-transform">{icon}</div>
    <h3 className="text-xl font-black mb-4 text-slate-800 tracking-tight">{title}</h3>
    <p className="text-slate-400 font-bold text-sm leading-relaxed">{desc}</p>
  </div>
);

const CaseCard = ({ c, onPreview, onShare }: any) => (
  <div className="bg-white p-6 rounded-[32px] border border-slate-100 hover:shadow-xl transition-all relative group overflow-hidden text-right">
    <div className="flex justify-between items-start mb-6">
      <SparkleToothIcon className="w-10 h-10" />
      <button onClick={() => onShare(c)} className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-sky-500 transition-colors"><ShareIcon /></button>
    </div>
    <h3 className="text-xl font-black text-slate-800 mb-1">{c.patientName}</h3>
    <p className="text-[10px] text-slate-400 font-bold mb-4">تاريخ النشر: {new Date(c.createdAt).toLocaleDateString('ar-JO')}</p>
    <p className="text-slate-400 text-sm mb-6 line-clamp-2 font-bold h-10 leading-relaxed">{c.description}</p>
    
    {c.imageUrls && c.imageUrls.length > 0 && (
      <div className="mb-4 flex gap-1">
        <span className="text-[10px] bg-sky-50 text-sky-500 px-2 py-0.5 rounded-md font-black">يوجد {c.imageUrls.length} صور</span>
      </div>
    )}

    <button onClick={onPreview} className="w-full py-4 bg-sky-500 text-white rounded-2xl font-black text-sm shadow-lg shadow-sky-100 hover:bg-sky-600 transition-all">عرض وتفاصيل الحالة</button>
  </div>
);

const InputGroup = ({ label, name, placeholder, icon, type, subtext }: any) => (
  <div className="space-y-1 text-right">
    <label className="block text-xs font-black text-slate-800 mb-1">{label}</label>
    <div className="relative">
      <input 
        name={name} 
        type={type} 
        placeholder={placeholder} 
        className={`w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-sky-500 pr-4 pl-12 ${type === 'tel' || type === 'email' ? 'text-left' : ''}`} 
        dir={type === 'tel' || type === 'email' ? 'ltr' : 'rtl'}
        required 
      />
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">{icon}</span>
    </div>
    {subtext && <p className="text-[10px] text-slate-400 font-bold mt-1 leading-tight">{subtext}</p>}
  </div>
);

export default App;
