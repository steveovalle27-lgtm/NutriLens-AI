import React, { useState } from 'react';
import { ArrowRight, ScanLine, Lock, Mail, Github, Chrome, ShieldAlert } from 'lucide-react';
import { AppState } from '../types';

interface LoginProps {
  onLogin: (role: 'USER' | 'ADMIN') => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleUserLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin('USER');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#13002b]">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/30 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-900/20 rounded-full blur-[120px]" />
      
      <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-center gap-12 max-w-6xl">
        
        {/* Left Side */}
        <div className="md:w-1/2 text-left space-y-6">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-tr from-emerald-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <ScanLine className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-wide">NutriLens AI</h2>
              <p className="text-xs text-gray-400 uppercase tracking-widest">Plataforma Nutricional</p>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
            Nutrición Inteligente <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Personalizada
            </span>
          </h1>
          <p className="text-lg text-gray-300 max-w-lg leading-relaxed">
            IA avanzada, RAG clínico y recomendaciones explicables para transformar tu salud.
          </p>
        </div>

        {/* Right Side: Login Card */}
        <div className="md:w-[450px] w-full">
          <div className="glass-panel p-8 rounded-3xl shadow-2xl backdrop-blur-xl border border-white/10 relative">
            <h3 className="text-2xl font-bold text-white mb-2">Bienvenido</h3>
            <p className="text-gray-400 text-sm mb-6">Accede a tu panel personalizado</p>

            <form onSubmit={handleUserLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300 uppercase">Correo</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-400 w-5 h-5 transition-colors" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="usuario@email.com" className="w-full bg-[#0f0518]/50 border border-gray-700 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-emerald-500" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300 uppercase">Contraseña</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-400 w-5 h-5 transition-colors" />
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-[#0f0518]/50 border border-gray-700 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-emerald-500" />
                </div>
              </div>

              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20">
                Iniciar como Usuario <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-white/10">
                <button 
                    onClick={() => onLogin('ADMIN')}
                    className="w-full py-2 flex items-center justify-center gap-2 text-xs text-red-400 hover:text-red-300 transition-colors opacity-70 hover:opacity-100"
                >
                    <ShieldAlert className="w-3 h-3" /> Acceso Administrativo (Demo)
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;