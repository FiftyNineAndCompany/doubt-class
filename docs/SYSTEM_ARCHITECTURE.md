# Just Doubts — System Architecture & Production Specifications
**Company:** Saitechverse Solutions  
**Platform:** Just Doubts (1-on-1 Instant Doubt Resolution for Class 10-12, NEET, JEE & GATE)

---

## 1. Executive Summary & Topology

Just Doubts is an on-demand EdTech marketplace bridging students preparing for high-stakes Indian entrance examinations (NEET, JEE Mains/Advanced, GATE) and senior secondary classes (10-12) with specialized domain teachers.

Key platform pillars:
- **Instant Dispatch with SLA Guarantee:** Direct routing to qualified teachers with a 20-minute SLA window and ₹20 automated penalty for unaddressed queries during marked "Available" slots.
- **Fair Marketplace Escrow Ledger:** Double-entry accounting preventing fraud. Student funds are locked in escrow upon match and only released once both parties click "Session Completed Successfully". 10% platform fee and 1% TDS are deducted automatically before 24-hour bank payout.
- **Hardware Agnostic WebRTC Classroom:** Native support for external document cameras (overhead paper problem solving), digital pen tablets (Wacom/Huion/iPad stylus input via Smart Board), and screen sharing.
- **Privacy & Data Loss Prevention (DLP):** Realtime regex scrubbing of contact information (mobile numbers, emails, social handles) preventing platform bypass.

```
+--------------------------------------------------------------------------------------------------+
|                                  JUST DOUBTS ARCHITECTURE TOPOLOGY                                |
+--------------------------------------------------------------------------------------------------+

[Student Device]                                            [Teacher Device]
 (Web / Mobile)                                              (Laptop + Pen Tablet / Doc Cam)
       │                                                           │
       ├─────────────── Google OAuth / Supabase Auth ──────────────┤
       │                                                           │
       ▼                                                           ▼
[Next.js 16 App Router]                                    [WhatsApp Cloud API Webhook]
  • Student Portal                                           • 20-Minute SLA Notification
  • 6AM-9PM Calendar Booking                                 • 5-Minute First-Responder Lock
  • Dynamic Pricing Calculator                               • Interactive Claim / Pass Actions
       │                                                           │
       ├───────────────────────────────────────────────────────────┤
       │
       ▼
[Supabase Backend (PostgreSQL 15)]
  ├── Auth & Profiles (Students, Teachers, KYC ID Proofs)
  ├── Teacher Availability (6 AM - 9 PM Matrix)
  ├── Doubts, Dispatches & Claim Locks
  ├── Realtime Broadcast (WebRTC Signaling: SDP Offer/Answer, ICE)
  ├── Double-Entry Ledger (Escrow holds, 10% Platform fee, 1% TDS, ₹20 Penalties)
  └── Chat Messages (Auto-DLP Regex Trigger)
       │
       ├──► [pg_cron / Edge Workers] ──► Checks 20-min SLA breaches every 60s -> Deducts ₹20
       │
       └──► [RazorpayX / Cashfree API] ──► Settles Teacher Payouts to Bank within 24 Hours
```

---

## 2. WhatsApp SLA & First-Responder Lock Engine

### 2.1 Routing Algorithm
When a student submits a doubt for `Mathematics` at `JEE Advanced` level:
1. The database queries active teachers whose `subjects` array contains `Mathematics`.
2. Teachers currently in an active slot between 6:00 AM and 9:00 PM marked `is_available = true` are selected.
3. An automated WhatsApp dispatch template is sent via WhatsApp Cloud API / Twilio to their verified WhatsApp number.
4. An entry in `doubt_dispatches` is created with:
   - `sent_at = NOW()`
   - `sla_deadline_at = NOW() + INTERVAL '20 minutes'`
   - `status = 'delivered'`

