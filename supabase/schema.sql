-- ============================================================================
-- JUST DOUBTS by Saitechverse Solutions
-- PostgreSQL & Supabase Database Schema
-- Production-ready DDL with RLS, Triggers, Double-Entry Ledger, SLA Engine
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. ENUMS & DOMAINS
-- ============================================================================

CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin');
CREATE TYPE kyc_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE exam_level AS ENUM ('class_10', 'class_11', 'class_12', 'neet', 'jee_main', 'jee_advanced', 'gate');
CREATE TYPE subject_type AS ENUM ('mathematics', 'physics', 'chemistry', 'biology', 'botany');
CREATE TYPE doubt_status AS ENUM ('submitted', 'routed', 'claimed_locked', 'accepted_unpaid', 'paid_escrow', 'in_session', 'completed', 'cancelled', 'expired');
CREATE TYPE claim_lock_status AS ENUM ('active', 'confirmed', 'expired', 'released');
CREATE TYPE session_status AS ENUM ('scheduled', 'live', 'completed_pending_payout', 'settled', 'cancelled', 'auto_terminated');
CREATE TYPE transaction_type AS ENUM ('student_deposit', 'escrow_hold', 'escrow_refund', 'teacher_gross_credit', 'platform_fee_deduction', 'tds_deduction', 'sla_penalty_deduction', 'bank_payout_withdrawal');
CREATE TYPE payout_status AS ENUM ('pending', 'processing', 'settled_to_bank', 'failed');

-- ============================================================================
-- 2. USERS & PROFILES (Linked to Supabase auth.users)
-- ============================================================================

CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    phone_number TEXT NOT NULL, -- Stored securely, masked on frontend
    full_name TEXT NOT NULL,
    role user_role NOT NULL,
    avatar_url TEXT,
    id_proof_url TEXT NOT NULL, -- Mandatory KYC ID Proof upload
    kyc_status kyc_status DEFAULT 'pending' NOT NULL,
    kyc_verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index for phone number lookups
CREATE INDEX idx_profiles_phone ON public.profiles(phone_number);
CREATE INDEX idx_profiles_role ON public.profiles(role);

-- ============================================================================
-- 3. STUDENT PROFILES
-- ============================================================================

