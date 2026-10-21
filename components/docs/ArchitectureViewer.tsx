'use client';

import React, { useState } from 'react';
import { 
  Database, 
  Server, 
  ShieldCheck, 
  Workflow, 
  Check, 
  Copy, 
  Layers, 
  CreditCard,
  MessageSquare,
  Lock
} from 'lucide-react';

export const ArchitectureViewer: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'architecture' | 'webrtc' | 'sla_ledger' | 'schema'>('architecture');

  const copySchemaToClipboard = () => {
    setCopied(true);
    navigator.clipboard.writeText(`-- See supabase/schema.sql in the repository for full DDL`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-800 gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            System Architecture & Technical Specifications
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            "Just Doubts" by Saitechverse Solutions • Scalable Supabase, Next.js, WebRTC, and WhatsApp SLA Engine
          </p>
        </div>

        {/* Tab selection */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-xl text-xs">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'architecture' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Architecture
          </button>
          <button
            onClick={() => setActiveTab('webrtc')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'webrtc' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            WebRTC Hardware
          </button>
          <button
            onClick={() => setActiveTab('sla_ledger')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'sla_ledger' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            SLA & Ledger
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'schema' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Supabase DDL
          </button>
        </div>
      </div>

      {/* Tab 1: High Level System Architecture */}
      {activeTab === 'architecture' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                Client Layer
              </span>
              <h4 className="text-sm font-bold text-white mb-2">Next.js 16 App Router</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Student & Teacher portals, dynamic calendar booking (6 AM - 9 PM), dynamic pricing engine, hardware device enumeration.
              </p>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                Communication Bus
              </span>
              <h4 className="text-sm font-bold text-white mb-2">WhatsApp Cloud API</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Instant doubt dispatch with interactive buttons ("Claim Doubt", "Pass"). 20-min webhook delivery and SLA countdown.
              </p>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
              <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider block mb-1">
                Realtime & Database
              </span>
              <h4 className="text-sm font-bold text-white mb-2">Supabase PostgreSQL</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Row Level Security, KYC Storage buckets, Realtime Broadcast for WebRTC signaling, DLP trigger for contact number masking.
              </p>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                Settlement & Payouts
              </span>
              <h4 className="text-sm font-bold text-white mb-2">Automated Ledger</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Student escrow hold, dual completion release, 10% platform fee, 1% TDS, ₹20 SLA breach penalties, 24-hr bank payout.
              </p>
            </div>
          </div>

          {/* ASCII / Architectural Blueprint */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
            <pre>{`+-----------------------------------------------------------------------------------------------------+
|                               JUST DOUBTS SYSTEM ARCHITECTURE BLUEPRINT                              |
+-----------------------------------------------------------------------------------------------------+

[STUDENT PORTAL] (Class 10-12, NEET, JEE, GATE)
       │
       ├─► 1. Google OAuth Auth + Mandatory KYC ID Proof Upload
       ├─► 2. Doubt Submission (Subject: Math/Phys/Chem/Bio/Botany + Snapshot + Slot 6AM-9PM)
       └─► 3. Dynamic Base Pricing Calculation (₹150/30m or ₹300/60m + Exam Tier Factor)
                 │
                 ▼
[ROUTING & SLA ENGINE]
       │
       ├─► Filters Verified Teachers by Subject Array
       ├─► Dispatches Alert via WhatsApp Cloud API Webhook
       ├─► Starts 20-Minute Inaction SLA Countdown Timer
       │       └── If 20 mins expire without response => Automated ₹20 Penalty deducted from Teacher Wallet
       │
       └─► First Responder gets 5-Minute Lock
               └── Locks doubt for review; Teacher either Confirms or Passes to next teacher
                 │
                 ▼
[PAYMENT ESCROW GATE]
       │
       ├─► Student receives Match Notification (Teacher ID, Name, Experience, Exact Fee)
       └─► Student deposits Fee into Platform Escrow Wallet (No peer-to-peer risk)
                 │
                 ▼
[WEBRTC 1-ON-1 HARDWARE CLASSROOM]
       │
       ├─► navigator.mediaDevices Device Selector (Webcam, USB Document Camera)
       ├─► getDisplayMedia Screen Share (Digital Pen Tablet / Stylus Canvas)
       ├─► Interactive Smart Board HTML5 Canvas (Drawing math/science equations)
       ├─► Dynamic Session Clock (5-min remaining overtime alert dialog; auto-hangup at 00:00)
       └─► DLP Privacy Guarded Live Chat (Regex masking for Indian +91 phone numbers & emails)
                 │
                 ▼
[DUAL-CONFIRMATION SETTLEMENT & 24-HOUR PAYOUT]
       │
       ├─► Both Student & Teacher click "Session Completed Successfully"
       ├─► Atomic Stored Procedure:
       │       • Student Escrow Released
       │       • 10% Just Doubts Platform Commission Deducted
       │       • 1% Statutory TDS (Sec 194J/C) Deducted
       │       • Net Transferred to Teacher's Available Wallet
       └─► Automated Settlement Pipeline transfers funds to Verified Bank Account within 24 Hours`}</pre>
          </div>
        </div>
      )}

      {/* Tab 2: WebRTC Hardware Architecture */}
      {activeTab === 'webrtc' && (
        <div className="space-y-4">
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-rose-400" />
              Teacher Hardware Freedom & WebRTC Media Topology
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              To empower competitive teachers (JEE Advanced, NEET, GATE) who rely on derivations and diagrams, 
              Just Doubts provides a multi-stream WebRTC pipeline:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="font-bold text-white block mb-1">1. External Document Cameras</span>
                <p className="text-slate-400">
                  Detected via <code className="text-indigo-300">navigator.mediaDevices.enumerateDevices()</code>. Overhead USB doc cams stream 1080p paper solving.
                </p>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="font-bold text-white block mb-1">2. Digital Pen Tablets</span>
                <p className="text-slate-400">
                  Teachers using Wacom, Huion, or iPads stream smooth pressure-sensitive stylus strokes via built-in Smart Board or screen sharing.
                </p>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="font-bold text-white block mb-1">3. Coturn STUN / TURN Fallback</span>
                <p className="text-slate-400">
                  Direct P2P mesh WebRTC over UDP with symmetric NAT traversal via TURN servers ensuring zero dropped frames across Indian mobile broadband.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: SLA & Double-Entry Ledger */}
      {activeTab === 'sla_ledger' && (
        <div className="space-y-4">
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              SLA Penalty Engine & Financial Ledger Flow
            </h3>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-start gap-3">
                <span className="font-bold text-amber-400 shrink-0">₹20 Penalty Engine:</span>
                <span>
                  When a teacher is marked "Available" between 6 AM and 9 PM, they receive WhatsApp alerts. If no claim or pass occurs within 20 minutes, the background cron executes <code className="text-amber-300">process_sla_breach_penalties()</code>, deducting ₹20 from the teacher's wallet balance.
                </span>
              </div>

              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-start gap-3">
                <span className="font-bold text-emerald-400 shrink-0">10% Platform + 1% TDS Split:</span>
                <span>
                  Upon dual sign-off, <code className="text-emerald-300">settle_session_completion()</code> executes in an atomic transaction:
                  <br />
                  <span className="text-slate-400 font-mono mt-1 block">
                    Gross ₹300 - (10% = ₹30 Platform Commission) - (1% = ₹3 TDS) = ₹267 Net Credit to Teacher
                  </span>
                </span>
              </div>

              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-start gap-3">
                <span className="font-bold text-indigo-400 shrink-0">24-Hour Settlement Pipeline:</span>
                <span>
                  Payout records are generated with status 'pending' and scheduled settlement within 24 hours. Integrated with RazorpayX / Cashfree Payouts API using verified IFSC and Bank account hashes.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Supabase DDL Preview */}
      {activeTab === 'schema' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">
              PostgreSQL Schema (Location: <code className="text-indigo-400">supabase/schema.sql</code>)
            </span>
            <button
              onClick={copySchemaToClipboard}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied Path!' : 'Copy Script Path'}
            </button>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 max-h-96 overflow-y-auto">
            <pre>{`-- Available in workspace at supabase/schema.sql
-- Includes:
-- 1. Profiles & Student Profiles (Exam level, KYC ID proof)
-- 2. Teacher Profiles (Subjects array, Base rates, WhatsApp API)
-- 3. Teacher Availability (6 AM - 9 PM slots, default Available)
-- 4. Doubts & Routing (Subject matching, Exam Level)
-- 5. Doubt Dispatches & Claim Locks (20-min SLA, 5-min Lock)
-- 6. WebRTC Sessions & Dual Completion tracking
-- 7. Double-entry Wallets & Transactions (Escrow hold, 10% fee, 1% TDS, ₹20 penalties)
-- 8. Teacher Bank Accounts & 24-hr Payout Records
-- 9. Chat Messages & Automated DLP Phone/Email Regex Masking Trigger
-- 10. Complete Row Level Security (RLS) Policies for all roles`}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
