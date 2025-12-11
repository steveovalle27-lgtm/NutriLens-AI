import React, { useState, useRef } from 'react';
import { 
  Camera, Upload, X, Loader2, ScanLine, BarChart2, 
  Activity, Zap, Info, Calendar, Layout, MessageSquare, 
  Scale, Calculator, ChevronRight, Droplets, Flame, History
} from 'lucide-react';
import { AnalysisState, HistoryItem } from '../types';
import { analyzeFoodImage } from '../services/geminiService';
import NutritionChart from './NutritionChart';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [state, setState] = useState<AnalysisState>({
    isLoading: false,
    error: null,
    data: null,
    imagePreview: null,
  });

  const [recentHistory] = useState<HistoryItem[]>([
    { id: '1', foodName: 'Ensalada César', calories: 350, timeAgo: 'Hace 2h', icon: '🥗' },
    { id: '2', foodName: 'Salmón a la plancha', calories: 420, timeAgo: 'Hace 5h', icon: '🐟' },
    { id: '3', foodName: 'Batido de proteína', calories: 180, timeAgo: 'Ayer', icon: '🥤' },
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setState(prev => ({ ...prev, imagePreview: base64, data: null, error: null }));
      handleAnalyze(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async (base64Image: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const result = await analyzeFoodImage(base64Image);
      setState(prev => ({ ...prev, isLoading: false, data: result }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: "No pudimos analizar la imagen. Intenta con una foto más clara." 
      }));
    }
  };

  const resetAnalysis = () => {
    setState({
      isLoading: false,
      error: null,
      data: null,
      imagePreview: null,
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex h-screen bg-[#0f0518] text-gray-100 overflow-hidden font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#13002b] border-r border-white/5 flex flex-col z-20 hidden md:flex">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/50">
            <ScanLine className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">NutriLens AI</h1>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest">Profesional</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 rounded-xl transition-all">
            <Camera className="w-5 h-5" />
            <span className="font-medium text-sm">Analizar Comida</span>
          </button>
          
          <div className="pt-4 pb-2">
            <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Herramientas</p>
            <NavItem icon={<Calendar />} label="Planificador" />
            <NavItem icon={<Activity />} label="Hábitos" />
            <NavItem icon={<BarChart2 />} label="Análisis" />
            <NavItem icon={<MessageSquare />} label="Asistente AI" />
            <NavItem icon={<Calculator />} label="IMC" />
            <NavItem icon={<Scale />} label="Comp. Corporal" />
          </div>
        </nav>

        <div className="p-4 border-t border-white/5">
            <button onClick={onLogout} className="w-full py-2 text-sm text-gray-500 hover:text-white transition-colors">
                Cerrar Sesión
            </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Decorative Background Blurs */}
        <div className="absolute top-[-10%] left-[20%] w-[400px] h-[400px] bg-purple-900/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[10%] w-[300px] h-[300px] bg-emerald-900/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        ¡Hola, <span className="text-emerald-400">Usuario!</span> 👋
                    </h2>
                    <p className="text-gray-400 text-sm">¿Listo para analizar tu próxima comida?</p>
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg shadow-orange-500/20">
                    <Flame className="w-3 h-3 fill-current" /> Racha de 7 días
                </div>
            </div>

            {/* Stats Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard 
                    title="Calorías Hoy" 
                    value="1,847" 
                    subtitle="153 restantes" 
                    icon={<Flame className="text-emerald-400" />} 
                    trend="down"
                    color="emerald"
                />
                <StatCard 
                    title="Proteína" 
                    value="82g" 
                    subtitle="+12g vs ayer" 
                    icon={<Zap className="text-amber-400" />} 
                    trend="up"
                    color="purple"
                />
                <StatCard 
                    title="Hidratación" 
                    value="1.8L" 
                    subtitle="72% del objetivo" 
                    icon={<Droplets className="text-blue-400" />} 
                    trend="neutral"
                    color="blue"
                />
                 <StatCard 
                    title="Análisis" 
                    value="24" 
                    subtitle="Esta semana" 
                    icon={<Activity className="text-purple-400" />} 
                    trend="up"
                    color="pink"
                />
            </div>

            {/* Main Grid: Upload Area & History */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Center Panel - Upload & Results */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-panel rounded-3xl p-1 border border-white/10 relative overflow-hidden min-h-[400px]">
                        
                        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#1e1033]/50">
                            <h3 className="font-semibold text-white flex items-center gap-2">
                                <Camera className="w-4 h-4 text-emerald-400" /> Analizar Nueva Comida
                            </h3>
                            <span className="text-xs text-gray-500">Sube una foto o toma una para obtener análisis instantáneo</span>
                        </div>

                        <div className="p-6">
                            {!state.data && !state.imagePreview ? (
                                <div 
                                    className="border-2 border-dashed border-gray-700 hover:border-emerald-500/50 bg-[#0f0518]/50 rounded-2xl h-80 flex flex-col items-center justify-center transition-all cursor-pointer group"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <div className="w-20 h-20 rounded-full bg-[#1e1033] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-white/5 shadow-2xl">
                                        <Upload className="w-8 h-8 text-emerald-400" />
                                    </div>
                                    <h4 className="text-lg font-bold text-white mb-2">Arrastra tu imagen aquí</h4>
                                    <p className="text-gray-500 text-sm mb-6">o haz clic para seleccionar</p>
                                    <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-lg shadow-emerald-900/20 flex items-center gap-2">
                                        <Camera className="w-4 h-4" /> Seleccionar Foto
                                    </button>
                                    <input 
                                        type="file" 
                                        ref={fileInputRef}
                                        onChange={handleImageUpload}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                                    {/* Image Preview Side */}
                                    <div className="relative rounded-2xl overflow-hidden border border-white/10 h-80 bg-black">
                                        {state.imagePreview && (
                                            <img src={state.imagePreview} alt="Preview" className="w-full h-full object-cover opacity-80" />
                                        )}
                                        {state.isLoading && (
                                            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center backdrop-blur-sm">
                                                <Loader2 className="w-10 h-10 text-emerald-400 animate-spin mb-4" />
                                                <p className="text-emerald-200 font-medium animate-pulse">Analizando con Gemini Pro...</p>
                                            </div>
                                        )}
                                        <div className="absolute top-4 right-4">
                                            <button 
                                                onClick={resetAnalysis}
                                                className="bg-black/50 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-md transition-colors"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Result Data Side */}
                                    {state.data && (
                                        <div className="flex flex-col h-full justify-between space-y-4">
                                            <div>
                                                <div className="flex justify-between items-start mb-2">
                                                    <h2 className="text-2xl font-bold text-white">{state.data.foodName}</h2>
                                                    <div className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-lg text-xs font-bold border border-emerald-500/30">
                                                        Score: {state.data.healthScore}
                                                    </div>
                                                </div>
                                                <p className="text-gray-400 text-sm line-clamp-2">{state.data.description}</p>
                                            </div>

                                            <div className="bg-[#0f0518] p-4 rounded-2xl border border-white/5">
                                                <NutritionChart data={state.data} />
                                            </div>

                                            <div className="grid grid-cols-3 gap-2 text-center">
                                                <MacroBadge label="Prot" value={`${state.data.protein}g`} color="bg-emerald-500/20 text-emerald-400" />
                                                <MacroBadge label="Carb" value={`${state.data.carbs}g`} color="bg-blue-500/20 text-blue-400" />
                                                <MacroBadge label="Grasa" value={`${state.data.fat}g`} color="bg-amber-500/20 text-amber-400" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        
                        {/* Advice Section Footer */}
                        {state.data && (
                            <div className="bg-[#2a1745]/50 p-4 border-t border-white/5 flex gap-4 items-start">
                                <div className="bg-indigo-500/20 p-2 rounded-lg shrink-0">
                                    <Info className="w-5 h-5 text-indigo-400" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-indigo-200 mb-1">Feedback Profesional</h4>
                                    <p className="text-sm text-gray-400 leading-relaxed">{state.data.advice}</p>
                                </div>
                            </div>
                        )}
                        {state.error && (
                            <div className="bg-red-500/10 text-red-400 p-4 m-6 rounded-xl border border-red-500/20 text-center text-sm">
                                {state.error}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel - History */}
                <div className="space-y-6">
                    <div className="glass-panel p-5 rounded-3xl border border-white/10">
                        <div className="flex items-center gap-2 mb-6">
                            <History className="w-5 h-5 text-blue-400" />
                            <h3 className="font-bold text-white">Historial Reciente</h3>
                        </div>

                        <div className="space-y-3">
                            {recentHistory.map((item) => (
                                <div key={item.id} className="bg-[#1e1033] hover:bg-[#251340] p-3 rounded-xl flex items-center justify-between border border-white/5 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-[#0f0518] flex items-center justify-center text-lg border border-white/5">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors">{item.foodName}</p>
                                            <p className="text-[10px] text-gray-500 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" /> {item.timeAgo}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-white">{item.calories}</p>
                                        <p className="text-[10px] text-gray-500">kcal</p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-600 group-hover:translate-x-1 transition-transform" />
                                </div>
                            ))}
                        </div>
                        
                        <button className="w-full mt-6 py-3 rounded-xl bg-[#1e1033] text-xs font-semibold text-gray-400 hover:text-white border border-white/5 hover:bg-[#251340] transition-all flex items-center justify-center gap-2">
                            Ver todo el historial <ChevronRight className="w-3 h-3" />
                        </button>
                    </div>

                    {/* Promo / Premium Teaser */}
                    <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 p-5 rounded-3xl border border-indigo-500/20 relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-400/20">PRO</span>
                                <h4 className="font-bold text-white text-sm">Objetivos Semanales</h4>
                            </div>
                            <p className="text-xs text-indigo-200 mb-4">Estás cerca de cumplir tu meta de proteínas.</p>
                            <div className="w-full bg-[#0f0518] rounded-full h-2 mb-1">
                                <div className="bg-gradient-to-r from-amber-400 to-orange-500 h-2 rounded-full w-[85%]"></div>
                            </div>
                            <div className="flex justify-between text-[10px] text-gray-400">
                                <span>Progreso</span>
                                <span>85%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
    <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all group">
        <div className="w-5 h-5 group-hover:text-emerald-400 transition-colors">{icon}</div>
        <span className="font-medium text-sm">{label}</span>
    </button>
);

const StatCard = ({ title, value, subtitle, icon, trend, color }: any) => {
    const bgColors: any = {
        emerald: "bg-[#1e1033] border-emerald-500/10",
        purple: "bg-[#1e1033] border-purple-500/10",
        blue: "bg-[#1e1033] border-blue-500/10",
        pink: "bg-[#1e1033] border-pink-500/10",
    };

    return (
        <div className={`${bgColors[color]} border p-5 rounded-2xl relative overflow-hidden group hover:border-white/10 transition-colors`}>
            <div className="flex justify-between items-start mb-4">
                <span className="text-gray-400 text-xs font-medium">{title}</span>
                <div className="p-2 rounded-lg bg-white/5 group-hover:scale-110 transition-transform">{icon}</div>
            </div>
            <div>
                <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
                <p className={`text-xs flex items-center gap-1 ${trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-emerald-400' : 'text-blue-400'}`}>
                    {trend === 'down' ? '↓' : trend === 'up' ? '↑' : '•'} {subtitle}
                </p>
            </div>
        </div>
    );
};

const MacroBadge = ({ label, value, color }: any) => (
    <div className={`${color} p-2 rounded-xl flex flex-col items-center justify-center`}>
        <span className="text-[10px] font-bold opacity-70 uppercase">{label}</span>
        <span className="text-sm font-bold">{value}</span>
    </div>
);

export default Dashboard;