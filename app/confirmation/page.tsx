'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

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

function ConfirmationContent() {
  const params = useSearchParams();
  const name = params.get('name') || 'Patient';
  const date = params.get('date') || '';
  const time = params.get('time') || '';

  return (
    <div className="min-h-screen bg-slate-50 flex items-start justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-5">
        {/* Success banner */}
        <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-8 text-center">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-slate-800 mb-1">Booking Confirmed!</h1>
          <p className="text-slate-500">Thank you, <strong>{name}</strong>. Your session has been reserved.</p>
          {date && time && (
            <div className="mt-4 bg-slate-50 rounded-xl px-4 py-3">
              <p className="text-sm font-medium text-slate-700">{formatDate(date)}</p>
              <p className="text-sm text-slate-500">{formatTime(time)}</p>
            </div>
          )}
        </div>

        {/* Payment instructions */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Complete Your Payment</h2>
          <p className="text-slate-500 text-sm mb-5">
            Please send the session fee via one of the methods below, then contact Dr Saad to confirm.
          </p>

          {/* Instapay */}
          <div className="border border-slate-100 rounded-xl p-4 mb-3">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 font-bold text-xs">IP</div>
              <span className="font-semibold text-slate-800">Instapay</span>
            </div>
            <p className="text-slate-600 text-sm">Send to: <span className="font-mono font-semibold text-slate-800">saadelmahdy@instapay</span></p>
          </div>

          {/* Vodafone Cash */}
          <div className="border border-slate-100 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-red-600 font-bold text-xs">VC</div>
              <span className="font-semibold text-slate-800">Vodafone Cash</span>
            </div>
            <p className="text-slate-600 text-sm">Send to: <span className="font-mono font-semibold text-slate-800">010XXXXXXXX</span></p>
          </div>

          <p className="text-xs text-slate-400 mt-4">
            After payment, please send a screenshot to Dr Saad via WhatsApp or phone to confirm your session.
          </p>
        </div>

        <Link
          href="/"
          className="block text-center text-sm text-teal-600 font-medium hover:underline"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-400">Loading…</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
