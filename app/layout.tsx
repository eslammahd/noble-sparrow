import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dr Saad El Mahdy — Online Therapy',
  description: 'Book an online therapy session with Dr Saad El Mahdy. Browse available slots and pay via Instapay or Vodafone Cash.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-teal-50 min-h-screen font-sans text-gray-800">{children}</body>
    </html>
  );
}