### 2.2 5-Minute Claim Lock
To prevent race conditions where multiple teachers begin preparing simultaneously:
- The first teacher to click **"Claim Doubt"** acquires a row-level lock in `doubt_claim_locks`.
- `expires_at = NOW() + INTERVAL '5 minutes'`.
- During these 5 minutes, the doubt is hidden from other teachers while the first responder reviews the question photo and student special requests.
- If confirmed: Doubt moves to `accepted_unpaid` and triggers an acceptance push notification to the student.
- If passed or expired: Lock is released back to the next available teacher in the dispatch queue.

### 2.3 Automated ₹20 Penalty Enforcement
Under platform rules, teachers marked "Available" must maintain readiness. 
If an alert reaches `sla_deadline_at < NOW()` without an accept or pass:
- The background scheduled function `process_sla_breach_penalties()` fires.
- A ₹20 penalty is deducted from the teacher's wallet ledger:
  ```sql
  INSERT INTO public.wallet_transactions (wallet_id, type, amount, description)
  VALUES (v_teacher_wallet_id, 'sla_penalty_deduction', -20.00, '₹20 SLA breach penalty: Ignored doubt request for 20 minutes while marked Available');
  ```
- The dispatch status updates to `sla_ignored`.

---

## 3. Financial Architecture & Double-Entry Ledger

### 3.1 Escrow State Machine
To guarantee safety for both parties:
1. **Submission:** Student selects 30 min (₹150) or 60 min (₹300).
2. **Acceptance:** Student receives notification with Teacher ID, Name, Experience, and exact fee.
3. **Escrow Hold:** Student authorizes payment. The funds move from `available_balance` to `escrow_locked_balance` in `wallets`. (Teacher cannot withdraw yet; student cannot double-spend).
4. **Session Execution:** WebRTC session connects.
5. **Dual Completion:** Both parties click **"Session Completed Successfully"**.

### 3.2 Commission & TDS Calculation
Once both student and teacher confirm:
```
Gross Doubt Fee:           ₹300.00
Platform Commission (10%): -₹30.00
Statutory TDS (1%):         -₹3.00
Net Credit to Teacher:     ₹267.00
```
- **TDS Compliance:** Deducted under Indian Income Tax Act (Section 194J / 194C) for technical/professional consultancy. Form 16A is generated quarterly.
- **Settlement Window:** Net payable is recorded in `payout_records` with `scheduled_settlement_by = NOW() + INTERVAL '24 hours'`, transferring automatically to the teacher's verified bank account via IMPS/NEFT.

---

## 4. WebRTC Hardware Classroom Architecture

### 4.1 Hardware Freedom (`navigator.mediaDevices`)
Teachers in STEM subjects require diverse inputs. The classroom supports:
1. **Standard Webcams:** Face-to-face rapport and audio communication.
2. **Overhead Document Cameras:** USB document cameras (e.g., IPEVO, OKIOLABS) detected via `navigator.mediaDevices.enumerateDevices()`. The teacher streams high-resolution paper handwriting for geometric proofs and chemical reaction mechanisms.
3. **Digital Pen Tablets:** Native integration for Wacom, Huion, and stylus devices using pressure-sensitive HTML5 canvas, or via screen capture (`getDisplayMedia`).

### 4.2 Session Timer & Overtime Protocol
- Live on-screen timer synchronizes against server timestamps.
- **5-Minute Warning:** At `05:00`, a modal prompts the student: *"5 minutes remaining. Authorize +15 minutes overtime for ₹75?"*
- If approved, escrow is updated, and the clock increments.
- If rejected or unanswered, the WebRTC peer connection terminates cleanly at `00:00`.

---

## 5. Privacy & Data Loss Prevention (DLP)

To prevent off-platform poaching and protect student/teacher privacy:
1. **Phone Masking:** Phone numbers are strictly masked across all UI views (`+91 98******42`).
2. **Chat DLP Regex Engine:**
   - Detects 10-digit Indian mobile formats (`[6789]\d{9}`), spaced or dashed numbers (`98765 43210`).
   - Obfuscates emails and external messaging links (`wa.me`, `t.me`).
   - Replaces offending text with `[Phone Number Masked by Just Doubts]`.
   - Triggers an automated database trigger `mask_contact_info()` before saving to PostgreSQL.