CREATE TABLE public.student_profiles (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    education_level exam_level NOT NULL,
    school_or_college TEXT,
    target_exam_year INT,
    total_doubts_resolved INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- 4. TEACHER PROFILES & BANK DETAILS
-- ============================================================================

CREATE TABLE public.teacher_profiles (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    experience_years NUMERIC(4, 1) NOT NULL DEFAULT 1.0,
    bio TEXT,
    subjects subject_type[] NOT NULL, -- Array of subjects the teacher is eligible for
    base_rate_30m NUMERIC(10, 2) DEFAULT 150.00 NOT NULL,
    base_rate_60m NUMERIC(10, 2) DEFAULT 300.00 NOT NULL,
    is_available_default BOOLEAN DEFAULT TRUE NOT NULL, -- Default "Available"
    rating NUMERIC(3, 2) DEFAULT 5.00 NOT NULL,
    total_reviews INT DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    whatsapp_number TEXT NOT NULL, -- For automated WhatsApp notifications
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_teacher_subjects ON public.teacher_profiles USING GIN(subjects);

-- Bank details for 24-hr automated payouts
CREATE TABLE public.teacher_bank_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES public.teacher_profiles(id) ON DELETE CASCADE,
    account_holder_name TEXT NOT NULL,
    account_number_encrypted TEXT NOT NULL, -- Encrypted bank account number
    account_number_last4 VARCHAR(4) NOT NULL,
    ifsc_code VARCHAR(11) NOT NULL,
    bank_name TEXT NOT NULL,
    upi_vpa TEXT,
    is_verified BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT uq_teacher_bank UNIQUE (teacher_id)
);

-- Teacher ₹99/month Onboarding Pass (Unlocks WhatsApp & App Doubt Dispatch for 30 Days)
CREATE TABLE public.teacher_onboarding_passes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES public.teacher_profiles(id) ON DELETE CASCADE,
    amount_paid NUMERIC(10, 2) DEFAULT 99.00 NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR' NOT NULL,
    payment_method VARCHAR(20) DEFAULT 'upi' NOT NULL,
    transaction_ref TEXT,
    activated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL, -- 30 days validity
    whatsapp_dispatch_active BOOLEAN DEFAULT TRUE NOT NULL,
    in_app_claim_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_teacher_pass_active ON public.teacher_onboarding_passes(teacher_id, expires_at);

-- ============================================================================
-- 5. TEACHER AVAILABILITY SLOTS (6 AM - 9 PM)
-- ============================================================================

CREATE TABLE public.teacher_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES public.teacher_profiles(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 6=Saturday
    start_time TIME NOT NULL CHECK (start_time >= '06:00:00' AND start_time < '21:00:00'),
    end_time TIME NOT NULL CHECK (end_time > '06:00:00' AND end_time <= '21:00:00'),
    is_available BOOLEAN DEFAULT TRUE NOT NULL, -- Default is Available unless set Unavailable
    CONSTRAINT chk_slot_order CHECK (end_time > start_time),
    CONSTRAINT uq_teacher_slot UNIQUE (teacher_id, day_of_week, start_time, end_time)
);

CREATE INDEX idx_teacher_avail ON public.teacher_availability(teacher_id, day_of_week, is_available);

-- ============================================================================
-- 6. DOUBTS & SCHEDULING
-- ============================================================================

CREATE TABLE public.doubts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject subject_type NOT NULL,
    target_exam exam_level NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT, -- Attached doubt photo or whiteboard snapshot
    special_requests TEXT, -- e.g. "Need notes", "Explain step by step"
    duration_minutes INT DEFAULT 30 CHECK (duration_minutes IN (30, 60, 90)),
    preferred_time_slots JSONB NOT NULL, -- Array of [{ "date": "2026-10-20", "startTime": "09:00", "endTime": "09:30" }]
    status doubt_status DEFAULT 'submitted' NOT NULL,
    quoted_price NUMERIC(10, 2) NOT NULL DEFAULT 150.00,
    accepted_teacher_id UUID REFERENCES public.teacher_profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_doubts_subject_status ON public.doubts(subject, status);
CREATE INDEX idx_doubts_student ON public.doubts(student_id);

-- ============================================================================
-- 7. ROUTING, WHATSAPP DISPATCH & SLA TRACKING (20 min SLA, 5 min Lock)
-- ============================================================================

-- Track WhatsApp notification dispatch to all eligible subject teachers
CREATE TABLE public.doubt_dispatches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doubt_id UUID NOT NULL REFERENCES public.doubts(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES public.teacher_profiles(id) ON DELETE CASCADE,
    whatsapp_message_id TEXT,
    sent_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    sla_deadline_at TIMESTAMPTZ NOT NULL, -- sent_at + 20 minutes
    responded_at TIMESTAMPTZ,
    status VARCHAR(30) DEFAULT 'delivered' CHECK (status IN ('delivered', 'read', 'accepted', 'rejected', 'sla_ignored')),
    penalty_applied BOOLEAN DEFAULT FALSE NOT NULL,
    CONSTRAINT uq_doubt_dispatch UNIQUE (doubt_id, teacher_id)
);

CREATE INDEX idx_dispatch_sla ON public.doubt_dispatches(sla_deadline_at, status) WHERE status = 'delivered';

-- 5-Minute First-Responder Lock
CREATE TABLE public.doubt_claim_locks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doubt_id UUID NOT NULL REFERENCES public.doubts(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES public.teacher_profiles(id) ON DELETE CASCADE,
    locked_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL, -- locked_at + 5 minutes
    status claim_lock_status DEFAULT 'active' NOT NULL,
    CONSTRAINT uq_active_doubt_claim UNIQUE (doubt_id)
);

-- ============================================================================
-- 8. WEBRTC SESSIONS & DUAL COMPLETION
-- ============================================================================

CREATE TABLE public.sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doubt_id UUID NOT NULL REFERENCES public.doubts(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id),
    teacher_id UUID NOT NULL REFERENCES public.teacher_profiles(id),
    webrtc_room_id TEXT NOT NULL UNIQUE,
    scheduled_start TIMESTAMPTZ NOT NULL,
    scheduled_end TIMESTAMPTZ NOT NULL,
    actual_start_at TIMESTAMPTZ,
    actual_end_at TIMESTAMPTZ,
    allocated_duration_minutes INT NOT NULL DEFAULT 30,
    overtime_minutes INT DEFAULT 0 NOT NULL,
    overtime_amount NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    total_cost NUMERIC(10, 2) NOT NULL,
    student_completed BOOLEAN DEFAULT FALSE NOT NULL,
    teacher_completed BOOLEAN DEFAULT FALSE NOT NULL,
    completed_at TIMESTAMPTZ,
    status session_status DEFAULT 'scheduled' NOT NULL,
    hardware_notes JSONB, -- Stores teacher input device metadata (e.g. Doc Cam, Pen Tablet screen share)
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_sessions_room ON public.sessions(webrtc_room_id);

-- ============================================================================
-- 9. WALLETS & DOUBLE-ENTRY LEDGER (Escrow, Commission, TDS, Penalties)
-- ============================================================================

CREATE TABLE public.wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    available_balance NUMERIC(12, 2) DEFAULT 0.00 NOT NULL CHECK (available_balance >= 0.00),
    escrow_locked_balance NUMERIC(12, 2) DEFAULT 0.00 NOT NULL CHECK (escrow_locked_balance >= 0.00),
    currency VARCHAR(3) DEFAULT 'INR' NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT uq_user_wallet UNIQUE (user_id)
);

