'use client';

import React, { useState } from 'react';
import { DoubtSubmission } from '@/types';
import { 
  CheckCircle, 
  ShieldCheck, 
  Star, 
  Video, 
  Lock, 
  ArrowRight,
  Wallet,
  Clock
} from 'lucide-react';

interface TeacherMatchBannerProps {
  doubt: DoubtSubmission;
  studentBalance: number;
  onPayAndJoinSession: (doubtId: string) => void;
}

export const TeacherMatchBanner: React.FC<TeacherMatchBannerProps> = ({
  doubt,
  studentBalance,
  onPayAndJoinSession,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const teacher = doubt.acceptedTeacher;

  if (!teacher) return null;

  const cost = teacher.quotedFee || doubt.quotedPrice;
  const hasSufficientBalance = studentBalance >= cost;

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onPayAndJoinSession(doubt.id);
    }, 1200);
  };

  return (
    <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 border border-emerald-500/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
      {/* Top Banner Tag */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            Teacher Matched & Confirmed
          </span>
        </div>
        <span className="text-[11px] text-slate-400 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          Scheduled Duration: {doubt.durationMinutes} Mins
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Teacher Details Card */}
        <div className="lg:col-span-7 flex items-center gap-4">
          <div className="relative">
            <img
              src={teacher.avatarUrl}
              alt={teacher.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/60 shadow-lg"
            />
            <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
              <Star className="w-2.5 h-2.5 fill-current" />
              {teacher.rating}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">{teacher.name}</h3>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono border border-slate-700">
                ID: {teacher.id}
              </span>
            </div>
            <p className="text-xs text-indigo-300 font-medium">
              Verified {doubt.subject} Faculty • {teacher.experienceYears} Years Teaching Experience
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Identity & Credentials Verified by Saitechverse</span>
            </div>
          </div>
        </div>

        {/* Payment & Join WebRTC Escrow Box */}
        <div className="lg:col-span-5 bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                Required Session Fee
              </span>
              <span className="text-2xl font-black text-white">₹{cost}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-medium">Platform Escrow</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 justify-end">
                <Lock className="w-3 h-3" /> 100% Safe Hold
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            Funds will remain safely locked in platform escrow and will only be released to the teacher after you click "Session Completed Successfully".
          </p>

          {hasSufficientBalance ? (
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Locking Funds in Escrow...
                </>
              ) : (
                <>
                  <Video className="w-4 h-4" />
                  Pay ₹{cost} & Enter 1-on-1 Classroom
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          ) : (
            <div className="space-y-2">
              <div className="text-xs text-rose-400 flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5" />
                Insufficient Wallet Balance (Current: ₹{studentBalance})
              </div>
              <button
                onClick={() => alert(`Add at least ₹${cost - studentBalance} to your student wallet via UPI/Card to proceed.`)}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
              >
                Top-up Wallet (+₹{cost})
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
