import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Slot } from '@/lib/types';

function groupSlotsByDate(slots: Slot[]) {
  return slots.reduce<Record<string, Slot[]>>((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {});
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

async function getSlots(): Promise<Slot[]> {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('slots')
    .select('*')
    .eq('available', true)
    .gte('date', today)
    .order('date', { ascending: true })
    .order('time', { ascending: true });
  if (error) return [];
  return data as Slot[];
}

export const revalidate = 60;

export default async function HomePage() {
  const slots = await getSlots();
  const grouped = groupSlotsByDate(slots);
  const dates = Object.keys(grouped).sort();

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-teal-100">
        <div className="max-w-3xl mx-auto px-4 py-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-lg">
            SE
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Dr Saad El Mahdy</h1>
            <p className="text-sm text-teal-600 font-medium">Online Therapy &mdash; Psychologist</p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        {/* Hero */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Book Your Session</h2>
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            Choose an available slot below, fill in your details, and pay offline via Instapay or Vodafone Cash before we meet online.
          </p>
        </div>

        {/* Info Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {[
            { icon: '🖥️', label: 'Online Sessions' },
            { icon: '🕐', label: '50-min / Session' },
            { icon: '🔒', label: 'Private & Confidential' },
            { icon: '📱', label: 'Ages 15 & above' },
          ].map((p) => (
            <span key={p.label} className="inline-flex items-center gap-1.5 bg-teal-100 text-teal-800 text-sm font-medium px-3 py-1.5 rounded-full">
              <span>{p.icon}</span> {p.label}
            </span>
          ))}
        </div>

        {/* Slot listing */}
        {dates.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-4xl mb-3">📅</p>
            <p className="text-gray-600 font-medium">No available slots right now.</p>
            <p className="text-gray-400 text-sm mt-1">Please check back soon or contact Dr Saad directly.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {dates.map((date) => (
              <div key={date}>
                <h3 className="text-sm font-semibold text-teal-700 uppercase tracking-wider mb-3">
                  {formatDate(date)}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {grouped[date].map((slot) => (
                    <Link
                      key={slot.id}
                      href={`/book?slot=${slot.id}`}
                      className="block bg-white border border-teal-200 rounded-xl px-4 py-4 text-center hover:border-teal-500 hover:shadow-md transition-all group"
                    >
                      <p className="text-2xl font-bold text-teal-700 group-hover:text-teal-800">
                        {slot.time.slice(0, 5)}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Tap to book</p>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="text-center py-8 text-sm text-gray-400">
        &copy; {new Date().getFullYear()} Dr Saad El Mahdy &mdash; All rights reserved
      </footer>
    </div>
  );
}
