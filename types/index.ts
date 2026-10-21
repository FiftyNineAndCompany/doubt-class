export type UserRole = 'student' | 'teacher' | 'admin';

export type Subject = 'Mathematics' | 'Physics' | 'Chemistry' | 'Biology' | 'Botany';

export type ExamLevel = 'Class 10' | 'Class 11' | 'Class 12' | 'NEET' | 'JEE Main' | 'JEE Advanced' | 'GATE';

export type DoubtStatus = 
  | 'submitted'
  | 'routed'
  | 'claimed_locked'
  | 'accepted_unpaid'
  | 'paid_escrow'
  | 'in_session'
  | 'completed'
  | 'cancelled';

export interface TimeSlot {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm, e.g. "07:00"
  endTime: string;   // HH:mm, e.g. "07:30"
  formattedLabel: string;
  isAvailable: boolean;
}

export interface StudentProfile {
  id: string;
  fullName: string;
  email: string;
  phoneMasked: string;
  educationLevel: ExamLevel;
  targetExamYear: number;
  idProofUrl: string;
  isKycVerified: boolean;
}

export interface TeacherProfile {
  id: string;
  fullName: string;
  email: string;
  phoneMasked: string;
  experienceYears: number;
  subjects: Subject[];
  baseRate30m: number;
  baseRate60m: number;
  rating: number;
  totalReviews: number;
  isAvailableNow: boolean;
  avatarUrl: string;
  bankAccount: {
    bankName: string;
    accountNumberLast4: string;
    ifscCode: string;
    isVerified: boolean;
  };
}

export interface DoubtSubmission {
  id: string;
  studentId: string;
  studentName: string;
  subject: Subject;
  examLevel: ExamLevel;
  title: string;
  description: string;
  imageUrl?: string;
  specialRequests: string[];
  durationMinutes: 30 | 60;
  preferredSlots: TimeSlot[];
  quotedPrice: number;
  status: DoubtStatus;
  createdAt: string;
  acceptedTeacher?: {
    id: string;
    name: string;
    experienceYears: number;
    rating: number;
    avatarUrl: string;
    quotedFee: number;
  };
  claimedByTeacherId?: string;
  claimLockExpiresAt?: string; // 5 min lock
  slaDeadlineAt?: string;      // 20 min SLA
}

export interface WalletState {
  userId: string;
  role: UserRole;
  availableBalance: number;
  escrowLockedBalance: number;
  currency: string;
  history: WalletTransaction[];
}

export interface WalletTransaction {
  id: string;
  type: 
    | 'deposit'
    | 'escrow_hold'
    | 'escrow_release'
    | 'teacher_credit'
    | 'platform_fee'
    | 'tds_deduction'
    | 'sla_penalty';
  amount: number;
  balanceAfter: number;
  description: string;
  timestamp: string;
  referenceId?: string;
}

export interface WebRTCDevice {
  deviceId: string;
  label: string;
  kind: 'videoinput' | 'audioinput' | 'audiooutput';
  typeTag?: 'webcam' | 'doc_cam' | 'smart_board' | 'pen_tablet';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  rawText: string;
  maskedText: string;
  hasContactViolation: boolean;
  timestamp: string;
}
