import { TeacherProfile, DoubtSubmission, TimeSlot } from '@/types';

export const INITIAL_TEACHERS: TeacherProfile[] = [
  {
    id: 'tch_001',
    fullName: 'Dr. Anand Raman',
    email: 'anand.raman@saitechverse.in',
    phoneMasked: '+91 98******42',
    experienceYears: 8.5,
    subjects: ['Physics', 'Mathematics'],
    baseRate30m: 150,
    baseRate60m: 300,
    rating: 4.95,
    totalReviews: 312,
    isAvailableNow: true,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bankAccount: {
      bankName: 'HDFC Bank',
      accountNumberLast4: '4821',
      ifscCode: 'HDFC0001245',
      isVerified: true,
    },
  },
  {
    id: 'tch_002',
    fullName: 'Prof. Sneha Deshmukh',
    email: 'sneha.deshmukh@saitechverse.in',
    phoneMasked: '+91 94******19',
    experienceYears: 6.0,
    subjects: ['Chemistry', 'Botany', 'Biology'],
    baseRate30m: 160,
    baseRate60m: 320,
    rating: 4.88,
    totalReviews: 184,
    isAvailableNow: true,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    bankAccount: {
      bankName: 'State Bank of India',
      accountNumberLast4: '9903',
      ifscCode: 'SBIN0004512',
      isVerified: true,
    },
  },
  {
    id: 'tch_003',
    fullName: 'Er. Rohan Mehta (IIT Delhi Alum)',
    email: 'rohan.mehta@saitechverse.in',
    phoneMasked: '+91 91******77',
    experienceYears: 4.5,
    subjects: ['Mathematics'],
    baseRate30m: 150,
    baseRate60m: 300,
    rating: 4.92,
    totalReviews: 96,
    isAvailableNow: true,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bankAccount: {
      bankName: 'ICICI Bank',
      accountNumberLast4: '1134',
      ifscCode: 'ICIC0000342',
      isVerified: true,
    },
  },
];

// Generates time slots between 6:00 AM and 9:00 PM for today
export function generateCalendarSlots(dateStr: string = 'Today'): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const startHour = 6;  // 6 AM
  const endHour = 21;   // 9 PM

  for (let hour = startHour; hour < endHour; hour++) {
    const hourFormatted = hour.toString().padStart(2, '0');
    const nextHourFormatted = (hour + 1).toString().padStart(2, '0');
    
    // First 30 min slot
    const slot1Start = `${hourFormatted}:00`;
    const slot1End = `${hourFormatted}:30`;
    const label1 = `${format12Hour(hour, 0)} - ${format12Hour(hour, 30)}`;
    slots.push({
      id: `slot_${hour}_1`,
      date: dateStr,
      startTime: slot1Start,
      endTime: slot1End,
      formattedLabel: label1,
      isAvailable: true,
    });

    // Second 30 min slot
    const slot2Start = `${hourFormatted}:30`;
    const slot2End = `${nextHourFormatted}:00`;
    const label2 = `${format12Hour(hour, 30)} - ${format12Hour(hour + 1, 0)}`;
    slots.push({
      id: `slot_${hour}_2`,
      date: dateStr,
      startTime: slot2Start,
      endTime: slot2End,
      formattedLabel: label2,
      isAvailable: true,
    });
  }

  return slots;
}

function format12Hour(hour: number, minute: number): string {
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  const displayMinute = minute === 0 ? '00' : minute.toString().padStart(2, '0');
  return `${displayHour}:${displayMinute} ${ampm}`;
}

export const SAMPLE_DOUBTS: DoubtSubmission[] = [
  {
    id: 'dbt_901',
    studentId: 'stu_101',
    studentName: 'Aarav Patel',
    subject: 'Physics',
    examLevel: 'JEE Advanced',
    title: 'Rotational Mechanics: Rolling without slipping on an inclined plane with friction',
    description: 'Stuck on calculating the angular acceleration when friction is static vs kinetic. Need derivation and free body diagram explanation.',
    specialRequests: ['Need handwritten notes', 'Focus on formula derivation'],
    durationMinutes: 30,
    preferredSlots: [
      {
        id: 'slot_10_1',
        date: 'Today',
        startTime: '10:00',
        endTime: '10:30',
        formattedLabel: '10:00 AM - 10:30 AM',
        isAvailable: true,
      },
    ],
    quotedPrice: 150,
    status: 'routed',
    createdAt: new Date().toISOString(),
    slaDeadlineAt: new Date(Date.now() + 18 * 60 * 1000).toISOString(), // 18 mins left
  },
  {
    id: 'dbt_902',
    studentId: 'stu_102',
    studentName: 'Priya Sharma',
    subject: 'Chemistry',
    examLevel: 'NEET',
    title: 'Aldol Condensation & Cannizzaro Reaction Cross-Mechanism',
    description: 'Difficulty predicting major vs minor products in crossed aldol condensation with alpha-hydrogen absence.',
    specialRequests: ['Step-by-step notes', 'Previous year NEET questions pattern'],
    durationMinutes: 60,
    preferredSlots: [
      {
        id: 'slot_14_1',
        date: 'Today',
        startTime: '14:00',
        endTime: '15:00',
        formattedLabel: '2:00 PM - 3:00 PM',
        isAvailable: true,
      },
    ],
    quotedPrice: 300,
    status: 'routed',
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    slaDeadlineAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
  },
];
