import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Dashboard from './components/Dashboard';
import { 
  Zap, 
  Check, 
  X, 
  ArrowLeft, 
  LayoutDashboard, 
  Car, 
  FileText, 
  Users, 
  BarChart3, 
  ShieldAlert, 
  MessageSquare, 
  Star,
  Menu,
  Lock,
  ChevronDown
} from 'lucide-react';

export default function App() {
  const [view, setView] = useState<'landing' | 'dashboard'>('dashboard');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (view === 'dashboard') {
    return <Dashboard onLogout={() => setView('landing')} />;
  }

  return (
    <div className="min-h-screen font-sans" dir="rtl">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/40">
              <Zap className="text-white w-6 h-6 fill-white" />
            </div>
            <span className="text-xl font-black tracking-tight">Easy<span className="text-blue-500">Rent</span></span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">المميزات</a>
            <a href="#pricing" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">الأسعار</a>
            <a href="#testimonials" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">آراء العملاء</a>
            <a href="#contact" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">تواصل معنا</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button className="px-5 py-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors">تسجيل الدخول</button>
            <button 
              onClick={() => setView('dashboard')}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:-translate-y-0.5"
            >
              ابدأ مجاناً ←
            </button>
          </div>

          <button className="md:hidden text-slate-400" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-ink/98 backdrop-blur-2xl pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6">
              <a href="#features" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold text-slate-200">المميزات</a>
              <a href="#pricing" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold text-slate-200">الأسعار</a>
              <a href="#testimonials" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold text-slate-200">آراء العملاء</a>
              <div className="h-px bg-white/10" />
              <button 
                onClick={() => {
                  setView('dashboard');
                  setIsMenuOpen(false);
                }}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl"
              >
                ابدأ مجاناً ←
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 hero-gradient pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600/10 border border-blue-600/20 rounded-full text-xs font-bold text-blue-400 mb-8"
          >
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            النظام الأول من نوعه في الخليج لمكاتب التأجير
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black leading-tight mb-6 tracking-tighter"
          >
            حوّل مكتبك من <br />
            <span className="text-amber-500">فوضى Excel</span> <br />
            إلى <span className="text-blue-500 animate-shimmer bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400 bg-clip-text text-transparent">ماكينة أرباح ذكية</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            EasyRent نظام تشغيل متكامل يُدير أسطولك، عقودك، عملاءك — ويعطيك أرباحك <span className="text-white font-bold">لحظةً بلحظة</span>. بدون ورق. بدون فوضى. بدون نسيان.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <button 
              onClick={() => setView('dashboard')}
              className="w-full sm:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-2xl shadow-blue-600/40 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5 fill-white" />
              ابدأ مجاناً — لا بطاقة مطلوبة
            </button>
            <button className="w-full sm:w-auto px-10 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200 font-bold rounded-2xl transition-all flex items-center justify-center gap-2">
              شاهد العرض التوضيحي
            </button>
          </motion.div>

          {/* Dashboard Mockup */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-5xl mx-auto"
          >
            <div className="bg-ink-lighter border border-white/10 rounded-2xl overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.6)] relative group">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {/* Browser Bar */}
              <div className="bg-ink-lightest border-b border-white/5 px-4 py-3 flex items-center gap-4">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                </div>
                <div className="flex-1 bg-white/5 border border-white/5 rounded-lg py-1 px-3 text-[10px] text-slate-500 flex items-center gap-2">
                  <Lock className="w-3 h-3 text-emerald-500" />
                  app.easyrent.com/dashboard
                </div>
              </div>

              <div className="flex h-[400px]">
                {/* Sidebar */}
                <div className="w-48 bg-ink/50 border-l border-white/5 p-4 hidden md:flex flex-col gap-1">
                  <div className="flex items-center gap-2 mb-6 px-2">
                    <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Zap className="w-3 h-3 text-white fill-white" />
                    </div>
                    <span className="text-xs font-black">EasyRent</span>
                  </div>
                  <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-2 mb-2">القائمة</div>
                  <div className="bg-blue-600/10 border border-blue-600/20 text-blue-400 px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    لوحة التحكم
                  </div>
                  <div className="text-slate-500 px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 hover:bg-white/5 transition-colors">
                    <Car className="w-4 h-4" />
                    الأسطول
                  </div>
                  <div className="text-slate-500 px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 hover:bg-white/5 transition-colors">
                    <FileText className="w-4 h-4" />
                    العقود
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6 flex flex-col gap-6">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: 'إجمالي الدخل', value: '٨٤,٢٣٠', unit: 'د.ك', trend: '+12.5%' },
                      { label: 'السيارات المتاحة', value: '١٨', unit: 'سيارة', trend: 'إشغال 75%' },
                      { label: 'العقود النشطة', value: '٣٤', unit: 'عقد', trend: 'عقدان ينتهيان اليوم' },
                      { label: 'الربح الصافي', value: '٦١,٤٠٠', unit: 'د.ك', trend: 'هامش 73%' },
                    ].map((stat, i) => (
                      <div key={i} className="bg-ink-lightest border border-white/5 p-4 rounded-xl">
                        <div className="text-[10px] font-bold text-slate-500 mb-1">{stat.label}</div>
                        <div className="text-xl font-black">{stat.value} <span className="text-[10px] text-slate-600">{stat.unit}</span></div>
                        <div className="text-[10px] font-bold text-emerald-500 mt-1">{stat.trend}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2 bg-ink-lightest border border-white/5 rounded-xl p-4">
                      <div className="text-xs font-bold text-slate-400 mb-4">📊 إيرادات الأشهر الستة الأخيرة</div>
                      <div className="flex items-end gap-2 h-32">
                        {[40, 60, 45, 75, 90, 100].map((h, i) => (
                          <div key={i} className="flex-1 bg-blue-600/20 rounded-t-lg relative group">
                            <motion.div 
                              initial={{ height: 0 }}
                              animate={{ height: `${h}%` }}
                              className={`absolute bottom-0 left-0 right-0 rounded-t-lg ${i === 5 ? 'bg-blue-600' : 'bg-blue-600/40'}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-ink-lightest border border-white/5 rounded-xl p-4">
                      <div className="text-xs font-bold text-slate-400 mb-4">🚗 حالة الأسطول</div>
                      <div className="flex flex-col gap-3">
                        {[
                          { label: 'متاحة', color: 'bg-emerald-500', pct: 46 },
                          { label: 'مؤجرة', color: 'bg-blue-500', pct: 79 },
                          { label: 'صيانة', color: 'bg-amber-500', pct: 13 },
                        ].map((item, i) => (
                          <div key={i} className="flex flex-col gap-1">
                            <div className="flex justify-between text-[10px] font-bold">
                              <span className="text-slate-400">{item.label}</span>
                              <span className="text-slate-200">{item.pct}%</span>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${item.pct}%` }}
                                className={`h-full ${item.color}`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Band */}
      <section className="py-20 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { num: '+200', label: 'مكتب تأجير يثق بنا', color: 'text-blue-500' },
              { num: '40%', label: 'متوسط زيادة الأرباح', color: 'text-amber-500' },
              { num: '60 ثا', label: 'لإنشاء عقد كامل', color: 'text-emerald-500' },
              { num: '24/7', label: 'دعم فني متواصل', color: 'text-slate-200' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className={`text-4xl md:text-5xl font-black mb-2 ${stat.color}`}>{stat.num}</div>
                <div className="text-sm font-medium text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 bg-ink-lighter border-b border-white/5" id="problem">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="px-4 py-1.5 bg-blue-600/10 border border-blue-600/20 rounded-full text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-4 inline-block">🔍 المشكلة الحقيقية</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">هل هذا يصف وضعك؟</h2>
            <p className="text-slate-400 max-w-xl mx-auto">أغلب أصحاب مكاتب التأجير لا يعرفون إن كانوا رابحين أو خسرانين — إلا في نهاية الشهر.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-ink-lightest border border-red-500/20 p-8 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-3xl rounded-full" />
              <div className="flex items-center gap-2 text-red-500 font-bold text-sm mb-6 uppercase tracking-widest">
                <ShieldAlert className="w-5 h-5" />
                واقع كثير من المكاتب اليوم
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  'ملفات Excel مبعثرة على ١٠ أجهزة مختلفة',
                  'عقود ورقية تضيع وتتلف مع الوقت',
                  'نسيان متابعة العملاء المميزين وخسارتهم',
                  'تسعير عشوائي — السعر اللي "يطلع براسهم"',
                  'سيارات خاسرة في الأسطول ما أحد يعرف عنها',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-400 text-sm bg-red-500/5 border border-red-500/10 p-3 rounded-xl">
                    <span className="text-red-500 mt-0.5">⚠️</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-500/5 border border-red-500/10 p-4 rounded-2xl text-center">
                  <div className="text-3xl font-black text-red-500">30%</div>
                  <div className="text-[10px] font-bold text-slate-500 mt-1 uppercase">من الأرباح تضيع بسبب الفوضى</div>
                </div>
                <div className="bg-red-500/5 border border-red-500/10 p-4 rounded-2xl text-center">
                  <div className="text-3xl font-black text-red-500">15 د</div>
                  <div className="text-[10px] font-bold text-slate-500 mt-1 uppercase">وقت إنشاء عقد واحد</div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <h3 className="text-2xl font-black leading-tight">
                EasyRent يحل هذه المشاكل <br />
                <span className="text-blue-500">بضغطة زر واحدة</span>
              </h3>
              {[
                { num: '١', title: 'كل شيء في مكان واحد', desc: 'أسطولك، عقودك، عملاؤك، وأرباحك — كلها في لوحة تحكم واحدة واضحة لا تحتاج تدريباً.' },
                { num: '٢', title: 'ربح لحظي وليس شهرياً', desc: 'اعرف أرباحك الآن — لحظة بلحظة — بدلاً من انتظار نهاية الشهر لتكتشف الخسائر.' },
                { num: '٣', title: 'قرارات ذكية وليست تخمين', desc: 'النظام يحلل أداء كل سيارة ويخبرك أيها تحتفظ بها، وأيها تبيع، ومتى ترفع السعر.' },
              ].map((point, i) => (
                <div key={i} className="flex gap-6">
                  <div className="w-12 h-12 bg-blue-600/10 border border-blue-600/20 rounded-2xl flex items-center justify-center text-blue-500 font-black flex-shrink-0">
                    {point.num}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-200 mb-1">{point.title}</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">{point.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24" id="features">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="px-4 py-1.5 bg-blue-600/10 border border-blue-600/20 rounded-full text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-4 inline-block">⚡ المميزات</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">كل أداة تحتاجها<br />في نظام واحد</h2>
            <p className="text-slate-400 max-w-xl mx-auto">من إنشاء العقد حتى تحليل الربحية — EasyRent يغطي كل جانب في إدارة مكتبك.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                icon: <BarChart3 className="w-6 h-6" />, 
                title: 'عقل الأرباح الذكي', 
                desc: 'نظام تسعير ديناميكي يرفع أسعارك تلقائياً في أوقات الذروة ويعطيك ربح وخسارة لحظي.',
                points: ['تسعير ذكي حسب الطلب', 'ربح وخسارة لحظي P&L', 'توقعات الإيرادات'],
                featured: true
              },
              { 
                icon: <FileText className="w-6 h-6" />, 
                title: 'عقود في ٦٠ ثانية', 
                desc: 'أنشئ عقداً كاملاً بتوقيع إلكتروني وفاتورة ورسالة واتساب للعميل — في أقل من دقيقة.',
                points: ['توقيع إلكتروني', 'فاتورة PDF تلقائية', 'واتساب فوري']
              },
              { 
                icon: <Car className="w-6 h-6" />, 
                title: 'إدارة الأسطول الذكية', 
                desc: 'تتبع كل سيارة في أسطولك — صيانتها، تأمينها، وأداؤها المالي — من مكان واحد.',
                points: ['تنبيهات الصيانة', 'نقاط أداء السيارات', 'توصيات البيع']
              },
              { 
                icon: <Users className="w-6 h-6" />, 
                title: 'منجم العملاء الذهبيين', 
                desc: 'حوّل كل عميل إلى علاقة مربحة طويلة المدى مع نظام CLV وإعادة تفعيل تلقائية.',
                points: ['قيمة حياة العميل', 'إعادة تفعيل تلقائية', 'تصنيف VIP']
              },
              { 
                icon: <ShieldAlert className="w-6 h-6" />, 
                title: 'ماسح المخاطر', 
                desc: 'قبل قبول أي حجز، النظام يحسب نقاط مخاطرة العميل ويقترح الشروط المناسبة.',
                points: ['Risk Score للعملاء', 'سجل التأخير', 'قائمة سوداء']
              },
              { 
                icon: <LayoutDashboard className="w-6 h-6" />, 
                title: 'تقارير بكليك واحد', 
                desc: 'تقارير ربحية شهرية، أداء الأسطول، والعملاء الذهبيين — PDF جاهز فوراً.',
                points: ['تقرير P&L شهري', 'أفضل السيارات ربحاً', 'توقعات النمو']
              },
            ].map((feat, i) => (
              <div key={i} className={`p-8 rounded-3xl border transition-all hover:-translate-y-1 ${feat.featured ? 'bg-blue-600/5 border-blue-600/20' : 'bg-ink-lighter border-white/5 hover:border-white/10'}`}>
                {feat.featured && <div className="inline-block px-3 py-1 bg-amber-500 text-ink text-[10px] font-black rounded-full mb-4 uppercase tracking-widest">⭐ الأبرز</div>}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${feat.featured ? 'bg-blue-600 text-white' : 'bg-white/5 text-blue-500 border border-white/10'}`}>
                  {feat.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feat.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">{feat.desc}</p>
                <ul className="space-y-2">
                  {feat.points.map((p, j) => (
                    <li key={j} className="flex items-center gap-2 text-xs font-bold text-slate-300">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-ink-lighter border-y border-white/5" id="pricing">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="px-4 py-1.5 bg-blue-600/10 border border-blue-600/20 rounded-full text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-4 inline-block">💰 الأسعار</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">سعر يناسب كل مكتب</h2>
            <p className="text-slate-400 max-w-xl mx-auto">ابدأ مجاناً، وانتقل لباقة أكبر عندما يكبر مكتبك — بدون عقود ملزمة.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {[
              { 
                plan: 'Starter', 
                desc: 'مثالي لمكاتب تبدأ رحلتها مع الرقمنة', 
                price: 'مجاني', 
                period: 'إلى الأبد — ٥ سيارات',
                features: ['٥ سيارات في الأسطول', 'عقود رقمية غير محدودة', 'فواتير PDF تلقائية', 'لوحة تحكم أساسية'],
                disabled: ['التسعير الذكي', 'ماسح المخاطر', 'تقارير متقدمة']
              },
              { 
                plan: 'Growth', 
                desc: 'للمكاتب الجادة التي تريد ضاعفة أرباحها', 
                price: '٢٥', 
                unit: 'د.ك',
                period: '/شهر',
                popular: true,
                features: ['٢٥ سيارة في الأسطول', 'كل مميزات Starter', 'التسعير الذكي الديناميكي', 'ماسح المخاطر', 'تقارير ربحية متقدمة', 'دعم عبر واتساب'],
                disabled: ['صفحة حجز عامة']
              },
              { 
                plan: 'Pro', 
                desc: 'للمكاتب الراسخة التي تريد أقصى تحكم', 
                price: '٥٠', 
                unit: 'د.ك',
                period: '/شهر',
                features: ['٧٥ سيارة في الأسطول', 'كل مميزات Growth', 'صفحة حجز عامة للعملاء', 'بوت واتساب ذكي', 'تطبيق موبايل', 'وصول متعدد المستخدمين'],
                disabled: []
              },
            ].map((tier, i) => (
              <div key={i} className={`p-8 rounded-3xl border relative transition-all hover:-translate-y-1 ${tier.popular ? 'bg-blue-600/10 border-blue-600/40 scale-105 z-10' : 'bg-ink-lightest border-white/5'}`}>
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-blue-600 text-white text-[10px] font-black rounded-full shadow-xl shadow-blue-600/40 whitespace-nowrap">⭐ الأكثر طلباً</div>
                )}
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">للبداية</div>
                <h3 className="text-2xl font-black mb-2">{tier.plan}</h3>
                <p className="text-xs text-slate-400 mb-8 leading-relaxed">{tier.desc}</p>
                
                <div className="flex items-baseline gap-1 mb-2">
                  <span className={`text-4xl font-black ${tier.price === 'مجاني' ? 'text-emerald-500' : 'text-white'}`}>{tier.price}</span>
                  {tier.unit && <span className="text-lg font-bold text-slate-400">{tier.unit}</span>}
                  <span className="text-xs text-slate-500">{tier.period}</span>
                </div>
                {tier.price !== 'مجاني' && <div className="text-[10px] font-bold text-emerald-500 mb-8">وفّر ٢٠% مع الاشتراك السنوي</div>}
                {tier.price === 'مجاني' && <div className="h-4 mb-8" />}

                <div className="h-px bg-white/5 mb-8" />

                <ul className="space-y-4 mb-10">
                  {tier.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm font-medium text-slate-300">
                      <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                  {tier.disabled.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm font-medium text-slate-600">
                      <X className="w-4 h-4 text-slate-700 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => setView('dashboard')}
                  className={`w-full py-4 font-black rounded-2xl transition-all ${tier.popular ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/30' : tier.price === 'مجاني' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20' : 'bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10'}`}
                >
                  {tier.price === 'مجاني' ? 'ابدأ مجاناً الآن' : 'ابدأ تجربة ١٤ يوم مجاناً'}
                </button>
              </div>
            ))}
          </div>

          {/* Enterprise Banner */}
          <div className="mt-12 p-8 bg-ink-lightest border border-white/5 rounded-3xl flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">للشركات الكبرى</div>
              <h3 className="text-xl font-black mb-2">Enterprise — أسطول غير محدود + فروع متعددة</h3>
              <p className="text-sm text-slate-400">سيارات غير محدودة، إدارة فروع، White Label، API كامل، ومدير حساب مخصص.</p>
            </div>
            <button className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200 font-bold rounded-2xl transition-all whitespace-nowrap">
              تواصل معنا للتسعير ←
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24" id="testimonials">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="px-4 py-1.5 bg-blue-600/10 border border-blue-600/20 rounded-full text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-4 inline-block">💬 آراء العملاء</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">ماذا يقول أصحاب المكاتب؟</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                text: 'كنا نضيع ساعتين كل يوم في ورق وExcel. الآن كل شيء في دقيقة. وزادت أرباحنا 35% في الشهر الأول فقط.', 
                author: 'ناصر العتيبي', 
                role: 'صاحب مكتب الرياض للتأجير — الكويت',
                initial: 'ن',
                color: 'bg-blue-600'
              },
              { 
                text: 'ميزة ماسح المخاطر وحدها وفّرت علينا أكثر من ١٢٠٠ دينار خسائر من عملاء مشكلة خلال ٣ أشهر.', 
                author: 'خالد الدوسري', 
                role: 'مدير أسطول — الرياض',
                initial: 'خ',
                color: 'bg-emerald-600'
              },
              { 
                text: 'أخيراً أعرف أي سيارة رابحة وأيها خسرانة. بعت ٤ سيارات ضعيفة الأداء واشتريت سيارات أفضل — نتيجة بيانات حقيقية.', 
                author: 'عبدالله الشمري', 
                role: 'صاحب ٤٢ سيارة — الدمام',
                initial: 'ع',
                color: 'bg-purple-600'
              },
            ].map((testi, i) => (
              <div key={i} className="bg-ink-lighter border border-white/5 p-8 rounded-3xl transition-all hover:border-white/10">
                <div className="flex gap-1 text-amber-500 mb-6">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-amber-500" />)}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed italic mb-8">"{testi.text}"</p>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${testi.color}`}>
                    {testi.initial}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-200">{testi.author}</div>
                    <div className="text-[10px] text-slate-500">{testi.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6" id="contact">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-ink-lightest to-ink-lighter border border-blue-600/20 rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-blue-600/10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-600/5 blur-[100px] pointer-events-none" />
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600/10 border border-blue-600/20 rounded-full text-[10px] font-bold text-blue-400 mb-8">
              <span className="w-2 h-2 bg-blue-500 rounded-full" />
              ٢٠٠+ مكتب بدأوا رحلتهم معنا
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">جاهز تحوّل مكتبك<br />إلى ماكينة أرباح؟</h2>
            <p className="text-slate-400 text-lg mb-12 max-w-xl mx-auto">انضم الآن وابدأ مجاناً — لا بطاقة ائتمانية، لا عقود ملزمة. إعداد كامل في أقل من ٢٤ ساعة بمساعدة فريقنا.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <button 
                onClick={() => setView('dashboard')}
                className="w-full sm:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-2xl shadow-blue-600/40 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5 fill-white" />
                ابدأ مجاناً الآن
              </button>
              <button className="w-full sm:w-auto px-10 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200 font-bold rounded-2xl transition-all">
                تحدث مع فريقنا ←
              </button>
            </div>
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">🔒 آمن ومشفر بالكامل · دعم عربي متخصص · إلغاء في أي وقت</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ink-lighter border-t border-white/5 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Zap className="text-white w-5 h-5 fill-white" />
                </div>
                <span className="text-lg font-black tracking-tight">Easy<span className="text-blue-500">Rent</span></span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed max-w-xs">نظام التشغيل الذكي لمكاتب تأجير السيارات في الخليج — من الفوضى إلى الأرباح في ٢٤ ساعة.</p>
            </div>
            {[
              { title: 'المنتج', links: ['المميزات', 'الأسعار', 'تحديثات', 'خارطة الطريق'] },
              { title: 'الشركة', links: ['من نحن', 'المدونة', 'وظائف', 'تواصل معنا'] },
              { title: 'الدعم', links: ['مركز المساعدة', 'التوثيق', 'سياسة الخصوصية', 'الشروط والأحكام'] },
            ].map((col, i) => (
              <div key={i}>
                <h5 className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-6">{col.title}</h5>
                <ul className="space-y-4">
                  {col.links.map((link, j) => (
                    <li key={j}><a href="#" className="text-sm text-slate-500 hover:text-white transition-colors">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-xs text-slate-600">© ٢٠٢٥ EasyRent. جميع الحقوق محفوظة.</p>
            <div className="flex gap-4">
              {['𝕏', 'in', '▶', '💬'].map((social, i) => (
                <div key={i} className="w-8 h-8 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-xs text-slate-500 hover:text-white hover:bg-white/10 cursor-pointer transition-all">
                  {social}
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