CREATE TABLE public.wallet_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
    type transaction_type NOT NULL,
    amount NUMERIC(10, 2) NOT NULL, -- Positive for credits, negative for debits
    balance_after NUMERIC(12, 2) NOT NULL,
    reference_id UUID, -- Links to doubt_id, session_id, or payout_record_id
    description TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_wallet_tx_wallet ON public.wallet_transactions(wallet_id);

-- Teacher Payout Settlements (Within 24 Hours)
CREATE TABLE public.payout_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES public.teacher_profiles(id) ON DELETE CASCADE,
    session_id UUID REFERENCES public.sessions(id),
    gross_amount NUMERIC(10, 2) NOT NULL,
    platform_commission_10 NUMERIC(10, 2) NOT NULL, -- 10%
    tds_deduction_1 NUMERIC(10, 2) NOT NULL,         -- 1% TDS under Indian tax laws
    penalty_adjustments NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    net_payable_amount NUMERIC(10, 2) NOT NULL,
    status payout_status DEFAULT 'pending' NOT NULL,
    bank_reference_utr TEXT,
    scheduled_settlement_by TIMESTAMPTZ NOT NULL, -- completed_at + 24 hours
    settled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_payout_scheduled ON public.payout_records(scheduled_settlement_by, status);

-- ============================================================================
-- 10. REALTIME CHAT WITH DLP PRIVACY FILTER
-- ============================================================================

CREATE TABLE public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id),
    raw_message TEXT NOT NULL,
    masked_message TEXT NOT NULL, -- Contact numbers and emails obfuscated
    contains_contact_violation BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_chat_session ON public.chat_messages(session_id, created_at);

-- ============================================================================
-- 11. PRIVACY DLP FUNCTION & TRIGGER
-- Masks Indian mobile numbers (+91, 10-digit) and email addresses in chat
-- ============================================================================

CREATE OR REPLACE FUNCTION public.mask_contact_info()
RETURNS TRIGGER AS $$
DECLARE
    cleaned TEXT;
    violation BOOLEAN := FALSE;
BEGIN
    cleaned := NEW.raw_message;
    
    -- Check for Indian phone numbers (e.g., +91 9876543210, 98765-43210, etc.)
    IF cleaned ~* '(\+?91[\-\s]?)?[6789]\d{9}' OR cleaned ~* '\b\d{5}[\s\-]?\d{5}\b' THEN
        violation := TRUE;
        cleaned := regexp_replace(cleaned, '(\+?91[\-\s]?)?[6789]\d{9}', '[Phone Number Masked by Just Doubts]', 'g');
        cleaned := regexp_replace(cleaned, '\b\d{5}[\s\-]?\d{5}\b', '[Phone Number Masked by Just Doubts]', 'g');
    END IF;

    -- Check for Email addresses
    IF cleaned ~* '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}' THEN
        violation := TRUE;
        cleaned := regexp_replace(cleaned, '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}', '[Email Masked by Just Doubts]', 'g');
    END IF;

    NEW.masked_message := cleaned;
    NEW.contains_contact_violation := violation;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_mask_chat_contact_info
