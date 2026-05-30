'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Slot } from '@/lib/types';

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export default function BookPage() {
  const router = useRouter();
  const params = useSearchParams();
  const slotId = params.get('slot');

  const [slot, setSlot] = useState<Slot | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slotId) { setLoading(false); return; }
    supabase.from('slots').select('*').eq('id', slotId).single()
      .then(({ data }) => { setSlot(data); setLoading(false); });
  }, [slotId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!slot) return;
    setError('');
    if (!name.trim() || !phone.trim()) { setError('Please fill in all fields.'); return; }
    if (!/^[\d\s+\-()]{7,15}$/.test(phone.trim())) { setError('Please enter a valid phone number.'); return; }
    setSubmitting(true);
    const { data, error: insertErr } = await supabase
      .from('bookings')
      .insert({ patient_name: name.trim(), phone: phone.trim(), slot_id: slot.id, paid: false, confirmed: false })
      .select('id')
      .single();
    if (insertErr || !data) {
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
      return;
    }
    // mark slot unavailable
    await supabase.from('slots').update({ available: false }).eq('id', slot.id);
    router.push(`/confirmation?booking=${data.id}&date=${slot.date}&time=${slot.time}`);
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-400">Loading slot details...</p></div>;

  if (!slot) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-gray-600">Slot not found or no longer available.</p>
      <Link href="/" className="text-teal-600 underline">← Back to slots</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-50">
      <header className="bg-white shadow-sm border-b border-teal-100">
        <div className="max-w-3xl mx-auto px-4 py-5 flex items-center gap-4">
          <Link href="/" className="text-teal-600 hover:text-teal-800 text-sm font-medium">← Back</Link>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Complete Your Booking</h1>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-12">
        {/* Selected slot */}
        <div className="bg-teal-600 text-white rounded-2xl px-6 py-5 mb-8 shadow">
          <p className="text-teal-100 text-sm font-medium mb-1">Your selected session</p>
          <p className="text-2xl font-bold">{slot.time.slice(0, 5)}</p>
          <p className="text-teal-100 text-sm mt-1">{formatDate(slot.date)}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 01012345678"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
              required
            />
            <p className="text-xs text-gray-400 mt-1">We&apos;ll use this to confirm your booking.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60"
          >
            {submitting ? 'Booking...' : 'Confirm Booking →'}
          </button>
        </form>
      </main>
    </div>
  );
}
