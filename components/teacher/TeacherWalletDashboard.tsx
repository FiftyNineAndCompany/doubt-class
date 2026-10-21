'use client';

import React from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ShieldCheck, 
  Building, 
  Clock, 
  CheckCircle2, 
  Percent, 
  Receipt,
  AlertCircle
} from 'lucide-react';

interface TeacherWalletDashboardProps {
  balance: number;
  bankAccount: {
    bankName: string;
    accountNumberLast4: string;
    ifscCode: string;
    isVerified: boolean;
  };
}

export const TeacherWalletDashboard: React.FC<TeacherWalletDashboardProps> = ({
  balance,
  bankAccount,
}) => {
  // Sample ledger demonstration
  const sampleGross = 300;
  const platformCommission = sampleGross * 0.10; // 10% = ₹30
  const tdsDeduction = sampleGross * 0.01;         // 1% = ₹3
  const netEarnings = sampleGross - platformCommission - tdsDeduction; // ₹267

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-800 gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Wallet className="w-5 h-5 text-indigo-400" />
            Teacher Wallet & Automated Payouts
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Automated double-entry settlement. 10% platform commission + 1% statutory TDS deducted. Settled within 24h.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
          <Clock className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-emerald-400">
            Next Bank Payout: Within 24 Hours
          </span>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Available Wallet Balance */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Available Wallet Balance
          </span>
          <span className="text-3xl font-black text-white">₹{balance}</span>
          <span className="text-[10px] text-emerald-400 block mt-1">
            Ready for automated daily payout
          </span>
        </div>

        {/* Platform Deduction Standard */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Platform Commission
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-indigo-400">10%</span>
            <span className="text-xs text-slate-400">Flat Fee</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">
            Covers WebRTC servers, routing & storage
          </span>
        </div>

        {/* Statutory TDS Rate */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Statutory TDS (Tax Deducted)
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-400">1%</span>
            <span className="text-xs text-slate-400">Section 194J/C</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">
            Deposited with PAN tax receipt
          </span>
        </div>
      </div>

      {/* Transparent Ledger Breakdown & Bank Account Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sample Session Ledger Split Calculator */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Receipt className="w-4 h-4 text-indigo-400" />
              Automated Session Settlement Breakdown (Sample ₹300 Session)
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
              Instant Split
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-300">Gross Student Fee (60 mins)</span>
              <span className="font-bold text-white">₹{sampleGross}.00</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-800/60 text-indigo-300">
              <span>Less: 10% Just Doubts Commission</span>
              <span className="font-bold">-₹{platformCommission.toFixed(2)}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-800/60 text-amber-300">
              <span>Less: 1% Statutory TDS</span>
              <span className="font-bold">-₹{tdsDeduction.toFixed(2)}</span>
            </div>

            <div className="flex justify-between pt-2 text-sm font-extrabold">
              <span className="text-emerald-400">Net Credit to Teacher Wallet</span>
              <span className="text-emerald-400 text-base">₹{netEarnings.toFixed(2)}</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 pt-2">
            *In case of an unanswered doubt while Available, an automated -₹20 line item is recorded in the transaction history.
          </p>
        </div>

        {/* Bank Account Verification Details */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Building className="w-4 h-4 text-emerald-400" />
              Verified Settlement Bank Account
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded flex items-center gap-1 font-bold">
              <ShieldCheck className="w-3 h-3" />
              Penny Drop Verified
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Bank Name</span>
              <span className="font-bold text-white">{bankAccount.bankName}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Account Number</span>
              <span className="font-bold font-mono text-white">
                •••• •••• •••• {bankAccount.accountNumberLast4}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">IFSC Code</span>
              <span className="font-bold font-mono text-white">{bankAccount.ifscCode}</span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-slate-400">Payout Protocol</span>
              <span className="font-semibold text-indigo-300">Automated IMPS / NEFT (T+1)</span>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Automatic transfer triggers every 24 hours without withdrawal fees.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
