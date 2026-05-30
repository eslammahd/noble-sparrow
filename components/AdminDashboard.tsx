'use client';
import { useState, useEffect, useCallback } from 'react';

interface Slot {
  id: string;
  date: string;
  time: string;
  available: boolean;
}

interface Booking {
  id: string;
  patient_name: string;
  phone: string;
  paid: boolean;
  confirmed: boolean;
  created_at: string;
  slots: { date: string; time: string } | null;
}

export default function AdminDashboard({ password }: { password: string }) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [adding, setAdding] = useState(false);
  const [activeTab, setActiveTab] = useState<'bookings' | 'slots'>('bookings');
  const [msg, setMsg] = useState('');

  const fetchSlots = useCallback(async () => {
    const res = await fetch('/api/slots');
    const data = await res.json();
    setSlots(Array.isArray(data) ? data : []);
  }, []);

  const fetchBookings = useCallback(async () => {
    const res = await fetch(`/api/bookings?password=${encodeURIComponent(password)}`);
    const data = await res.json();
    setBookings(Array.isArray(data) ? data : []);
  }, [password]);

  useEffect(() => {
    fetchSlots();
    fetchBookings();
  }, [fetchSlots, fetchBookings]);

  async function addSlot(e: React.FormEvent) {
    e.preventDefault();
    setAdding(true);
    const res = await fetch('/api/slots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, date: newDate, time: newTime }),
    });
    if (res.ok) {
      setNewDate('');
      setNewTime('');
      setMsg('Slot added successfully.');
      await fetchSlots();
    } else {
      setMsg('Failed to add slot.');
    }
    setAdding(false);
    setTimeout(() => setMsg(''), 3000);
  }

  async function deleteSlot(id: string) {
    if (!confirm('Delete this slot?')) return;
    await fetch('/api/slots', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, id }),
    });
    await fetchSlots();
  }

  async function toggleField(id: string, field: 'paid' | 'confirmed', current: boolean) {
    const body: Record<string, unknown> = { password, id };
    body[field] = !current;
    await fetch('/api/bookings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    await fetchBookings();
  }

  function formatDate(d: string) {
    return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
    });
  }

  function formatTime(t: string) {
    const [h, m] = t.split(':');
    const hour = parseInt(h);
    return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm">Dr Saad El Mahdy — Clinic Portal</p>
        </div>
        <span className="text-xs bg-teal-100 text-teal-700 px-3 py-1 rounded-full font-medium">Logged in</span>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'bookings'
                ? 'bg-teal-600 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('slots')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'slots'
                ? 'bg-teal-600 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Manage Slots ({slots.length})
          </button>
        </div>

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {bookings.length === 0 ? (
              <div className="p-12 text-center text-slate-400">No bookings yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-slate-600">Patient</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-600">Phone</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-600">Session</th>
                      <th className="text-center px-4 py-3 font-medium text-slate-600">Paid</th>
                      <th className="text-center px-4 py-3 font-medium text-slate-600">Confirmed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {bookings.map(b => (
                      <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-slate-800">{b.patient_name}</td>
                        <td className="px-4 py-3 text-slate-600">{b.phone}</td>
                        <td className="px-4 py-3 text-slate-600">
                          {b.slots ? `${formatDate(b.slots.date)} · ${formatTime(b.slots.time)}` : '—'}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => toggleField(b.id, 'paid', b.paid)}
                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mx-auto transition-colors ${
                              b.paid
                                ? 'bg-green-500 border-green-500 text-white'
                                : 'border-slate-300 text-slate-300 hover:border-green-400'
                            }`}
                          >
                            {b.paid && (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => toggleField(b.id, 'confirmed', b.confirmed)}
                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mx-auto transition-colors ${
                              b.confirmed
                                ? 'bg-teal-500 border-teal-500 text-white'
                                : 'border-slate-300 text-slate-300 hover:border-teal-400'
                            }`}
                          >
                            {b.confirmed && (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Slots Tab */}
        {activeTab === 'slots' && (
          <div className="space-y-6">
            {/* Add slot form */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-base font-semibold text-slate-800 mb-4">Add New Slot</h2>
              <form onSubmit={addSlot} className="flex flex-col sm:flex-row gap-3 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={e => setNewTime(e.target.value)}
                    required
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                </div>
                <button
                  type="submit"
                  disabled={adding}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                  {adding ? 'Adding…' : 'Add Slot'}
                </button>
              </form>
              {msg && <p className="mt-3 text-sm text-teal-700">{msg}</p>}
            </div>

            {/* Existing slots */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              {slots.length === 0 ? (
                <div className="p-12 text-center text-slate-400">No available slots. Add one above.</div>
              ) : (
                <ul className="divide-y divide-slate-50">
                  {slots.map(s => (
                    <li key={s.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50">
                      <div>
                        <p className="font-medium text-slate-800">{formatDate(s.date)}</p>
                        <p className="text-sm text-slate-500">{formatTime(s.time)}</p>
                      </div>
                      <button
                        onClick={() => deleteSlot(s.id)}
                        className="text-red-400 hover:text-red-600 text-sm font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