BEFORE INSERT ON public.chat_messages
FOR EACH ROW
EXECUTE FUNCTION public.mask_contact_info();

-- ============================================================================
-- 12. STORED PROCEDURE: ATOMIC SESSION SETTLEMENT
-- Executes when both Student and Teacher confirm "Session Completed Successfully"
-- Calculates: Gross, 10% Platform Commission, 1% TDS, Net to Teacher Wallet
-- ============================================================================

CREATE OR REPLACE FUNCTION public.settle_session_completion(p_session_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_session RECORD;
    v_doubt RECORD;
    v_gross NUMERIC(10, 2);
    v_commission NUMERIC(10, 2);
    v_tds NUMERIC(10, 2);
    v_net NUMERIC(10, 2);
    v_teacher_wallet_id UUID;
    v_student_wallet_id UUID;
    v_student_escrow NUMERIC(12, 2);
    v_new_teacher_bal NUMERIC(12, 2);
    v_payout_id UUID;
BEGIN
    -- 1. Fetch and lock session
    SELECT * INTO v_session FROM public.sessions WHERE id = p_session_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Session not found';
    END IF;

    IF NOT (v_session.student_completed AND v_session.teacher_completed) THEN
        RETURN jsonb_build_object('success', false, 'message', 'Both student and teacher must mark session complete');
    END IF;

    IF v_session.status = 'settled' THEN
        RETURN jsonb_build_object('success', false, 'message', 'Session is already settled');
    END IF;

    -- Calculate financial splits
    v_gross := v_session.total_cost + v_session.overtime_amount;
    v_commission := ROUND(v_gross * 0.10, 2); -- 10% Platform Commission
    v_tds := ROUND(v_gross * 0.01, 2);        -- 1% TDS
    v_net := v_gross - v_commission - v_tds;

    -- 2. Release Student Escrow hold
    SELECT id, escrow_locked_balance INTO v_student_wallet_id, v_student_escrow 
    FROM public.wallets WHERE user_id = v_session.student_id FOR UPDATE;

    UPDATE public.wallets 
    SET escrow_locked_balance = GREATEST(0, escrow_locked_balance - v_gross),
        updated_at = NOW()
    WHERE id = v_student_wallet_id;

    -- 3. Credit Teacher Wallet with net amount
    SELECT id INTO v_teacher_wallet_id 
    FROM public.wallets WHERE user_id = v_session.teacher_id FOR UPDATE;

    UPDATE public.wallets
    SET available_balance = available_balance + v_net,
        updated_at = NOW()
    WHERE id = v_teacher_wallet_id
    RETURNING available_balance INTO v_new_teacher_bal;

    -- 4. Record Ledger Entries
    INSERT INTO public.wallet_transactions (wallet_id, type, amount, balance_after, reference_id, description)
    VALUES 
    (v_teacher_wallet_id, 'teacher_gross_credit', v_gross, v_new_teacher_bal, p_session_id, 'Gross doubt resolution payout'),
    (v_teacher_wallet_id, 'platform_fee_deduction', -v_commission, v_new_teacher_bal, p_session_id, '10% Just Doubts platform commission'),
    (v_teacher_wallet_id, 'tds_deduction', -v_tds, v_new_teacher_bal, p_session_id, '1% statutory TDS deduction');

    -- 5. Create Payout Settlement record (scheduled within 24 hours to bank)
    INSERT INTO public.payout_records (
        teacher_id, session_id, gross_amount, platform_commission_10,
        tds_deduction_1, net_payable_amount, status, scheduled_settlement_by
    ) VALUES (
        v_session.teacher_id, p_session_id, v_gross, v_commission,
        v_tds, v_net, 'pending', NOW() + INTERVAL '24 hours'
    ) RETURNING id INTO v_payout_id;

    -- 6. Update Session Status
    UPDATE public.sessions
    SET status = 'settled',
        completed_at = NOW()
    WHERE id = p_session_id;

    -- 7. Update Doubt status
    UPDATE public.doubts SET status = 'completed' WHERE id = v_session.doubt_id;

    RETURN jsonb_build_object(
        'success', true,
        'gross', v_gross,
        'commission_10', v_commission,
        'tds_1', v_tds,
        'net_teacher_payout', v_net,
        'payout_id', v_payout_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 13. SLA PENALTY ENGINE: ₹20 DEDUCTION FOR 20-MIN INACTION
-- Can be invoked via pg_cron or Supabase Edge Functions every 60 seconds
-- ============================================================================

CREATE OR REPLACE FUNCTION public.process_sla_breach_penalties()
RETURNS INT AS $$
DECLARE
    r RECORD;
    v_penalties_count INT := 0;
    v_teacher_wallet_id UUID;
    v_current_bal NUMERIC(12, 2);
    v_new_bal NUMERIC(12, 2);
BEGIN
    FOR r IN 
        SELECT d.id AS dispatch_id, d.doubt_id, d.teacher_id
        FROM public.doubt_dispatches d
        JOIN public.teacher_profiles tp ON tp.id = d.teacher_id
        WHERE d.status = 'delivered'
          AND d.sla_deadline_at < NOW()
          AND d.penalty_applied = FALSE
    LOOP
        -- Get teacher wallet
        SELECT id, available_balance INTO v_teacher_wallet_id, v_current_bal
        FROM public.wallets WHERE user_id = r.teacher_id FOR UPDATE;

        IF FOUND THEN
            -- Deduct ₹20 penalty
            v_new_bal := GREATEST(0.00, v_current_bal - 20.00);
            
            UPDATE public.wallets
            SET available_balance = v_new_bal,
                updated_at = NOW()
            WHERE id = v_teacher_wallet_id;

            INSERT INTO public.wallet_transactions (
                wallet_id, type, amount, balance_after, reference_id, description
            ) VALUES (
                v_teacher_wallet_id, 'sla_penalty_deduction', -20.00, v_new_bal, r.doubt_id,
                '₹20 SLA breach penalty: Ignored doubt request for 20 minutes while marked Available'
            );

            UPDATE public.doubt_dispatches
            SET status = 'sla_ignored',
                penalty_applied = TRUE
            WHERE id = r.dispatch_id;

            v_penalties_count := v_penalties_count + 1;
        END IF;
    END LOOP;

    RETURN v_penalties_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 14. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doubts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doubt_dispatches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Profiles: Public can read basic tutor info, user can edit own
CREATE POLICY "Public profiles are readable" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Doubts: Student can see own doubts; verified teachers of same subject can see active requests
CREATE POLICY "Students see own doubts" ON public.doubts FOR ALL USING (auth.uid() = student_id);
CREATE POLICY "Teachers see routed subject doubts" ON public.doubts FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.teacher_profiles tp 
        WHERE tp.id = auth.uid() AND doubts.subject = ANY(tp.subjects)
    )
);

