import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, Upload, X, Loader2, ScanLine, BarChart2, 
  Activity, Zap, Info, Calendar, Layout, MessageSquare, 
  Scale, Calculator, ChevronRight, Droplets, Flame, History,
  ChefHat, Send, Sparkles, User, FileJson, Utensils
} from 'lucide-react';
import { AnalysisState, HistoryItem, ChatMessage, Recipe, HealthProfile } from '../types';
import { analyzeFoodImage, createNutritionChat, generateRecipes } from '../services/geminiService';
import NutritionChart from './NutritionChart';

interface DashboardProps {
  onLogout: () => void;
}

const UserDashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'scan' | 'chat' | 'recipes'>('scan');
  
  // SCANNER STATE
  const [scanState, setScanState] = useState<AnalysisState>({
    isLoading: false, error: null, data: null, imagePreview: null,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // CHAT STATE
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
      { 
          id: '0', 
          role: 'model', 
          text: `Hola, soy NutriLens AI, tu asistente nutricional inteligente.
Para ofrecerte recomendaciones realmente personalizadas y adaptadas a tu salud, necesito conocer algunos datos importantes sobre ti.

Prometo usar esta información solo para mejorar tus planes nutricionales y ayudarte de forma segura y profesional.

Para comenzar, cuéntame lo siguiente:
1. ¿Cuál es tu edad?
2. ¿Cuánto pesas actualmente?
3. (Opcional pero útil) ¿Cuál es tu estatura?
4. ¿Cuál es tu objetivo principal en este momento?
   o Bajar de peso
   o Ganar masa muscular
   o Mantener peso
   o Controlar una enfermedad
   o Mejorar energía o hábitos
5. ¿Tienes alguna enfermedad o condición de salud que debería considerar?
   (Ejemplos: obesidad, presión alta, diabetes, prediabetes, colesterol alto, hígado graso, anemia)
6. ¿Tienes alergias o alimentos que necesite evitar?
7. ¿Hay algún alimento que no te guste o prefieras no consumir?

Con esta información crearé un perfil nutricional adaptado totalmente a ti.
¡Estoy listo cuando tú lo estés! 🌱✨`, 
          timestamp: new Date() 
      }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatSession = useRef<any>(null);

  // USER PROFILE STATE (Extracted from Chat)
  const [healthProfile, setHealthProfile] = useState<HealthProfile>({});

  // RECIPE STATE
  const [recipeInput, setRecipeInput] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isRecipeLoading, setIsRecipeLoading] = useState(false);

  // --- HANDLERS ---

  // Scanner
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setScanState(prev => ({ ...prev, imagePreview: base64, data: null, error: null }));
      handleAnalyze(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async (base64Image: string) => {
    setScanState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const result = await analyzeFoodImage(base64Image);
      setScanState(prev => ({ ...prev, isLoading: false, data: result }));
    } catch (error) {
      setScanState(prev => ({ ...prev, isLoading: false, error: "Error al analizar imagen." }));
    }
  };

  // Chat
  const handleSendMessage = async () => {
      if(!chatInput.trim()) return;
      
      const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: chatInput, timestamp: new Date() };
      setChatMessages(prev => [...prev, userMsg]);
      setChatInput('');
      setIsChatLoading(true);

      try {
        if (!chatSession.current) chatSession.current = createNutritionChat();
        
        const result = await chatSession.current.sendMessage(userMsg.text);
        const fullText = result.response.text;

        // --- JSON EXTRACTION LOGIC ---
        let displayText = fullText;
        const jsonMatch = fullText.match(/```json\s*([\s\S]*?)\s*```/);
        
        if (jsonMatch && jsonMatch[1]) {
            try {
                const parsed = JSON.parse(jsonMatch[1]);
                if (parsed.user_profile_update) {
                    console.log("Updating Profile:", parsed.user_profile_update);
                    // Merge new data into existing profile
                    setHealthProfile(prev => ({
                        ...prev,
                        ...parsed.user_profile_update,
                        // Append arrays if they exist, checking both English and Spanish keys
                        enfermedades: [
                            ...(prev.enfermedades || []),
                            ...(prev.conditions || []),
                            ...(parsed.user_profile_update.enfermedades || [])
                        ],
                        alergias: [
                            ...(prev.alergias || []),
                            ...(prev.allergies || []),
                            ...(parsed.user_profile_update.alergias || [])
                        ]
                    }));
                }
                // Remove JSON from display text
                displayText = fullText.replace(/```json[\s\S]*?```/, '').trim();
            } catch (e) {
                console.error("Error parsing hidden profile data", e);
            }
        }

        const modelMsg: ChatMessage = { 
            id: (Date.now() + 1).toString(), 
            role: 'model', 
            text: displayText, 
            timestamp: new Date() 
        };
        setChatMessages(prev => [...prev, modelMsg]);
      } catch (e) {
          console.error(e);
          setChatMessages(prev => [...prev, { 
            id: Date.now().toString(), 
            role: 'model', 
            text: "Lo siento, tuve un problema de conexión. Por favor verifica tu conexión a internet o intenta de nuevo.", 
            timestamp: new Date() 
          }]);
      } finally {
          setIsChatLoading(false);
      }
  };

  // Recipes
  const handleGenerateRecipes = async () => {
      if(!recipeInput.trim()) return;
      setIsRecipeLoading(true);
      try {
        const results = await generateRecipes(recipeInput);
        setRecipes(results);
      } catch (e) {
          console.error(e);
      } finally {
          setIsRecipeLoading(false);
      }
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
          <NavItem 
            active={activeTab === 'scan'} 
            onClick={() => setActiveTab('scan')} 
            icon={<Camera />} 
            label="Analizar Comida" 
          />
          <NavItem 
            active={activeTab === 'chat'} 
            onClick={() => setActiveTab('chat')} 
            icon={<MessageSquare />} 
            label="Asistente AI (RAG)" 
          />
           <NavItem 
            active={activeTab === 'recipes'} 
            onClick={() => setActiveTab('recipes')} 
            icon={<ChefHat />} 
            label="Generar Recetas" 
          />
          
          <div className="pt-4 pb-2">
            <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Herramientas</p>
            <NavItem onClick={() => {}} icon={<Calendar />} label="Planificador" />
            <NavItem onClick={() => {}} icon={<Activity />} label="Hábitos" />
            <NavItem onClick={() => {}} icon={<BarChart2 />} label="Estadísticas" />
          </div>

          {/* Profile Status Mini-Widget */}
          {(healthProfile.objetivo || healthProfile.peso) && (
              <div className="mx-4 p-3 bg-emerald-900/20 border border-emerald-500/20 rounded-xl mt-4">
                  <div className="flex items-center gap-2 mb-2 text-emerald-400">
                      <FileJson className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase">Perfil Detectado</span>
                  </div>
                  <div className="space-y-1 text-[10px] text-gray-400">
                      {healthProfile.objetivo && <p>🎯 {healthProfile.objetivo}</p>}
                      {healthProfile.peso && <p>⚖️ {healthProfile.peso}</p>}
                      {healthProfile.actividad && <p>🏃 {healthProfile.actividad}</p>}
                  </div>
              </div>
          )}
        </nav>

        <div className="p-4 border-t border-white/5">
            <button onClick={onLogout} className="w-full py-2 text-sm text-gray-500 hover:text-white transition-colors flex items-center gap-2">
                <Layout className="w-4 h-4" /> Cerrar Sesión
            </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute top-[-10%] left-[20%] w-[400px] h-[400px] bg-purple-900/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[10%] w-[300px] h-[300px] bg-emerald-900/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth relative z-10">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        ¡Hola, <span className="text-emerald-400">Usuario!</span> 👋
                    </h2>
                    <p className="text-gray-400 text-sm">Tu asistente nutricional está listo.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex bg-[#1e1033] px-4 py-2 rounded-full border border-white/10 items-center gap-2">
                        <User className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold text-gray-300">Plan PRO</span>
                    </div>
                </div>
            </div>

            {/* TAB CONTENT */}
            
            {/* 1. SCANNER TAB */}
            {activeTab === 'scan' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                    <div className="lg:col-span-2 space-y-6">
                         {/* Stats Row */}
                         <div className="grid grid-cols-3 gap-4 mb-2">
                            <StatCard title="Calorías" value="1,847" icon={<Flame className="text-emerald-400" />} />
                            <StatCard title="Proteína" value="82g" icon={<Zap className="text-amber-400" />} />
                            <StatCard title="Agua" value="1.8L" icon={<Droplets className="text-blue-400" />} />
                         </div>

                        <div className="glass-panel rounded-3xl p-6 border border-white/10 relative min-h-[500px]">
                            {/* Upload Logic reused from previous */}
                             {!scanState.data && !scanState.imagePreview ? (
                                <div 
                                    className="border-2 border-dashed border-gray-700 hover:border-emerald-500/50 bg-[#0f0518]/50 rounded-2xl h-96 flex flex-col items-center justify-center transition-all cursor-pointer group"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <div className="w-20 h-20 rounded-full bg-[#1e1033] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-white/5 shadow-2xl">
                                        <Upload className="w-8 h-8 text-emerald-400" />
                                    </div>
                                    <h4 className="text-lg font-bold text-white mb-2">Subir imagen de comida</h4>
                                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                                </div>
                            ) : (
                                <div className="flex flex-col md:flex-row gap-6 h-full">
                                    <div className="w-full md:w-1/2 relative rounded-2xl overflow-hidden h-96 bg-black">
                                        <img src={scanState.imagePreview!} alt="Preview" className="w-full h-full object-cover" />
                                        {scanState.isLoading && (
                                            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center backdrop-blur-sm">
                                                <Loader2 className="w-10 h-10 text-emerald-400 animate-spin mb-4" />
                                                <p className="text-emerald-200">Analizando...</p>
                                            </div>
                                        )}
                                        <button onClick={() => setScanState({isLoading:false, error:null, data:null, imagePreview:null})} className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white"><X className="w-4 h-4"/></button>
                                    </div>
                                    {scanState.data && (
                                        <div className="w-full md:w-1/2 flex flex-col gap-4">
                                            <h2 className="text-3xl font-bold text-white">{scanState.data.foodName}</h2>
                                            <div className="bg-[#1e1033] p-4 rounded-xl border border-white/5">
                                                <NutritionChart data={scanState.data} />
                                            </div>
                                            <div className="bg-indigo-900/20 p-4 rounded-xl border border-indigo-500/20">
                                                <h4 className="text-indigo-300 font-bold mb-1 flex items-center gap-2"><Sparkles className="w-4 h-4"/> Explicación IA</h4>
                                                <p className="text-sm text-gray-300 leading-relaxed">{scanState.data.advice}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* 2. CHAT TAB */}
            {activeTab === 'chat' && (
                <div className="glass-panel rounded-3xl border border-white/10 h-[calc(100vh-180px)] flex flex-col animate-fade-in">
                    <div className="p-4 border-b border-white/5 bg-[#1e1033]/80 rounded-t-3xl flex justify-between items-center">
                        <div>
                            <h3 className="font-bold flex items-center gap-2"><MessageSquare className="w-5 h-5 text-emerald-400"/> NutriLens Chat</h3>
                            <p className="text-xs text-gray-500">Evaluación Clínica & Planes Personalizados</p>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {chatMessages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-[#1e1033] border border-white/10 text-gray-200 rounded-tl-none'}`}>
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        {isChatLoading && (
                            <div className="flex justify-start">
                                <div className="bg-[#1e1033] p-4 rounded-2xl rounded-tl-none border border-white/10 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-100"></div>
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-200"></div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="p-4 bg-[#1e1033]/50 border-t border-white/5 rounded-b-3xl">
                        <div className="relative">
                            <input 
                                type="text" 
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Responde aquí..." 
                                className="w-full bg-[#0f0518] border border-gray-700 rounded-xl py-4 pl-6 pr-14 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                            />
                            <button onClick={handleSendMessage} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white transition-colors">
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 3. RECIPES TAB */}
            {activeTab === 'recipes' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="glass-panel p-8 rounded-3xl border border-white/10 text-center">
                        <h3 className="text-2xl font-bold mb-4">Generador de Recetas Inteligente</h3>
                        <p className="text-gray-400 mb-6 max-w-xl mx-auto">Describe tus preferencias (ej: "Desayuno alto en proteína sin lácteos") y la IA creará opciones validadas con instrucciones detalladas.</p>
                        <div className="flex max-w-xl mx-auto gap-2">
                            <input 
                                type="text" 
                                value={recipeInput}
                                onChange={(e) => setRecipeInput(e.target.value)}
                                placeholder="Ej: Cena para diabetes con pollo..."
                                className="flex-1 bg-[#0f0518] border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500" 
                            />
                            <button 
                                onClick={handleGenerateRecipes}
                                disabled={isRecipeLoading}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 rounded-xl font-bold transition-colors flex items-center gap-2"
                            >
                                {isRecipeLoading ? <Loader2 className="animate-spin"/> : <Sparkles className="w-5 h-5" />} Generar
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {recipes.map((recipe, idx) => (
                            <div key={idx} className="bg-[#1e1033] border border-white/5 rounded-2xl overflow-hidden hover:border-emerald-500/30 transition-all group flex flex-col h-full">
                                <div className="h-2 bg-gradient-to-r from-emerald-500 to-green-400"></div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="font-bold text-xl text-white group-hover:text-emerald-400 transition-colors">{recipe.name}</h4>
                                        <span className="text-xs bg-white/5 px-2 py-1 rounded text-gray-400 whitespace-nowrap">{recipe.prepTime}</span>
                                    </div>
                                    <p className="text-sm text-gray-400 mb-4 italic">"{recipe.explanation}"</p>
                                    
                                    <div className="grid grid-cols-3 gap-2 mb-4">
                                        <div className="text-center bg-black/20 rounded p-2">
                                            <div className="text-xs text-gray-500">CAL</div>
                                            <div className="font-bold">{recipe.calories}</div>
                                        </div>
                                        <div className="text-center bg-black/20 rounded p-2">
                                            <div className="text-xs text-gray-500">PRO</div>
                                            <div className="font-bold text-emerald-400">{recipe.macros.protein}</div>
                                        </div>
                                        <div className="text-center bg-black/20 rounded p-2">
                                            <div className="text-xs text-gray-500">GRASA</div>
                                            <div className="font-bold text-amber-400">{recipe.macros.fat}</div>
                                        </div>
                                    </div>
                                    
                                    {/* Ingredients Section */}
                                    <div className="mb-4">
                                        <h5 className="font-bold text-emerald-400 mb-2 text-xs uppercase flex items-center gap-2"><Utensils className="w-3 h-3"/> Ingredientes</h5>
                                        <ul className="text-xs text-gray-300 list-disc list-inside space-y-1">
                                            {recipe.ingredients?.map((ing, i) => (
                                                <li key={i}>{ing}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Instructions Section */}
                                    <div className="mb-4 flex-1">
                                        <h5 className="font-bold text-emerald-400 mb-2 text-xs uppercase flex items-center gap-2"><ChefHat className="w-3 h-3"/> Preparación</h5>
                                        <ol className="text-xs text-gray-300 list-decimal list-inside space-y-2">
                                            {recipe.instructions?.map((step, i) => (
                                                <li key={i} className="leading-relaxed"><span className="text-gray-400">{step}</span></li>
                                            ))}
                                        </ol>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-white/5">
                                        {recipe.tags.map(tag => (
                                            <span key={tag} className="text-[10px] bg-white/5 px-2 py-1 rounded-full text-gray-400">#{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
      </main>
    </div>
  );
};

const NavItem = ({ active, onClick, icon, label }: any) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
    >
        <div className={`w-5 h-5 ${active ? 'text-emerald-400' : ''}`}>{icon}</div>
        <span className="font-medium text-sm">{label}</span>
    </button>
);

const StatCard = ({ title, value, icon }: any) => (
    <div className="bg-[#1e1033] border border-white/5 p-4 rounded-2xl flex items-center justify-between">
        <div>
            <span className="text-gray-500 text-xs uppercase tracking-wider">{title}</span>
            <div className="text-xl font-bold text-white">{value}</div>
        </div>
        <div className="p-2 bg-white/5 rounded-lg">{icon}</div>
    </div>
);

export default UserDashboard;