import React, { useState, useEffect, useRef } from 'react';
import { useCars, OFFICE_ID, PLACEHOLDER_IMAGE } from '../hooks/useCars';
import { supabase } from '../lib/supabase';
import { 
  LayoutDashboard, 
  Car, 
  FileText, 
  Users, 
  BarChart3, 
  ShieldAlert, 
  Bell, 
  Search, 
  Plus, 
  LogOut, 
  Settings, 
  ChevronRight,
  Zap,
  Wallet,
  X,
  Clock,
  Trash2,
  Gauge,
  ImageIcon
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { ContractPdfContent } from './ContractPdfContent';
import { generateAndDownloadContractPdf, type ContractPdfData } from '../utils/contractPdf';

const revenueData = [
  { name: '1', revenue: 4000 },
  { name: '2', revenue: 3000 },
  { name: '3', revenue: 5000 },
  { name: '4', revenue: 2780 },
  { name: '5', revenue: 1890 },
  { name: '6', revenue: 2390 },
  { name: '7', revenue: 3490 },
];

interface DashboardProps {
  onLogout: () => void;
}

type Section = 'dashboard' | 'fleet' | 'contracts' | 'expenses' | 'customers' | 'reports' | 'blacklist' | 'settings';

export default function Dashboard({ onLogout }: DashboardProps) {
  const { cars: carsData, loading: carsLoading, error: carsError, refetch: refetchCars } = useCars();
  const [activeSection, setActiveSection] = useState<Section>('dashboard');
  const [fleetFilter, setFleetFilter] = useState<'All' | 'Available' | 'Rented' | 'Maintenance'>('All');
  const [isQuickContractOpen, setIsQuickContractOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isEditCarModalOpen, setIsEditCarModalOpen] = useState(false);
  const [isAddCarModalOpen, setIsAddCarModalOpen] = useState(false);
  const [editingCarId, setEditingCarId] = useState<string | null>(null);
  const [fleetSearch, setFleetSearch] = useState('');
  const [contractPdfData, setContractPdfData] = useState<ContractPdfData | null>(null);
  const [contractSaving, setContractSaving] = useState(false);
  const contractPdfRef = useRef<HTMLDivElement>(null);

  const [contracts, setContracts] = useState([
    { id: "CTR-2024-001", customer: "ناصر العتيبي", car: "تويوتا كامري 2024", duration: "3 أيام", total: "450", status: "نشط", start: "04 مارس", end: "07 مارس" },
    { id: "CTR-2024-002", customer: "سارة الشمري", car: "هيونداي إلنترا 2023", duration: "2 يوم", total: "320", status: "ينتهي قريباً", start: "03 مارس", end: "05 مارس", warning: true },
    { id: "CTR-2024-003", customer: "فهد الدوسري", car: "نيسان باترول 2024", duration: "7 أيام", total: "1200", status: "نشط", start: "01 مارس", end: "08 مارس" },
  ]);

  const [contractForm, setContractForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    idNumber: '',
    car: 'Toyota Camry 2024 (أ ب ج 1234)',
    days: 1,
    dailyPrice: 15
  });

  const [expenses, setExpenses] = useState([
    { date: "05 مارس", category: "صيانة", car: "Camry 1234", desc: "تغيير زيت وفلاتر", amount: "350" },
    { date: "03 مارس", category: "تأمين", car: "Patrol 9012", desc: "تجديد تأمين شامل", amount: "4,200" },
    { date: "01 مارس", category: "تشغيل", car: "Elantra 5678", desc: "غسيل وتلميع", amount: "150" },
  ]);

  const [expenseForm, setExpenseForm] = useState({
    category: '',
    amount: '',
    car: '',
    desc: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash'
  });

  const [editCarForm, setEditCarForm] = useState({
    insurance_expiry: '',
    maintenance_date: '',
    mileage: ''
  });

  const [carForm, setCarForm] = useState({
    name: '',
    plate: '',
    status: 'Available' as 'Available' | 'Rented' | 'Maintenance',
    daily_price: '',
    image_url: '',
    mileage: '',
    is_ready: true
  });

  const playCashierSound = () => {
    try {
      // Using a more reliable public sound URL
      const audio = new Audio('https://cdn.pixabay.com/audio/2021/08/04/audio_0625c1539c.mp3');
      audio.volume = 0.4;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(e => console.log("Audio play blocked or failed:", e));
      }
    } catch (e) {
      console.error("Sound error:", e);
    }
  };

  useEffect(() => {
    if (!contractPdfData || !contractPdfRef.current) return;
    const el = contractPdfRef.current;
    const timer = setTimeout(async () => {
      try {
        await generateAndDownloadContractPdf(el, contractPdfData.contractNumber);
        playCashierSound();
      } catch (err) {
        console.error('PDF generation failed:', err);
        alert('فشل إنشاء ملف PDF');
      }
      setContractPdfData(null);
    }, 400);
    return () => clearTimeout(timer);
  }, [contractPdfData]);

  const handleConfirmAndSaveContract = async () => {
    if (!contractForm.firstName || !contractForm.lastName || !contractForm.dailyPrice) {
      alert('يرجى إكمال بيانات العميل والسعر');
      return;
    }

    const total = contractForm.days * contractForm.dailyPrice;
    const carParts = contractForm.car.includes(' (') ? contractForm.car.split(' (') : [contractForm.car, ''];
    const carName = carParts[0];
    const carPlate = carParts[1]?.replace(')', '') || '';

    const selectedCar = carsData.find((c) => `${c.name} (${c.plate})` === contractForm.car);
    if (!selectedCar) {
      alert('يرجى اختيار سيارة من القائمة. تأكد من وجود سيارات في الأسطول.');
      return;
    }

    setContractSaving(true);

    try {
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .insert({
          office_id: OFFICE_ID,
          full_name: `${contractForm.firstName} ${contractForm.lastName}`,
          phone: contractForm.phone || null,
          id_number: contractForm.idNumber || null,
          status: 'Active'
        })
        .select('id')
        .single();

      if (customerError) {
        setContractSaving(false);
        alert('فشل حفظ بيانات العميل: ' + customerError.message);
        return;
      }

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + contractForm.days);
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];

      const { data: contractData, error: contractError } = await supabase
        .from('contracts')
        .insert({
          office_id: OFFICE_ID,
          car_id: selectedCar.id,
          customer_id: customerData.id,
          days: contractForm.days,
          total,
          daily_price: contractForm.dailyPrice,
          status: 'Active',
          start_date: startDateStr,
          end_date: endDateStr
        })
        .select('id')
        .single();

      if (contractError) {
        setContractSaving(false);
        alert('فشل حفظ العقد: ' + contractError.message);
        return;
      }

      const contractNumber = `Contract_${contractData.id.slice(0, 8).toUpperCase()}`;
      const pdfData: ContractPdfData = {
        contractNumber,
        customerName: `${contractForm.firstName} ${contractForm.lastName}`,
        phone: contractForm.phone,
        idNumber: contractForm.idNumber,
        carName,
        carPlate,
        days: contractForm.days,
        dailyPrice: contractForm.dailyPrice,
        total,
        startDate: startDate.toLocaleDateString('ar-KW'),
        endDate: endDate.toLocaleDateString('ar-KW'),
      };

      setContractPdfData(pdfData);

      const entry = {
        id: contractData.id,
        customer: pdfData.customerName,
        car: carName,
        duration: `${contractForm.days} أيام`,
        total: total.toLocaleString(),
        status: "نشط",
        start: pdfData.startDate,
        end: pdfData.endDate
      };
      setContracts([entry, ...contracts]);
      setIsQuickContractOpen(false);
      setContractForm({
        firstName: '',
        lastName: '',
        phone: '',
        idNumber: '',
        car: carsData.length > 0 ? `${carsData[0].name} (${carsData[0].plate})` : 'Toyota Camry 2024 (أ ب ج 1234)',
        days: 1,
        dailyPrice: 15
      });
    } catch (err) {
      setContractSaving(false);
      alert('حدث خطأ غير متوقع: ' + (err instanceof Error ? err.message : 'فشل الحفظ'));
      return;
    } finally {
      setContractSaving(false);
    }
  };

  const handleSaveExpense = () => {
    if (!expenseForm.category || !expenseForm.amount) {
      alert('يرجى إدخال الفئة والمبلغ');
      return;
    }

    const newExpense = {
      date: expenseForm.date,
      category: expenseForm.category,
      car: expenseForm.car || 'مصروف عام',
      desc: expenseForm.desc,
      amount: parseInt(expenseForm.amount).toLocaleString()
    };

    setExpenses([newExpense, ...expenses]);
    playCashierSound();
    setIsExpenseModalOpen(false);
    setExpenseForm({
      category: '',
      amount: '',
      car: '',
      desc: '',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'cash'
    });
  };

  const handleOpenEditCar = (car: { id: string; insurance_expiry?: string | null; maintenance_date?: string | null; mileage?: number | null }) => {
    setEditingCarId(car.id);
    setEditCarForm({
      insurance_expiry: car.insurance_expiry?.split('T')[0] ?? '',
      maintenance_date: car.maintenance_date?.split('T')[0] ?? '',
      mileage: car.mileage != null ? String(car.mileage) : ''
    });
    setIsEditCarModalOpen(true);
  };

  const handleSaveCarUpdate = async () => {
    if (!editingCarId) return;

    const mileageNum = editCarForm.mileage.trim() ? parseInt(editCarForm.mileage, 10) : null;
    if (editCarForm.mileage.trim() && (isNaN(mileageNum!) || mileageNum! < 0)) {
      alert('يرجى إدخال قراءة عداد صحيحة');
      return;
    }

    const { error } = await supabase
      .from('cars')
      .update({
        insurance_expiry: editCarForm.insurance_expiry || null,
        maintenance_date: editCarForm.maintenance_date || null,
        mileage: mileageNum !== null ? Number(mileageNum) : null
      })
      .eq('id', editingCarId);

    if (error) {
      alert('فشل تحديث البيانات: ' + error.message);
      return;
    }

    playCashierSound();
    refetchCars();
    setIsEditCarModalOpen(false);
    setEditingCarId(null);
    setEditCarForm({ insurance_expiry: '', maintenance_date: '', mileage: '' });
  };

  const handleDeleteCar = async (carId: string, carName: string) => {
    if (!window.confirm(`هل أنت متأكد من حذف السيارة "${carName}"؟ لا يمكن التراجع عن هذا الإجراء.`)) return;

    const { error } = await supabase.from('cars').delete().eq('id', carId);

    if (error) {
      alert('فشل حذف السيارة: ' + error.message);
      return;
    }

    playCashierSound();
    refetchCars();
  };

  const handleSaveCar = async () => {
    if (!carForm.name.trim()) {
      alert('يرجى إدخال اسم السيارة');
      return;
    }
    const dailyPrice = parseFloat(carForm.daily_price);
    if (isNaN(dailyPrice) || dailyPrice < 0) {
      alert('يرجى إدخال سعر يومي صحيح');
      return;
    }

    const mileageNum = carForm.mileage.trim() ? parseInt(carForm.mileage, 10) : null;
    if (carForm.mileage.trim() && (isNaN(mileageNum!) || mileageNum! < 0)) {
      alert('يرجى إدخال قراءة عداد صحيحة');
      return;
    }

    const { error } = await supabase.from('cars').insert({
      office_id: OFFICE_ID,
      name: carForm.name.trim(),
      plate: carForm.plate.trim() || null,
      status: carForm.status,
      daily_price: dailyPrice,
      image_url: carForm.image_url.trim() || null,
      mileage: mileageNum !== null ? Number(mileageNum) : null,
      is_ready: carForm.is_ready
    });

    if (error) {
      alert('فشل إضافة السيارة: ' + error.message);
      return;
    }

    playCashierSound();
    refetchCars();
    setIsAddCarModalOpen(false);
    setCarForm({
      name: '',
      plate: '',
      status: 'Available',
      daily_price: '',
      image_url: '',
      mileage: '',
      is_ready: true
    });
  };

  const handleToggleCarReady = async (carId: string, currentReady: boolean) => {
    const { error } = await supabase.from('cars').update({ is_ready: !currentReady }).eq('id', carId);
    if (error) {
      alert('فشل التحديث: ' + error.message);
      return;
    }
    refetchCars();
  };

  const filteredByStatus = fleetFilter === 'All' 
    ? carsData 
    : carsData.filter(car => car.status === fleetFilter);

  const searchLower = fleetSearch.trim().toLowerCase();
  const filteredCars = searchLower
    ? filteredByStatus.filter(car => 
        car.name.toLowerCase().includes(searchLower) || 
        car.plate.toLowerCase().includes(searchLower)
      )
    : filteredByStatus;

  const handleDeleteContract = (id: string) => {
    console.log("Attempting to delete contract:", id);
    if (window.confirm('هل أنت متأكد من حذف هذا العقد؟')) {
      setContracts(prev => {
        const filtered = prev.filter(c => c.id !== id);
        console.log("Contracts after deletion:", filtered.length);
        return filtered;
      });
    }
  };

  const handleExtendContract = (id: string) => {
    console.log("Attempting to extend contract:", id);
    const daysStr = window.prompt('كم عدد الأيام الإضافية للتمديد؟', '1');
    if (daysStr) {
      const additionalDays = parseInt(daysStr);
      if (!isNaN(additionalDays) && additionalDays > 0) {
        setContracts(prev => prev.map(c => {
          if (c.id === id) {
            try {
              const currentTotal = parseInt(c.total.replace(/,/g, '')) || 0;
              const currentDays = parseInt(c.duration.split(' ')[0]) || 1;
              const dailyRate = Math.round(currentTotal / currentDays);
              const newTotal = currentTotal + (dailyRate * additionalDays);
              const newDuration = (currentDays + additionalDays) + ' أيام';
              
              playCashierSound();
              return { ...c, duration: newDuration, total: newTotal.toLocaleString(), extended: true };
            } catch (e) {
              console.error("Extension error:", e);
              return c;
            }
          }
          return c;
        }));
      }
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-black mb-1 text-slate-800">لوحة التحكم</h1>
                <p className="text-sm text-slate-500">نظرة شاملة على أداء مكتبك اليوم.</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">تحديث البيانات</button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard label="إجمالي الدخل" value="84,230" unit="د.ك" trend="+12.5%" trendUp />
              <StatCard label="السيارات المتاحة" value="18" unit="سيارة" trend="إشغال 75%" trendUp />
              <StatCard label="العقود النشطة" value="34" unit="عقد" trend="عقدان ينتهيان اليوم" trendUp={false} />
              <StatCard label="الربح الصافي" value="61,400" unit="د.ك" trend="هامش 73%" trendUp />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2 bg-white border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-3xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-bold text-slate-400">🔔 التنبيهات والإشعارات</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl group hover:border-blue-500/30 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-500">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="text-sm font-bold">عقد ينتهي اليوم</h4>
                        <span className="text-[10px] text-slate-500 font-bold">الآن</span>
                      </div>
                      <p className="text-xs text-slate-400">العميل سارة الشمري - سيارة هيونداي إلنترا (د هـ و 5678)</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl group hover:border-amber-500/30 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-500">
                      <Settings className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="text-sm font-bold">صيانة دورية مطلوبة</h4>
                        <span className="text-[10px] text-slate-500 font-bold">بعد 7 أيام</span>
                      </div>
                      <p className="text-xs text-slate-400">سيارة تويوتا كامري (أ ب ج 1234) - تجاوزت 5000 كم منذ آخر صيانة</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl group hover:border-red-500/30 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-500">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="text-sm font-bold">انتهاء تأمين المركبة</h4>
                        <span className="text-[10px] text-slate-500 font-bold">بعد 10 أيام</span>
                      </div>
                      <p className="text-xs text-slate-400">نيسان باترول (ز ح ط 9012) - يرجى تجديد وثيقة التأمين لتجنب الغرامات</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-3xl p-6">
                <h3 className="text-sm font-bold text-slate-400 mb-6">🚗 حالة الأسطول</h3>
                <div className="space-y-6">
                  <FleetStatusItem label="متاحة" count={18} pct={46} color="bg-emerald-500" />
                  <FleetStatusItem label="مؤجرة" count={31} pct={79} color="bg-blue-500" />
                  <FleetStatusItem label="صيانة" count={5} pct={13} color="bg-amber-500" />
                  <FleetStatusItem label="خارج الخدمة" count={2} pct={5} color="bg-red-500" />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-3xl overflow-hidden">
              <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-400">📄 آخر العقود النشطة</h3>
                <button onClick={() => setActiveSection('contracts')} className="text-xs font-bold text-blue-500 hover:underline">عرض الكل</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead>
                    <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200">
                      <th className="px-6 py-4">العميل</th>
                      <th className="px-6 py-4">السيارة</th>
                      <th className="px-6 py-4">تاريخ البدء</th>
                      <th className="px-6 py-4">تاريخ الانتهاء</th>
                      <th className="px-6 py-4">المبلغ</th>
                      <th className="px-6 py-4">الحالة</th>
                      <th className="px-6 py-4 text-left">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {contracts.slice(0, 3).map((contract) => (
                      <ActivityRow 
                        key={contract.id}
                        name={contract.customer} 
                        car={contract.car} 
                        start={contract.start} 
                        end={contract.end} 
                        amount={`${contract.total} د.ك`} 
                        status={contract.status} 
                        warning={contract.status === 'ينتهي قريباً'}
                        extended={(contract as any).extended}
                        onDelete={() => handleDeleteContract(contract.id)}
                        onExtend={() => handleExtendContract(contract.id)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        );
      case 'reports':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black mb-1">التقارير المالية والتحليلات</h1>
                <p className="text-sm text-slate-500">تحليل معمق للأداء المالي وكفاءة التشغيل.</p>
              </div>
              <div className="flex gap-3">
                <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold focus:outline-none">
                  <option>الربع الأول 2024</option>
                  <option>الربع الرابع 2023</option>
                </select>
                <button className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  تصدير PDF
                </button>
              </div>
            </div>

            {/* Financial Summary Bento */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-3xl p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-bold text-lg">تحليل الإيرادات والمصاريف</h3>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full" />
                      <span className="text-slate-400">الإيرادات</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <span className="text-slate-400">المصاريف</span>
                    </div>
                  </div>
                </div>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                      <XAxis dataKey="name" hide />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0b1628', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#2563eb" fillOpacity={1} fill="url(#colorRev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-6 rounded-3xl">
                  <div className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">صافي الأرباح المتوقع</div>
                  <div className="text-3xl font-black text-emerald-500 mb-2">142,500 <span className="text-sm font-medium">د.ك</span></div>
                  <div className="text-xs text-slate-400">بناءً على معدل الإشغال الحالي (82%)</div>
                </div>
                <div className="bg-white border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-6 rounded-3xl">
                  <div className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">العائد على الاستثمار (ROI)</div>
                  <div className="text-3xl font-black text-blue-400 mb-2">24.8%</div>
                  <div className="text-xs text-slate-400">+3.2% عن الربع السابق</div>
                </div>
                <div className="bg-white border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-6 rounded-3xl">
                  <div className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">متوسط قيمة العقد</div>
                  <div className="text-3xl font-black text-white mb-2">840 <span className="text-sm font-medium">د.ك</span></div>
                  <div className="text-xs text-slate-400">متوسط مدة التأجير: 4.2 أيام</div>
                </div>
              </div>
            </div>

            {/* Detailed Performance Table */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-3xl overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                  <h3 className="font-bold">أداء فئات السيارات</h3>
                </div>
                <table className="w-full text-right">
                  <thead>
                    <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200">
                      <th className="px-6 py-4">الفئة</th>
                      <th className="px-6 py-4">نسبة الإشغال</th>
                      <th className="px-6 py-4">صافي الربح</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold">اقتصادية (سيدان)</td>
                      <td className="px-6 py-4">85%</td>
                      <td className="px-6 py-4 text-emerald-500 font-bold">28,400 د.ك</td>
                    </tr>
                    <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold">دفع رباعي (SUV)</td>
                      <td className="px-6 py-4">72%</td>
                      <td className="px-6 py-4 text-emerald-500 font-bold">41,200 د.ك</td>
                    </tr>
                    <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold">فاخرة</td>
                      <td className="px-6 py-4">45%</td>
                      <td className="px-6 py-4 text-emerald-500 font-bold">18,900 د.ك</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-white border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-3xl p-6">
                <h3 className="font-bold mb-6">توزيع الإيرادات حسب القناة</h3>
                <div className="space-y-4">
                  {[
                    { label: 'حجز مباشر (المكتب)', value: '65%', color: 'bg-blue-500' },
                    { label: 'تطبيق الموبايل', value: '25%', color: 'bg-purple-500' },
                    { label: 'مواقع الشركاء', value: '10%', color: 'bg-slate-500' },
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col gap-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-400">{item.label}</span>
                        <span className="text-slate-700">{item.value}</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color}`} style={{ width: item.value }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Customers & Cars */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-3xl p-6">
                <h3 className="text-sm font-bold text-slate-400 mb-6">🏆 أفضل 3 سيارات ربحية</h3>
                <div className="space-y-4">
                  {[
                    { name: 'Mercedes S-Class', rev: '12,400 د.ك', img: 'https://picsum.photos/seed/mercedes/100/100' },
                    { name: 'Nissan Patrol', rev: '9,800 د.ك', img: 'https://picsum.photos/seed/patrol/100/100' },
                    { name: 'Lexus ES', rev: '7,200 د.ك', img: 'https://picsum.photos/seed/lexus/100/100' },
                  ].map((car, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10">
                        <img src={car.img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-bold">{car.name}</div>
                        <div className="text-[10px] text-emerald-500 font-bold">{car.rev}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-3xl p-6">
                <h3 className="text-sm font-bold text-slate-400 mb-6">💎 عملاء الـ VIP الأكثر ولاءً</h3>
                <div className="space-y-4">
                  {[
                    { name: 'فهد الدوسري', rentals: '24 إيجار', color: 'bg-amber-500' },
                    { name: 'ناصر العتيبي', rentals: '12 إيجار', color: 'bg-blue-500' },
                    { name: 'سارة الشمري', rentals: '8 إيجارات', color: 'bg-purple-500' },
                  ].map((user, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full ${user.color} flex items-center justify-center text-xs font-black`}>
                        {user.name[0]}
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-bold">{user.name}</div>
                        <div className="text-[10px] text-slate-500 font-bold">{user.rentals}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-3xl p-6 flex flex-col justify-center text-center">
                <div className="text-blue-500 mb-4">
                  <Zap className="w-10 h-10 mx-auto fill-blue-500" />
                </div>
                <h3 className="font-bold mb-2">تحسين الأرباح</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  بناءً على تحليلاتنا، يمكنك زيادة أرباحك بنسبة <span className="text-emerald-500 font-bold">15%</span> عبر رفع أسعار فئة الـ SUV في عطلة نهاية الأسبوع.
                </p>
                <button className="mt-6 py-2 bg-blue-600/10 border border-blue-600/20 text-blue-400 text-xs font-bold rounded-xl hover:bg-blue-600/20 transition-all">تفعيل التوصية</button>
              </div>
            </div>
          </div>
        );
      case 'expenses':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black mb-1">إدارة المصاريف</h1>
                <p className="text-sm text-slate-500">تتبع مصاريف الصيانة، التأمين، والتشغيل.</p>
              </div>
              <button 
                onClick={() => setIsExpenseModalOpen(true)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                إضافة مصروف
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard label="مصاريف الشهر" value="12,450" unit="د.ك" trend="+5.2%" trendUp={false} />
              <StatCard label="متوسط مصروف السيارة" value="518" unit="د.ك" trend="-2.1%" trendUp />
              <StatCard label="أعلى بند مصروف" value="الصيانة" unit="" trend="45% من الإجمالي" trendUp={false} />
            </div>
            <div className="bg-white border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-3xl overflow-hidden">
              <table className="w-full text-right">
                <thead>
                  <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200">
                    <th className="px-6 py-4">التاريخ</th>
                    <th className="px-6 py-4">الفئة</th>
                    <th className="px-6 py-4">السيارة</th>
                    <th className="px-6 py-4">الوصف</th>
                    <th className="px-6 py-4">المبلغ</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {expenses.map((expense, index) => (
                    <ExpenseRow 
                      key={index}
                      date={expense.date} 
                      category={expense.category} 
                      car={expense.car} 
                      desc={expense.desc} 
                      amount={expense.amount} 
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'fleet':
        const availableCount = carsData.filter(c => c.status === 'Available').length;
        const rentedCount = carsData.filter(c => c.status === 'Rented').length;
        const maintenanceCount = carsData.filter(c => c.status === 'Maintenance').length;

        return (
          <div className="space-y-8">
            {carsError && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 text-red-500 shrink-0" />
                <div>
                  <div className="font-bold text-red-400">فشل تحميل السيارات</div>
                  <div className="text-sm text-slate-400">{carsError}</div>
                </div>
              </div>
            )}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black mb-1">إدارة الأسطول</h1>
                <p className="text-sm text-slate-500">نظرة شاملة على حالة سياراتك اليوم.</p>
              </div>
              <button 
                onClick={() => setIsAddCarModalOpen(true)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                إضافة سيارة جديدة
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="بحث بالاسم أو رقم اللوحة..." 
                value={fleetSearch}
                onChange={(e) => setFleetSearch(e.target.value)}
                className="w-full max-w-sm bg-white border border-slate-200 rounded-xl py-2.5 pr-10 pl-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors shadow-sm" 
              />
            </div>

            {/* Fleet Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-6 rounded-3xl flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-widest">سيارات متاحة</div>
                  <div className="text-2xl font-black text-emerald-500">{carsLoading ? '...' : availableCount}</div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <Car className="w-6 h-6" />
                </div>
              </div>
              <div className="bg-white border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-6 rounded-3xl flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-widest">سيارات مؤجرة</div>
                  <div className="text-2xl font-black text-blue-500">{carsLoading ? '...' : rentedCount}</div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <Zap className="w-6 h-6" />
                </div>
              </div>
              <div className="bg-white border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-6 rounded-3xl flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-widest">في الصيانة</div>
                  <div className="text-2xl font-black text-amber-500">{carsLoading ? '...' : maintenanceCount}</div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <Settings className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex gap-2 p-1 bg-white border border-slate-200 rounded-2xl w-fit shadow-sm">
              {(['All', 'Available', 'Rented', 'Maintenance'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setFleetFilter(filter)}
                  className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
                    fleetFilter === filter 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  {filter === 'All' ? 'الكل' : 
                   filter === 'Available' ? 'متاحة' : 
                   filter === 'Rented' ? 'مؤجرة' : 'صيانة'}
                </button>
              ))}
            </div>

            <div className="bg-white border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-3xl overflow-hidden">
              <table className="w-full text-right">
                <thead>
                  <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200">
                    <th className="px-6 py-4">السيارة والموديل</th>
                    <th className="px-6 py-4">رقم اللوحة</th>
                    <th className="px-6 py-4">قراءة العداد</th>
                    <th className="px-6 py-4">الحالة</th>
                    <th className="px-6 py-4">السعر اليومي</th>
                    <th className="px-6 py-4 text-left">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {carsLoading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center gap-3 text-slate-500">
                          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                          <span className="text-sm font-bold">جاري تحميل السيارات...</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredCars.map((car) => (
                      <CarRow 
                        key={car.id}
                        car={car}
                        onEdit={() => handleOpenEditCar(car)}
                        onDelete={() => handleDeleteCar(car.id, car.name)}
                        onToggleReady={() => handleToggleCarReady(car.id, car.is_ready)}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'contracts':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black mb-1">العقود والاتفاقيات</h1>
                <p className="text-sm text-slate-500">إدارة عقود التأجير الحالية والسابقة.</p>
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="text" placeholder="بحث برقم العقد..." className="bg-white/5 border border-white/10 rounded-xl py-2 pr-10 pl-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20/50" />
                </div>
                <button 
                  onClick={() => setIsQuickContractOpen(true)}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  عقد في دقيقة
                </button>
              </div>
            </div>
            <div className="bg-white border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-3xl overflow-hidden">
              <table className="w-full text-right">
                <thead>
                  <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200">
                    <th className="px-6 py-4">رقم العقد</th>
                    <th className="px-6 py-4">العميل</th>
                    <th className="px-6 py-4">السيارة</th>
                    <th className="px-6 py-4">المدة</th>
                    <th className="px-6 py-4">المبلغ الإجمالي</th>
                    <th className="px-6 py-4">الحالة</th>
                    <th className="px-6 py-4 text-left">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {contracts.map((contract) => (
                    <ContractRow 
                      key={contract.id}
                      id={contract.id} 
                      customer={contract.customer} 
                      car={contract.car} 
                      duration={contract.duration} 
                      total={contract.total} 
                      status={contract.status === 'نشط' ? 'Active' : contract.status === 'ينتهي قريباً' ? 'Overdue' : 'Completed'} 
                      warning={contract.status === 'ينتهي قريباً'} 
                      extended={(contract as any).extended}
                      onDelete={() => handleDeleteContract(contract.id)}
                      onExtend={() => handleExtendContract(contract.id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'customers':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black mb-1">قاعدة بيانات العملاء</h1>
                <p className="text-sm text-slate-500">لديك 1,240 عميل مسجل.</p>
              </div>
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all flex items-center gap-2">
                <Plus className="w-4 h-4" />
                إضافة عميل
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <CustomerCard name="ناصر العتيبي" rentals={12} rating={4.8} status="Premium" />
              <CustomerCard name="سارة الشمري" rentals={5} rating={4.5} status="Regular" />
              <CustomerCard name="فهد الدوسري" rentals={24} rating={5.0} status="VIP" />
              <CustomerCard name="نورة القحطاني" rentals={2} rating={4.2} status="New" />
            </div>
          </div>
        );
      case 'blacklist':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black mb-1">القائمة السوداء</h1>
                <p className="text-sm text-slate-500">إدارة العملاء المحظورين لأسباب أمنية أو مالية.</p>
              </div>
              <button className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all flex items-center gap-2">
                <Plus className="w-4 h-4" />
                إضافة للقائمة السوداء
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-3xl">
                <div className="text-[10px] font-bold text-red-400 mb-1 uppercase tracking-widest">إجمالي المحظورين</div>
                <div className="text-2xl font-black text-red-500">12</div>
              </div>
              <div className="bg-white border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-6 rounded-3xl">
                <div className="text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-widest">أضيفوا هذا الشهر</div>
                <div className="text-2xl font-black text-white">2</div>
              </div>
              <div className="bg-white border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-6 rounded-3xl">
                <div className="text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-widest">طلبات مراجعة</div>
                <div className="text-2xl font-black text-blue-500">3</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-3xl overflow-hidden">
              <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-400">قائمة العملاء المحظورين</h3>
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="text" placeholder="بحث بالاسم أو الهوية..." className="bg-white border border-slate-200 rounded-xl py-2 pr-10 pl-4 text-xs focus:outline-none focus:border-red-600/50" />
                </div>
              </div>
              <table className="w-full text-right">
                <thead>
                  <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200">
                    <th className="px-6 py-4">العميل</th>
                    <th className="px-6 py-4">رقم الهوية</th>
                    <th className="px-6 py-4">سبب الحظر</th>
                    <th className="px-6 py-4">تاريخ الإضافة</th>
                    <th className="px-6 py-4">الإجراء</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 text-[10px] font-black">م خ</div>
                        <div className="font-bold">محمد خالد العتيبي</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400">1092348572</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-red-500/10 text-red-500 rounded text-[10px] font-bold">مماطلة في السداد</span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">12 يناير 2024</td>
                    <td className="px-6 py-4">
                      <button className="text-xs text-blue-500 hover:underline font-bold">رفع الحظر</button>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 text-[10px] font-black">س ع</div>
                        <div className="font-bold">سلطان علي القحطاني</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400">1029384756</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-red-500/10 text-red-500 rounded text-[10px] font-bold">حادث بليغ مع هروب</span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">05 فبراير 2024</td>
                    <td className="px-6 py-4">
                      <button className="text-xs text-blue-500 hover:underline font-bold">رفع الحظر</button>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 text-[10px] font-black">ر ش</div>
                        <div className="font-bold">راكان الشمري</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400">1102938475</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-red-500/10 text-red-500 rounded text-[10px] font-bold">سرقة أجزاء من المركبة</span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">20 فبراير 2024</td>
                    <td className="px-6 py-4">
                      <button className="text-xs text-blue-500 hover:underline font-bold">رفع الحظر</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-black mb-1">الاعدادات</h1>
              <p className="text-sm text-slate-500">تخصيص إعدادات مكتبك وحسابك.</p>
            </div>
            <div className="max-w-2xl bg-white border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-3xl p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400">اسم المكتب</label>
                <input type="text" defaultValue="مكتب إيزي رينت لتاجير السيارات" className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400">البريد الإلكتروني للإشعارات</label>
                <input type="email" defaultValue="admin@easyrent.com" className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
              </div>
              <div className="flex items-center justify-between py-4 border-t border-white/5">
                <div>
                  <div className="font-bold">إشعارات الرسائل القصيرة</div>
                  <div className="text-xs text-slate-500">إرسال رسالة للعميل عند بدء العقد</div>
                </div>
                <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full translate-x-6 transition-transform" />
                </div>
              </div>
              <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all">حفظ التغييرات</button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex" dir="rtl" style={{ backgroundColor: '#F8F9FA' }}>
      {/* Hidden div for PDF generation - in viewport but invisible for html2canvas */}
      <div
        ref={contractPdfRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '210mm',
          visibility: 'hidden',
          zIndex: -1,
          pointerEvents: 'none',
        }}
      >
        {contractPdfData && <ContractPdfContent data={contractPdfData} />}
      </div>

      {/* Sidebar - Dark Navy #1A1C1E */}
      <aside className="w-64 flex flex-col shrink-0" style={{ backgroundColor: '#1A1C1E' }}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="text-lg font-black tracking-tight text-white">Easy<span className="text-blue-400">Rent</span></span>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <NavItem 
            icon={<LayoutDashboard className="w-5 h-5" />} 
            label="لوحة التحكم" 
            active={activeSection === 'dashboard'} 
            onClick={() => setActiveSection('dashboard')}
          />
          <NavItem 
            icon={<Car className="w-5 h-5" />} 
            label="الاسطول" 
            active={activeSection === 'fleet'} 
            onClick={() => setActiveSection('fleet')}
          />
          <NavItem 
            icon={<FileText className="w-5 h-5" />} 
            label="العقود" 
            active={activeSection === 'contracts'} 
            onClick={() => setActiveSection('contracts')}
          />
          <NavItem 
            icon={<Wallet className="w-5 h-5" />} 
            label="المصاريف" 
            active={activeSection === 'expenses'} 
            onClick={() => setActiveSection('expenses')}
          />
          <NavItem 
            icon={<Users className="w-5 h-5" />} 
            label="العملاء" 
            active={activeSection === 'customers'} 
            onClick={() => setActiveSection('customers')}
          />
          <NavItem 
            icon={<BarChart3 className="w-5 h-5" />} 
            label="التقارير" 
            active={activeSection === 'reports'} 
            onClick={() => setActiveSection('reports')}
          />
          <NavItem 
            icon={<ShieldAlert className="w-5 h-5" />} 
            label="القائمة السوداء" 
            active={activeSection === 'blacklist'} 
            onClick={() => setActiveSection('blacklist')}
          />
        </nav>

        <div className="p-4 border-t border-white/10 space-y-1">
          <NavItem 
            icon={<Settings className="w-5 h-5" />} 
            label="الاعدادات" 
            active={activeSection === 'settings'} 
            onClick={() => setActiveSection('settings')}
          />
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main Content - Light gray #F8F9FA */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#F8F9FA]">
        {/* Topbar - White with search + Bell prominent */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="ابحث عن سيارة، عقد، أو عميل..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pr-10 pl-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block text-left">
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">مرحباً بك،</div>
              <div className="text-sm font-black text-slate-800">ناصر 👋</div>
            </div>
            <button className="p-2.5 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl relative transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-sm" />
            </button>
            <button 
              onClick={() => setIsQuickContractOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20"
            >
              <Zap className="w-4 h-4 fill-white" />
              عقد في دقيقة
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 border border-white/10" />
          </div>
        </header>

        {/* Quick Contract Modal */}
        <AnimatePresence>
          {isQuickContractOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsQuickContractOpen(false)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                        <Zap className="w-6 h-6 fill-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-slate-800">عقد في دقيقة</h2>
                        <p className="text-xs text-slate-500">أسرع طريقة لإنشاء عقد تأجير قانوني.</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsQuickContractOpen(false)}
                      className="p-2 hover:bg-slate-50 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5 text-slate-500" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">اسم العميل</label>
                        <input 
                          type="text" 
                          placeholder="الاسم الأول" 
                          value={contractForm.firstName}
                          onChange={(e) => setContractForm({...contractForm, firstName: e.target.value})}
                          className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">لقب العميل</label>
                        <input 
                          type="text" 
                          placeholder="العائلة" 
                          value={contractForm.lastName}
                          onChange={(e) => setContractForm({...contractForm, lastName: e.target.value})}
                          className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">رقم الهاتف</label>
                        <input 
                          type="tel" 
                          placeholder="965XXXXXXXX" 
                          value={contractForm.phone}
                          onChange={(e) => setContractForm({...contractForm, phone: e.target.value})}
                          className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors text-left"
                          dir="ltr"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">رقم بطاقة الهوية</label>
                        <input 
                          type="text" 
                          placeholder="رقم الهوية / المدنية" 
                          value={contractForm.idNumber}
                          onChange={(e) => setContractForm({...contractForm, idNumber: e.target.value})}
                          className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">السيارة</label>
                      <select 
                        value={contractForm.car}
                        onChange={(e) => setContractForm({...contractForm, car: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 appearance-none"
                      >
                        {carsData.length > 0 ? (
                          carsData.map((c) => (
                            <option key={c.id} value={`${c.name} (${c.plate})`}>{c.name} ({c.plate})</option>
                          ))
                        ) : (
                          <>
                            <option value="Toyota Camry 2024 (أ ب ج 1234)">Toyota Camry 2024 (أ ب ج 1234)</option>
                            <option value="Nissan Patrol 2024 (ز ح ط 9012)">Nissan Patrol 2024 (ز ح ط 9012)</option>
                            <option value="Lexus ES 2023 (م ن س 7890)">Lexus ES 2023 (م ن س 7890)</option>
                          </>
                        )}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">المدة (أيام)</label>
                        <input 
                          type="number" 
                          value={contractForm.days}
                          onChange={(e) => setContractForm({...contractForm, days: parseInt(e.target.value) || 1})}
                          className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">السعر اليومي</label>
                        <input 
                          type="number" 
                          placeholder="15"
                          value={contractForm.dailyPrice}
                          onChange={(e) => setContractForm({...contractForm, dailyPrice: parseInt(e.target.value) || 0})}
                          className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">الإجمالي</label>
                        <div className="w-full bg-blue-600/10 border border-blue-600/20 rounded-xl py-3 px-4 text-sm font-black text-blue-400">
                          {contractForm.days * contractForm.dailyPrice} د.ك
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button 
                        onClick={handleConfirmAndSaveContract}
                        disabled={contractSaving}
                        className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black rounded-2xl shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
                      >
                        {contractSaving ? (
                          <>
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            جاري حفظ العقد...
                          </>
                        ) : (
                          <>
                            <FileText className="w-5 h-5" />
                            طباعة PDF
                          </>
                        )}
                      </button>
                      <button 
                        onClick={() => setIsQuickContractOpen(false)}
                        className="px-8 py-4 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-all"
                      >
                        إلغاء
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
 
        {/* Expense Modal */}
        <AnimatePresence>
          {isExpenseModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsExpenseModalOpen(false)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-600/30">
                        <Wallet className="w-6 h-6 fill-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-black">إضافة مصروف جديد</h2>
                        <p className="text-xs text-slate-500">تسجيل المصاريف التشغيلية والإدارية.</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsExpenseModalOpen(false)}
                      className="p-2 hover:bg-slate-50 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5 text-slate-500" />
                    </button>
                  </div>
 
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">فئة المصروف</label>
                        <select 
                          value={expenseForm.category}
                          onChange={(e) => setExpenseForm({...expenseForm, category: e.target.value})}
                          className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 appearance-none"
                        >
                          <option value="">اختر الفئة...</option>
                          <option value="صيانة دورية">صيانة دورية</option>
                          <option value="تأمين وتراخيص">تأمين وتراخيص</option>
                          <option value="وقود وزيوت">وقود وزيوت</option>
                          <option value="رواتب وعمولات">رواتب وعمولات</option>
                          <option value="إيجار المكتب">إيجار المكتب</option>
                          <option value="مخالفات مرورية">مخالفات مرورية</option>
                          <option value="فواتير">فواتير (كهرباء/ماء/إنترنت)</option>
                          <option value="تسويق وإعلانات">تسويق وإعلانات</option>
                          <option value="مصاريف أخرى">مصاريف أخرى</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">المبلغ (د.ك)</label>
                        <input 
                          type="number" 
                          placeholder="0.00" 
                          value={expenseForm.amount}
                          onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})}
                          className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                        />
                      </div>
                    </div>
 
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">السيارة المرتبطة (اختياري)</label>
                      <select 
                        value={expenseForm.car}
                        onChange={(e) => setExpenseForm({...expenseForm, car: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 appearance-none"
                      >
                        <option value="">لا يوجد - مصروف عام</option>
                        {carsData.map(car => (
                          <option key={car.id} value={car.name}>{car.name} ({car.plate})</option>
                        ))}
                      </select>
                    </div>
 
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">وصف المصروف</label>
                      <textarea 
                        rows={3}
                        placeholder="مثال: تغيير زيت المحرك، دفع فاتورة الكهرباء لشهر مارس..."
                        value={expenseForm.desc}
                        onChange={(e) => setExpenseForm({...expenseForm, desc: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors resize-none"
                      />
                    </div>
 
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">تاريخ المصروف</label>
                        <input 
                          type="date" 
                          value={expenseForm.date}
                          onChange={(e) => setExpenseForm({...expenseForm, date: e.target.value})}
                          className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">طريقة الدفع</label>
                        <select 
                          value={expenseForm.paymentMethod}
                          onChange={(e) => setExpenseForm({...expenseForm, paymentMethod: e.target.value})}
                          className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 appearance-none"
                        >
                          <option value="cash">نقداً (كاش)</option>
                          <option value="knet">كي نت (K-Net)</option>
                          <option value="transfer">تحويل بنكي</option>
                          <option value="credit">بطاقة ائتمان</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button 
                        onClick={handleSaveExpense}
                        className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-black rounded-2xl shadow-xl shadow-red-600/30 transition-all flex items-center justify-center gap-2"
                      >
                        <Wallet className="w-5 h-5 fill-white" />
                        حفظ المصروف
                      </button>
                      <button 
                        onClick={() => setIsExpenseModalOpen(false)}
                        className="w-full mt-3 py-4 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-all"
                      >
                        إلغاء
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Edit Car Modal */}
        <AnimatePresence>
          {isEditCarModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsEditCarModalOpen(false)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-black">تنبيهات التأمين والصيانة</h2>
                    <button 
                      onClick={() => setIsEditCarModalOpen(false)}
                      className="p-2 hover:bg-slate-50 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5 text-slate-500" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">تاريخ انتهاء التأمين</label>
                      <input 
                        type="date" 
                        value={editCarForm.insurance_expiry}
                        onChange={(e) => setEditCarForm({...editCarForm, insurance_expiry: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">موعد الصيانة القادم</label>
                      <input 
                        type="date" 
                        value={editCarForm.maintenance_date}
                        onChange={(e) => setEditCarForm({...editCarForm, maintenance_date: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">قراءة العداد (كم)</label>
                      <input 
                        type="number" 
                        placeholder="0" 
                        min="0"
                        step="1"
                        value={editCarForm.mileage}
                        onChange={(e) => setEditCarForm({...editCarForm, mileage: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                      />
                    </div>

                    <button 
                      onClick={handleSaveCarUpdate}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all mt-2"
                    >
                      حفظ
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Add Car Modal */}
        <AnimatePresence>
          {isAddCarModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAddCarModalOpen(false)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto"
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                        <Car className="w-6 h-6 fill-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-black">إضافة سيارة جديدة</h2>
                        <p className="text-xs text-slate-500">إضافة مركبة جديدة إلى أسطولك.</p>
                      </div>
                    </div>
                    <button onClick={() => setIsAddCarModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                      <X className="w-5 h-5 text-slate-500" />
                    </button>
                  </div>

                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">اسم السيارة والموديل *</label>
                      <input 
                        type="text" 
                        placeholder="مثال: تويوتا كامري 2024" 
                        value={carForm.name}
                        onChange={(e) => setCarForm({...carForm, name: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">رقم اللوحة</label>
                        <input 
                          type="text" 
                          placeholder="مثال: أ ب ج 1234" 
                          value={carForm.plate}
                          onChange={(e) => setCarForm({...carForm, plate: e.target.value})}
                          className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">قراءة العداد (كم)</label>
                        <input 
                          type="number" 
                          placeholder="0" 
                          min="0"
                          step="1"
                          value={carForm.mileage}
                          onChange={(e) => setCarForm({...carForm, mileage: e.target.value})}
                          className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <ImageIcon className="w-3.5 h-3.5" />
                        رابط صورة السيارة
                      </label>
                      <input 
                        type="url" 
                        placeholder="https://..." 
                        value={carForm.image_url}
                        onChange={(e) => setCarForm({...carForm, image_url: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">الحالة</label>
                        <select 
                          value={carForm.status}
                          onChange={(e) => setCarForm({...carForm, status: e.target.value as 'Available' | 'Rented' | 'Maintenance'})}
                          className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 appearance-none"
                        >
                          <option value="Available">متاحة</option>
                          <option value="Rented">مؤجرة</option>
                          <option value="Maintenance">صيانة</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">السعر اليومي (د.ك) *</label>
                        <input 
                          type="number" 
                          placeholder="15" 
                          min="0"
                          step="0.5"
                          value={carForm.daily_price}
                          onChange={(e) => setCarForm({...carForm, daily_price: e.target.value})}
                          className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                      <span className="text-sm font-bold text-slate-400">جاهزة للتسليم</span>
                      <button 
                        onClick={() => setCarForm({...carForm, is_ready: !carForm.is_ready})}
                        className={`w-11 h-6 rounded-full relative transition-colors ${carForm.is_ready ? 'bg-emerald-500/40' : 'bg-slate-600'}`}
                      >
                        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${carForm.is_ready ? 'right-0.5' : 'right-5'}`} />
                      </button>
                    </div>

                    <div className="pt-4 flex gap-3">
                      <button 
                        onClick={handleSaveCar}
                        className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
                      >
                        <Car className="w-5 h-5 fill-white" />
                        حفظ السيارة
                      </button>
                      <button 
                        onClick={() => setIsAddCarModalOpen(false)}
                        className="px-8 py-4 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-all"
                      >
                        إلغاء
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Dashboard Scrollable Area - Light bg */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#F8F9FA]">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

// Helper Components
function NavItem({ icon, label, active = false, badge, onClick }: { icon: React.ReactNode, label: string, active?: boolean, badge?: string, onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-blue-600/20 border border-blue-500/30 text-blue-300' : 'text-slate-400 hover:bg-slate-50 hover:text-white'}`}
    >
      {icon}
      <span className="text-sm font-bold flex-1">{label}</span>
      {badge && (
        <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{badge}</span>
      )}
    </div>
  );
}

function StatCard({ label, value, unit, trend, trendUp }: { label: string, value: string, unit: string, trend: string, trendUp: boolean }) {
  return (
    <div className="bg-white border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-6 rounded-3xl">
      <div className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">{label}</div>
      <div className="text-2xl font-black mb-1 text-slate-800">{value} <span className="text-xs text-slate-600 font-medium">{unit}</span></div>
      <div className={`text-[10px] font-bold flex items-center gap-1 ${trendUp ? 'text-emerald-500' : 'text-amber-500'}`}>
        {trendUp ? '↑' : '↓'} {trend}
      </div>
    </div>
  );
}

function FleetStatusItem({ label, count, pct, color }: { label: string, count: number, pct: number, color: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between text-xs font-bold">
        <span className="text-slate-400">{label}</span>
        <span className="text-slate-700">{count} سيارة</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  );
}

function ActivityRow({ name, car, start, end, amount, status, warning = false, extended = false, onDelete, onExtend }: { name: string, car: string, start: string, end: string, amount: string, status: string, warning?: boolean, extended?: boolean, key?: React.Key, onDelete?: () => void, onExtend?: () => void }) {
  return (
    <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors group">
      <td className="px-6 py-4 font-bold text-slate-700">
        <div className="flex items-center gap-2">
          {name}
          {extended && (
            <span className="bg-blue-600/20 text-blue-400 text-[8px] font-black px-1.5 py-0.5 rounded border border-blue-600/30 uppercase tracking-tighter">مُمدد</span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 text-slate-600">{car}</td>
      <td className="px-6 py-4 text-slate-500">{start}</td>
      <td className="px-6 py-4 text-slate-500">{end}</td>
      <td className="px-6 py-4 font-black text-blue-400">{amount}</td>
      <td className="px-6 py-4">
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${warning ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
          {status}
        </span>
      </td>
      <td className="px-6 py-4 text-left">
        <div className="flex items-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onExtend?.();
            }}
            className="p-1.5 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white rounded-lg transition-all"
          >
            <Clock className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
            className="p-1.5 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}

/** Red dot: date passed (today or before) OR within 3 days */
function shouldShowDateAlert(dateStr: string | null, withinDays: number): boolean {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return diffDays <= withinDays;
}

function CarRow({ car, onEdit, onDelete, onToggleReady }: { 
  car: { id: string; name: string; plate: string; status: string; price: string; image: string; mileage: number | null; is_ready: boolean; insurance_expiry: string | null; maintenance_date: string | null }; 
  onEdit: () => void; 
  onDelete: () => void;
  onToggleReady: () => void;
}) {
  const { name, plate, status, price, image, mileage, is_ready, insurance_expiry, maintenance_date } = car;
  const hasAlert = shouldShowDateAlert(insurance_expiry, 3) || shouldShowDateAlert(maintenance_date, 3);
  
  const statusColors = {
    Available: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    Rented: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    Maintenance: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  };

  const statusText = {
    Available: 'متاحة',
    Rented: 'مؤجرة',
    Maintenance: 'صيانة',
  };

  return (
    <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-10 rounded-lg overflow-hidden border border-white/10 bg-slate-800 flex items-center justify-center shrink-0">
            <img 
              src={image} 
              alt={name} 
              className={`w-full h-full ${image.startsWith('data:') ? 'object-contain p-1' : 'object-cover'}`} 
              referrerPolicy="no-referrer" 
              onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE; }} 
            />
          </div>
          <div>
            <div className="font-bold text-slate-800">{name}</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest">فئة اقتصادية</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="bg-slate-100 border border-slate-200 px-3 py-1 rounded text-center w-fit">
          <div className="text-xs font-bold text-slate-700">{plate}</div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Gauge className="w-3.5 h-3.5" />
          <span className="text-xs font-bold">{mileage != null ? mileage.toLocaleString() + ' كم' : '—'}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col gap-1.5">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black border w-fit ${statusColors[status as keyof typeof statusColors]}`}>
            {statusText[status as keyof typeof statusText] || status}
          </span>
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleReady(); }}
            className="flex items-center gap-2 w-fit"
          >
            <div className={`w-9 h-5 rounded-full relative transition-colors ${is_ready ? 'bg-emerald-500/30' : 'bg-slate-600'}`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${is_ready ? 'right-0.5' : 'right-4'}`} />
            </div>
            <span className="text-[10px] text-slate-500 font-bold">جاهزة للتسليم</span>
          </button>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm font-black text-blue-400">{price} <span className="text-[10px] text-slate-500">د.ك / يوم</span></div>
      </td>
      <td className="px-6 py-4 text-left">
        <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            title="تنبيهات التأمين والصيانة"
            className="p-2 bg-slate-100 hover:bg-amber-100 rounded-lg transition-colors relative"
          >
            <Bell className="w-4 h-4 text-slate-600" />
            {hasAlert && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white shadow-sm" />
            )}
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            title="حذف السيارة"
            className="p-2 bg-slate-100 hover:bg-red-100 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-400" />
          </button>
        </div>
      </td>
    </tr>
  );
}

function CarCard({ name, plate, status, price, image }: { name: string, plate: string, status: string, price: string, image: string, key?: React.Key }) {
  return (
    <div className="bg-white border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-3xl overflow-hidden group">
      <div className="h-40 overflow-hidden relative">
        <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${status === 'Available' ? 'bg-emerald-500 text-white' : status === 'Rented' ? 'bg-blue-600 text-white' : 'bg-amber-500 text-white'}`}>
          {status}
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-bold text-lg mb-1 text-slate-800">{name}</h3>
        <p className="text-xs text-slate-500 mb-4">{plate}</p>
        <div className="flex items-center justify-between">
          <div className="text-blue-400 font-black">{price} <span className="text-[10px] text-slate-500">د.ك / يوم</span></div>
          <button className="p-2 bg-slate-100 hover:bg-blue-100 rounded-lg transition-colors">
            <Settings className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ContractRow({ id, customer, car, duration, total, status, warning = false, extended = false, onDelete, onExtend }: { id: string, customer: string, car: string, duration: string, total: string, status: string, warning?: boolean, extended?: boolean, key?: React.Key, onDelete?: () => void, onExtend?: () => void }) {
  return (
    <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors group">
      <td className="px-6 py-4 font-mono text-xs text-slate-500">{id}</td>
      <td className="px-6 py-4 font-bold text-slate-800">
        <div className="flex items-center gap-2">
          {customer}
          {extended && (
            <span className="bg-blue-600/20 text-blue-400 text-[8px] font-black px-1.5 py-0.5 rounded border border-blue-600/30 uppercase tracking-tighter">مُمدد</span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 text-slate-600">{car}</td>
      <td className="px-6 py-4 text-slate-500">{duration}</td>
      <td className="px-6 py-4 font-black text-blue-400">{total} د.ك</td>
      <td className="px-6 py-4">
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : status === 'Overdue' ? 'bg-red-500/10 text-red-500' : 'bg-slate-500/10 text-slate-500'}`}>
          {status}
        </span>
      </td>
      <td className="px-6 py-4 text-left">
        <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onExtend?.();
            }}
            title="تمديد العقد"
            className="p-2 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white rounded-lg transition-all"
          >
            <Clock className="w-4 h-4" />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
            title="حذف العقد"
            className="p-2 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

function CustomerCard({ name, rentals, rating, status }: { name: string, rentals: number, rating: number, status: string, key?: React.Key }) {
  return (
    <div className="bg-white border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-6 rounded-3xl text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 border-2 border-white/10" />
      <h3 className="font-bold mb-1">{name}</h3>
      <div className={`text-[10px] font-black uppercase tracking-widest mb-4 ${status === 'VIP' ? 'text-amber-500' : status === 'Premium' ? 'text-blue-400' : 'text-slate-500'}`}>
        {status}
      </div>
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
        <div>
          <div className="text-xs text-slate-500">الإيجارات</div>
          <div className="font-bold">{rentals}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500">التقييم</div>
          <div className="font-bold text-amber-500">{rating} ★</div>
        </div>
      </div>
    </div>
  );
}

function ExpenseRow({ date, category, car, desc, amount }: { date: string, category: string, car: string, desc: string, amount: string, key?: React.Key }) {
  return (
    <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
      <td className="px-6 py-4 text-slate-500">{date}</td>
      <td className="px-6 py-4 font-bold text-slate-700">{category}</td>
      <td className="px-6 py-4 text-slate-600">{car}</td>
      <td className="px-6 py-4 text-slate-500">{desc}</td>
      <td className="px-6 py-4 font-black text-red-400">{amount} د.ك</td>
    </tr>
  );
}

function RiskAlert({ type, title, desc, time }: { type: 'High' | 'Medium' | 'Low', title: string, desc: string, time: string }) {
  const colors = {
    High: 'border-red-500/20 bg-red-500/5 text-red-500',
    Medium: 'border-amber-500/20 bg-amber-500/5 text-amber-500',
    Low: 'border-blue-500/20 bg-blue-500/5 text-blue-500'
  };
  return (
    <div className={`p-6 border rounded-3xl flex items-start gap-4 ${colors[type]}`}>
      <ShieldAlert className="w-6 h-6 shrink-0" />
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <h4 className="font-bold">{title}</h4>
          <span className="text-[10px] opacity-60 font-bold uppercase tracking-widest">{time}</span>
        </div>
        <p className="text-sm opacity-80">{desc}</p>
      </div>
    </div>
  );
}
