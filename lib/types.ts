export interface Slot {
  id: string;
  date: string;        // ISO date string YYYY-MM-DD
  time: string;        // HH:MM format
  available: boolean;
  created_at: string;
}

export interface Booking {
  id: string;
  patient_name: string;
  phone: string;
  slot_id: string;
  paid: boolean;
  confirmed: boolean;
  created_at: string;
  slots?: Slot;
}
