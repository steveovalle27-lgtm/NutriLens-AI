import React, { useState } from 'react';
import { ArrowRight, ScanLine, Lock, Mail, Github, Chrome } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#13002b]">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/30 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-900/20 rounded-full blur-[120px]" />
      
      {/* Main Container */}
      <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-center gap-12 max-w-6xl">
        
        {/* Left Side: Value Proposition */}
        <div className="md:w-1/2 text-left space-y-6">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-tr from-emerald-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <ScanLine className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-wide">NutriLens AI</h2>
              <p className="text-xs text-gray-400 uppercase tracking-widest">Asistente Nutricional Profesional</p>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
            Tu nutricionista personal <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              potenciado por IA
            </span>
          </h1>
          
          <p className="text-lg text-gray-300 max-w-lg leading-relaxed">
            Captura una foto de tu comida y obtén un análisis nutricional completo con recomendaciones profesionales en segundos.
          </p>

          <div className="space-y-4 pt-4">
             <FeatureRow 
               icon="🧠" 
               title="Análisis Avanzado con IA" 
               desc="Detección precisa de alimentos y estimación de porciones." 
             />
             <FeatureRow 
               icon="✨" 
               title="Feedback Profesional" 
               desc="Consejos personalizados como si tuvieras un nutricionista." 
             />
             <FeatureRow 
               icon="🛡️" 
               title="Datos Científicos" 
               desc="Información nutricional validada y confiable." 
             />
          </div>
        </div>

        {/* Right Side: Login Card */}
        <div className="md:w-[450px] w-full">
          <div className="glass-panel p-8 rounded-3xl shadow-2xl backdrop-blur-xl border border-white/10 relative">
            
            <h3 className="text-2xl font-bold text-white mb-2">Bienvenido</h3>
            <p className="text-gray-400 text-sm mb-6">Inicia sesión o crea tu cuenta para comenzar</p>

            {/* Toggle Switch */}
            <div className="bg-[#0f0518] p-1 rounded-full flex mb-6 border border-white/5">
                <button className="flex-1 py-2 rounded-full bg-emerald-600 text-white text-sm font-medium shadow-lg">Iniciar Sesión</button>
                <button className="flex-1 py-2 rounded-full text-gray-400 text-sm font-medium hover:text-white transition-colors">Registrarse</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300 uppercase">Correo Electrónico</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-400 w-5 h-5 transition-colors" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full bg-[#0f0518]/50 border border-gray-700 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder-gray-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300 uppercase">Contraseña</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-400 w-5 h-5 transition-colors" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#0f0518]/50 border border-gray-700 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder-gray-600"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center text-xs">
                 <label className="flex items-center text-gray-400 hover:text-white cursor-pointer">
                    <input type="checkbox" className="mr-2 rounded border-gray-600 bg-transparent text-emerald-500 focus:ring-emerald-500" />
                    Recordarme
                 </label>
                 <a href="#" className="text-emerald-400 hover:text-emerald-300 font-medium">¿Olvidaste tu contraseña?</a>
              </div>

              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-900/20 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                Iniciar Sesión
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            <div className="my-6 flex items-center gap-4">
                <div className="h-px bg-gray-700 flex-1"></div>
                <span className="text-gray-500 text-xs">O continúa con</span>
                <div className="h-px bg-gray-700 flex-1"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <SocialButton icon={<Chrome className="w-5 h-5" />} label="Google" />
                <SocialButton icon={<Github className="w-5 h-5" />} label="GitHub" />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureRow = ({ icon, title, desc }: { icon: string, title: string, desc: string }) => (
  <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors">
    <div className="w-10 h-10 rounded-lg bg-indigo-900/50 border border-indigo-500/30 flex items-center justify-center text-xl shrink-0">
      {icon}
    </div>
    <div>
      <h4 className="text-white font-medium">{title}</h4>
      <p className="text-gray-400 text-sm leading-snug">{desc}</p>
    </div>
  </div>
);

const SocialButton = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
  <button className="flex items-center justify-center gap-2 bg-[#0f0518] border border-gray-700 hover:border-gray-500 text-gray-300 py-2.5 rounded-lg transition-all text-sm font-medium">
    {icon}
    {label}
  </button>
);

export default Login;