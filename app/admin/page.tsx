'use client';
import { useState } from 'react';
import AdminDashboard from '@/components/AdminDashboard';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: input }),
    });
    if (res.ok) {
      setPassword(input);
    } else {
      setError('Incorrect password. Please try again.');
    }
    setLoading(false);
  }

  if (password) return <AdminDashboard password={password} />;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-slate-800 mb-2">Admin Login</h1>
        <p className="text-slate-500 text-sm mb-6">Dr Saad El Mahdy — Clinic Portal</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              value={input}
              onChange={e => setInput(e.target.value)}
              required
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
              placeholder="Enter admin password"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
