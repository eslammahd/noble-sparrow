'use client';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export default function ConfirmationPage() {
  const params = useSearchParams();
  const bookingId = params.get('booking');
  const date = params.get('date') ?? '';
  const time = params.get('time') ?? '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-50">
      <header className="bg-white shadow-sm border-b border-teal-100">
        <div className="max-w-3xl mx-auto px-4 py-5">
          <h1 className="text-xl font-semibold text-gray-900">Dr Saad El Mahdy &mdash; Online Therapy</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-12 space-y-6">
        {/* Success banner */}
        <div className="bg-teal-600 text-white rounded-2xl px-6 py-6 text-center shadow">
          <div className="text-4xl mb-3">✅</div>
          <h2 className="text-2xl font-bold mb-1">Booking Confirmed!</h2>
          <p className="text-teal-100 text-sm">Your slot has been reserved successfully.</p>
          {bookingId && <p className="text-teal-200 text-xs mt-2">Ref: #{bookingId.slice(0, 8).toUpperCase()}</p>}
        </div>

        {/* Session details */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Session Details</h3>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Date</span>
            <span className="font-medium text-gray-900">{date ? formatDate(date) : '—'}</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-gray-500">Time</span>
            <span className="font-medium text-gray-900">{time ? time.slice(0, 5) : '—'}</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-gray-500">Format</span>
            <span className="font-medium text-gray-900">Online (link sent after payment)</span>
          </div>
        </div>

        {/* Payment instructions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Complete Your Payment</h3>
          <p className="text-sm text-gray-500 mb-5">
            Please send the session fee using <strong>either</strong> of the methods below, then wait for Dr Saad to confirm your booking.
          </p>

          {/* Instapay */}
          <div className="border border-blue-100 bg-blue-50 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🟦</span>
              <span className="font-semibold text-blue-800">Instapay</span>
            </div>
            <p className="text-sm text-blue-700">
              Open your banking app &rarr; Instapay &rarr; Send Money
            </p>
            <div className="mt-3 bg-white rounded-lg px-4 py-3 border border-blue-200">
              <p className="text-xs text-gray-400 mb-0.5">IPA Username</p>
              <p className="text-base font-bold text-gray-900 tracking-wide select-all">drsaad.therapy@instapay</p>
            </div>
          </div>

          {/* Vodafone Cash */}
          <div className="border border-red-100 bg-red-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">📱</span>
              <span className="font-semibold text-red-800">Vodafone Cash</span>
            </div>
            <p className="text-sm text-red-700">
              Open Vodafone Cash &rarr; Send &rarr; Enter number below
            </p>
            <div className="mt-3 bg-white rounded-lg px-4 py-3 border border-red-200">
              <p className="text-xs text-gray-400 mb-0.5">Vodafone Number</p>
              <p className="text-base font-bold text-gray-900 tracking-wide select-all">010XXXXXXXX</p>
            </div>
          </div>
        </div>

        {/* Next steps */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-amber-800 mb-2">ℹ️ What happens next?</h3>
          <ol className="text-sm text-amber-700 space-y-1 list-decimal list-inside">
            <li>Send the payment using Instapay or Vodafone Cash.</li>
            <li>Dr Saad will verify your payment and confirm your booking.</li>
            <li>You’ll receive the online meeting link before your session time.</li>
          </ol>
        </div>

        <div className="text-center">
          <Link href="/" className="text-teal-600 hover:text-teal-800 text-sm font-medium underline">
            ← Back to homepage
          </Link>
        </div>
      </main>

      <footer className="text-center py-8 text-sm text-gray-400">
        &copy; {new Date().getFullYear()} Dr Saad El Mahdy &mdash; All rights reserved
      </footer>
    </div>
  );
}
