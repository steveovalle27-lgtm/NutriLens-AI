import React, { useState } from 'react';
import { 
  Users, Activity, Database, Shield, AlertTriangle, 
  Search, MoreVertical, LogOut, Server, Cpu
} from 'lucide-react';
import { UserProfile } from '../types';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [users] = useState<UserProfile[]>([
    { id: '1', name: 'Ana García', email: 'ana@example.com', role: 'USER', plan: 'Pro', status: 'Active' },
    { id: '2', name: 'Carlos Ruiz', email: 'carlos@example.com', role: 'USER', plan: 'Free', status: 'Active' },
    { id: '3', name: 'Admin System', email: 'root@nutrilens.ai', role: 'ADMIN', plan: 'Pro', status: 'Active' },
    { id: '4', name: 'Luis Test', email: 'luis@test.com', role: 'USER', plan: 'Free', status: 'Suspended' },
  ]);

  return (
    <div className="min-h-screen bg-[#0f0518] text-gray-100 flex font-sans">
      
      {/* Admin Sidebar */}
      <aside className="w-64 bg-[#13002b] border-r border-red-500/10 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/50">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Admin Console</h1>
            <span className="text-[10px] text-red-400 uppercase tracking-widest">System Access</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
           <AdminNavItem icon={<Activity />} label="Dashboard General" active />
           <AdminNavItem icon={<Users />} label="Gestión de Usuarios" />
           <AdminNavItem icon={<Database />} label="Base de Datos RAG" />
           <AdminNavItem icon={<Server />} label="Infraestructura" />
           <AdminNavItem icon={<Shield />} label="Auditoría IA" />
        </nav>

        <div className="p-4 border-t border-white/5">
            <button onClick={onLogout} className="w-full py-2 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                <LogOut className="w-4 h-4" /> Cerrar Sesión
            </button>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <header className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Vista General del Sistema</h2>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-green-900/20 text-green-400 border border-green-500/20 rounded-full text-xs font-mono">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    API Status: HEALTHY
                </div>
            </div>
        </header>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <AdminMetricCard title="Usuarios Totales" value="1,240" icon={<Users className="text-blue-400" />} />
            <AdminMetricCard title="IA Requests (24h)" value="15.4k" icon={<Cpu className="text-purple-400" />} />
            <AdminMetricCard title="DB Vectorial" value="98.2%" icon={<Database className="text-emerald-400" />} subtitle="Índice Optimizado" />
            <AdminMetricCard title="Alertas de Riesgo" value="3" icon={<AlertTriangle className="text-red-400" />} isAlert />
        </div>

        {/* User Table */}
        <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden mb-8">
            <div className="p-5 border-b border-white/5 flex justify-between items-center">
                <h3 className="font-bold flex items-center gap-2"><Users className="w-4 h-4 text-gray-400" /> Usuarios Recientes</h3>
                <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input type="text" placeholder="Buscar usuario..." className="bg-[#0f0518] border border-gray-700 rounded-lg py-1.5 pl-9 pr-4 text-sm focus:outline-none focus:border-red-500 text-gray-300" />
                </div>
            </div>
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-[#1e1033]">
                    <tr>
                        <th className="px-6 py-3">Usuario</th>
                        <th className="px-6 py-3">Rol</th>
                        <th className="px-6 py-3">Plan</th>
                        <th className="px-6 py-3">Estado</th>
                        <th className="px-6 py-3">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                    {users.map((user) => (
                        <tr key={user.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4">
                                <div className="font-medium text-white">{user.name}</div>
                                <div className="text-gray-500 text-xs">{user.email}</div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'ADMIN' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                    {user.role}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-gray-300">{user.plan}</td>
                            <td className="px-6 py-4">
                                <span className={`flex items-center gap-1.5 ${user.status === 'Active' ? 'text-emerald-400' : 'text-red-400'}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                                    {user.status}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <button className="text-gray-400 hover:text-white"><MoreVertical className="w-4 h-4" /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* System Logs (Fake) */}
        <div className="glass-panel rounded-2xl border border-white/10 p-5">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Server className="w-4 h-4 text-gray-400" /> Logs del Sistema (RAG Service)</h3>
            <div className="font-mono text-xs text-gray-400 space-y-2">
                <p><span className="text-emerald-500">[14:02:12]</span> INFO: VectorDB index refreshed successfully.</p>
                <p><span className="text-blue-500">[14:05:45]</span> DEBUG: User #1241 generated recipe request. Latency: 450ms.</p>
                <p><span className="text-emerald-500">[14:10:01]</span> INFO: Backup created for 'UserProfiles'.</p>
                <p><span className="text-yellow-500">[14:15:22]</span> WARN: High memory usage detected in RecommendationService.</p>
            </div>
        </div>

      </main>
    </div>
  );
};

const AdminNavItem = ({ icon, label, active }: any) => (
    <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-red-600/10 text-red-400 border border-red-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
        <div className="w-5 h-5">{icon}</div>
        <span className="font-medium text-sm">{label}</span>
    </button>
);

const AdminMetricCard = ({ title, value, icon, subtitle, isAlert }: any) => (
    <div className={`p-5 rounded-2xl border ${isAlert ? 'bg-red-900/10 border-red-500/30' : 'bg-[#1e1033] border-white/5'}`}>
        <div className="flex justify-between items-start mb-2">
            <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">{title}</span>
            {icon}
        </div>
        <div className="text-2xl font-bold text-white">{value}</div>
        {subtitle && <div className="text-xs text-emerald-400 mt-1">{subtitle}</div>}
    </div>
);

export default AdminDashboard;