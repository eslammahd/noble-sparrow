import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const password = searchParams.get('password');
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { data, error } = await supabaseAdmin
    .from('bookings')
    .select('*, slots(date, time)')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const { patient_name, phone, slot_id } = await req.json();
  if (!patient_name || !phone || !slot_id) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  // Mark slot as unavailable
  await supabaseAdmin.from('slots').update({ available: false }).eq('id', slot_id);

  const { data, error } = await supabaseAdmin
    .from('bookings')
    .insert({ patient_name, phone, slot_id })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(req: Request) {
  const { password, id, paid, confirmed } = await req.json();
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const updates: Record<string, boolean> = {};
  if (paid !== undefined) updates.paid = paid;
  if (confirmed !== undefined) updates.confirmed = confirmed;

  const { data, error } = await supabaseAdmin
    .from('bookings')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