-- Sessions: Only assigned student and teacher can access the room
CREATE POLICY "Participants can view session" ON public.sessions FOR SELECT USING (
    auth.uid() = student_id OR auth.uid() = teacher_id
);
CREATE POLICY "Participants can update completion status" ON public.sessions FOR UPDATE USING (
    auth.uid() = student_id OR auth.uid() = teacher_id
);

-- Wallets: Strict privacy - only owner can view wallet & transactions
CREATE POLICY "Users view own wallet" ON public.wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users view own transactions" ON public.wallet_transactions FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.wallets w WHERE w.id = wallet_transactions.wallet_id AND w.user_id = auth.uid())
);

-- Bank details: Strict privacy - only teacher can view own bank details
CREATE POLICY "Teachers view own bank account" ON public.teacher_bank_accounts FOR ALL USING (auth.uid() = teacher_id);

-- Chat: Only session participants can read & send messages
CREATE POLICY "Session participants read chat" ON public.chat_messages FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.sessions s WHERE s.id = chat_messages.session_id AND (s.student_id = auth.uid() OR s.teacher_id = auth.uid()))
);
CREATE POLICY "Session participants insert chat" ON public.chat_messages FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND 
    EXISTS (SELECT 1 FROM public.sessions s WHERE s.id = chat_messages.session_id AND (s.student_id = auth.uid() OR s.teacher_id = auth.uid()))
);
