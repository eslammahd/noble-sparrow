'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Slot {
  id: string;
  date: string;
  time: string;
}

function formatDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

function formatTime(t: string) {
  const [h, m] = t.split(':');
  const hour = parseInt(h);
  return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
}

export default function HomePage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/slots')
      .then(r => r.json())
      .then(data => { setSlots(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-700 to-teal-500 text-white px-6 py-16 text-center">
        <p className="text-teal-200 text-sm font-medium mb-2 tracking-wide uppercase">Online Therapy</p>
        <h1 className="text-4xl font-bold mb-3">Dr Saad El Mahdy</h1>
        <p className="text-teal-100 text-lg max-w-lg mx-auto">
          Professional online therapy sessions for adults and young people (15+).
          Book your slot, pay securely offline, and meet online.
        </p>
      </section>

      {/* Slots */}
      <section className="max-w-2xl mx-auto px-4 py-12">
        <h2 className="text-xl font-semibold text-slate-800 mb-6">Available Sessions</h2>

        {loading && (
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="h-20 bg-white rounded-2xl border border-slate-100 animate-pulse" />
            ))}
          </div>
        )}

        {!loading && slots.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center">
            <p className="text-slate-500">No available slots at the moment.</p>
            <p className="text-slate-400 text-sm mt-1">Please check back soon or contact Dr Saad directly.</p>
          </div>
        )}

        {!loading && slots.length > 0 && (
          <div className="space-y-3">
            {slots.map(slot => (
              <Link
                key={slot.id}
                href={`/book?slot=${slot.id}&date=${slot.date}&time=${slot.time}`}
                className="block bg-white rounded-2xl border border-slate-100 shadow-sm px-6 py-5 hover:border-teal-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800 group-hover:text-teal-700 transition-colors">
                      {formatDate(slot.date)}
                    </p>
                    <p className="text-slate-500 text-sm mt-0.5">{formatTime(slot.time)}</p>
                  </div>
                  <span className="text-sm bg-teal-50 text-teal-700 px-3 py-1 rounded-full font-medium group-hover:bg-teal-100 transition-colors">
                    Book →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8 text-center text-slate-400 text-sm">
        &copy; {new Date().getFullYear()} Dr Saad El Mahdy Therapy &mdash; All rights reserved
      </footer>
    </div>
  );
}
