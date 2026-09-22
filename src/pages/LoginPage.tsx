import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LogIn, Mail, Lock, Shield, GraduationCap, Users } from 'lucide-react';

export default function LoginPage() {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!login(email, password)) {
      setError('Emel atau kata laluan tidak sah.');
    }
  };

  const demoAccounts = [
    { role: 'Ibu Bapa', email: 'ahmad@email.com', password: 'parent123', icon: Users, color: 'bg-blue-500' },
    { role: 'Guru Kelas', email: 'noraini@school.edu.my', password: 'teacher123', icon: GraduationCap, color: 'bg-green-500' },
    { role: 'PK HEM', email: 'razak@school.edu.my', password: 'admin123', icon: Shield, color: 'bg-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-lg mb-4">
            <Shield className="w-10 h-10 text-blue-700" />
          </div>
          <h1 className="text-3xl font-bold text-white">e-HADIR</h1>
          <p className="text-blue-200 mt-2">Sistem Pengurusan Kehadiran Sekolah</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Log Masuk</h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Emel</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="nama@email.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kata Laluan</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-700 text-white py-3 rounded-lg font-medium hover:bg-blue-800 transition flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              Log Masuk
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-3 text-center">Akaun Demo:</p>
            <div className="space-y-2">
              {demoAccounts.map(acc => (
                <button
                  key={acc.email}
                  onClick={() => { setEmail(acc.email); setPassword(acc.password); }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition text-left"
                >
                  <div className={`${acc.color} p-2 rounded-lg`}>
                    <acc.icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{acc.role}</p>
                    <p className="text-xs text-gray-500">{acc.email}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-blue-200 text-sm mt-6">
          © 2026 e-HADIR — Prototype Sistem Kehadiran
        </p>
      </div>
    </div>
  );
}
