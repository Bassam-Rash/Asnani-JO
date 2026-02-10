
import React from 'react';

interface AboutSectionProps {
  onPatientSignup: () => void;
  onStudentLogin: () => void;
}

const AboutSection: React.FC<AboutSectionProps> = ({ onPatientSignup, onStudentLogin }) => {
  return (
    <div className="space-y-24 pb-20 animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto pt-10 px-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-sky-50 text-sky-600 rounded-full text-xs font-black mb-6">
          <span className="animate-pulse">●</span> عن المنصة
        </div>
        <h1 className="text-5xl font-black text-slate-900 mb-8 tracking-tight">منصة أسناني JO</h1>
        <p className="text-xl text-slate-500 font-bold leading-relaxed">
          منصة غير ربحية تربط المرضى الذين يحتاجون علاج أسنان مع طلاب طب الأسنان الموثقين من الجامعات الأردنية، لأغراض تعليمية وخدمة المجتمع.
        </p>
      </section>

      {/* Mission Stats Grid */}
      <section className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard val="2" label="جامعات أردنية" icon="🏛️" color="bg-emerald-50 text-emerald-600" />
          <StatCard val="100%" label="خدمة مجانية" icon="💎" color="bg-sky-50 text-sky-600" />
          <StatCard val="✓" label="طلاب موثوقون" icon="👤" color="bg-amber-50 text-amber-600" />
          <StatCard val="✓" label="إشراف أكاديمي" icon="🛡️" color="bg-purple-50 text-purple-600" />
        </div>
        
        <div className="mt-16 flex flex-col md:flex-row items-center gap-12 bg-white p-10 rounded-[48px] border border-slate-100">
           <div className="w-24 h-24 bg-sky-500 rounded-full flex items-center justify-center text-4xl shadow-xl shadow-sky-100 shrink-0">🎯</div>
           <div className="text-right">
             <h3 className="text-2xl font-black text-slate-800 mb-4">رسالتنا</h3>
             <p className="text-slate-500 font-bold leading-loose">
               نهدف إلى تقديم خدمة صحية مجانية للمجتمع الأردني، مع توفير فرص تدريبية عملية لطلاب طب الأسنان تحت إشراف أكاديمي متخصص. نؤمن بأن التعليم والخدمة المجتمعية يمكن أن يجتمعا لخلق أثر إيجابي مستدام.
             </p>
           </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-slate-50/50 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-center text-slate-900 mb-16 tracking-tight">قيمنا</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ValueCard 
              icon="💙" 
              title="الخدمة المجتمعية" 
              desc="نلتزم بتقديم خدمة مجانية للمجتمع دون أي مقابل مادي." 
            />
            <ValueCard 
              icon="🎓" 
              title="التعليم العملي" 
              desc="توفير فرص تدريبية حقيقية لطلاب طب الأسنان." 
            />
            <ValueCard 
              icon="🛡️" 
              title="الثقة والشفافية" 
              desc="نضمن التحقق من جميع الطلاب والإشراف الأكاديمي." 
            />
          </div>
        </div>
      </section>

      {/* How it works visualization */}
      <section className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-black text-center text-slate-900 mb-16 tracking-tight">كيف نعمل؟</h2>
        <div className="space-y-6">
          <ProcessStep num="1" color="bg-sky-500" title="المرضى ينشرون حالاتهم" desc="يقوم المريض بتسجيل معلوماته ونشر حالته على المنصة بشكل مجاني." />
          <ProcessStep num="2" color="bg-emerald-500" title="الطلاب يتصفحون الحالات" desc="طلاب طب الأسنان الموثقون من الجامعات الأردنية يتصفحون الحالات المتاحة." />
          <ProcessStep num="3" color="bg-purple-500" title="التواصل والعلاج" desc="يتواصل الطالب مع المريض عبر الواتساب ويتم تحديد موعد للعلاج تحت الإشراف الأكاديمي." />
        </div>
      </section>

      {/* Partners Section */}
      <section className="bg-sky-600 py-24 text-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-black mb-4">الجامعات المشاركة</h2>
          <p className="opacity-80 font-bold mb-16">نفخر بالشراكة مع أفضل الجامعات الأردنية في مجال طب الأسنان</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-10 rounded-[40px] flex flex-col items-center group hover:bg-white/20 transition-all">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-sky-600 text-2xl font-black mb-6">JU</div>
              <h4 className="text-xl font-black mb-2">الجامعة الأردنية</h4>
              <p className="text-xs opacity-60 font-bold uppercase tracking-widest">University of Jordan</p>
              <div className="mt-6 px-4 py-1 bg-white/10 rounded-full text-[10px] font-black tracking-widest uppercase">@ju.edu.jo</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-10 rounded-[40px] flex flex-col items-center group hover:bg-white/20 transition-all">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-sky-600 text-2xl font-black mb-6">JUST</div>
              <h4 className="text-xl font-black mb-2">جامعة العلوم والتكنولوجيا</h4>
              <p className="text-xs opacity-60 font-bold uppercase tracking-widest">Jordan University of Science & Technology</p>
              <div className="mt-6 px-4 py-1 bg-white/10 rounded-full text-[10px] font-black tracking-widest uppercase">@just.edu.jo</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="text-center px-6">
        <h2 className="text-4xl font-black text-slate-900 mb-6">هل أنت مستعد للانضمام؟</h2>
        <p className="text-xl text-slate-500 font-bold mb-12">سواء كنت مريضاً يبحث عن علاج مجاني، أو طالب طب أسنان يبحث عن حالات سريرية، نحن هنا لمساعدتك</p>
        <div className="flex flex-col md:flex-row justify-center gap-6">
          <button onClick={onPatientSignup} className="px-10 py-5 bg-sky-500 text-white rounded-2xl font-black text-lg shadow-2xl shadow-sky-100 hover:scale-105 transition-all">
            تسجيل كمريض
          </button>
          <button onClick={onStudentLogin} className="px-10 py-5 bg-white border-2 border-slate-100 text-slate-800 rounded-2xl font-black text-lg hover:bg-slate-50 transition-all">
            دخول الطلاب
          </button>
        </div>
      </section>
    </div>
  );
};

const StatCard = ({ val, label, icon, color }: any) => (
  <div className="bg-white p-8 rounded-[32px] border border-slate-50 shadow-sm flex flex-col items-center text-center group hover:shadow-xl hover:border-sky-100 transition-all">
    <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center text-2xl mb-6`}>{icon}</div>
    <div className="text-3xl font-black text-slate-800 mb-2">{val}</div>
    <div className="text-xs font-black text-slate-400 uppercase tracking-widest">{label}</div>
  </div>
);

const ValueCard = ({ icon, title, desc }: any) => (
  <div className="bg-white p-10 rounded-[40px] border border-slate-100 text-center shadow-sm">
    <div className="text-4xl mb-6">{icon}</div>
    <h3 className="text-xl font-black text-slate-800 mb-4">{title}</h3>
    <p className="text-slate-500 font-bold text-sm leading-relaxed">{desc}</p>
  </div>
);

const ProcessStep = ({ num, color, title, desc }: any) => (
  <div className="flex items-center gap-6 bg-white p-6 md:p-10 rounded-[40px] border border-slate-50 shadow-sm">
    <div className={`w-12 h-12 ${color} text-white rounded-2xl flex items-center justify-center text-xl font-black shrink-0`}>{num}</div>
    <div className="text-right">
      <h4 className="text-lg font-black text-slate-800 mb-1">{title}</h4>
      <p className="text-slate-400 font-bold text-sm leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default AboutSection;
