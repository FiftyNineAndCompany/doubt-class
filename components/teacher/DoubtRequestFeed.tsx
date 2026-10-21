'use client';

import React, { useState, useEffect } from 'react';
import { DoubtSubmission } from '@/types';
import { 
  MessageSquare, 
  Clock, 
  AlertOctagon, 
  Lock, 
  CheckCircle, 
  XCircle, 
  Sparkles,
  FileText,
  User,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

interface DoubtRequestFeedProps {
  doubts: DoubtSubmission[];
  currentTeacherId: string;
  onAcceptDoubt: (doubtId: string) => void;
  onApplyPenalty: (doubtId: string, amount: number) => void;
}

export const DoubtRequestFeed: React.FC<DoubtRequestFeedProps> = ({
  doubts,
  currentTeacherId,
  onAcceptDoubt,
  onApplyPenalty,
}) => {
  // 20-minute SLA countdown (in seconds)
  const [slaSeconds, setSlaSeconds] = useState<number>(20 * 60);
  
  // 5-minute Lock countdown (in seconds)
  const [lockedDoubtId, setLockedDoubtId] = useState<string | null>(null);
  const [lockSeconds, setLockSeconds] = useState<number>(5 * 60);
  const [penaltyTriggered, setPenaltyTriggered] = useState(false);

  // SLA 20-minute timer tick
  useEffect(() => {
    if (slaSeconds <= 0 && !penaltyTriggered) {
      setPenaltyTriggered(true);
      onApplyPenalty('dbt_sla_breach', 20);
      return;
    }
    const timer = setInterval(() => {
      setSlaSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [slaSeconds, penaltyTriggered, onApplyPenalty]);

  // 5-minute Claim Lock timer tick
  useEffect(() => {
    if (!lockedDoubtId) return;
    if (lockSeconds <= 0) {
      // Lock expired, release back
      setLockedDoubtId(null);
      setLockSeconds(5 * 60);
      return;
    }
    const timer = setInterval(() => {
      setLockSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [lockedDoubtId, lockSeconds]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleClaim = (doubtId: string) => {
    setLockedDoubtId(doubtId);
    setLockSeconds(5 * 60); // 5 minutes lock
  };

  const handleConfirmAcceptance = (doubtId: string) => {
    onAcceptDoubt(doubtId);
    setLockedDoubtId(null);
  };

  const handleReleaseLock = () => {
    setLockedDoubtId(null);
    setLockSeconds(5 * 60);
  };

  // Calculate percentage of 20-min window
  const slaPercentage = Math.round((slaSeconds / (20 * 60)) * 100);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-800 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">WhatsApp SLA Dispatch Feed</h2>
              <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Webhook Connected
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Direct routing for your subjects. First responder gets exclusive 5-minute lock.
            </p>
          </div>
        </div>

        {/* Global SLA status indicator */}
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs">
          <Clock className="w-4 h-4 text-amber-400" />
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">SLA Countdown</span>
            <span className={`font-mono font-bold ${slaSeconds < 300 ? 'text-rose-400 animate-pulse' : 'text-amber-400'}`}>
              {formatTimer(slaSeconds)} (20m Window)
            </span>
          </div>
        </div>
      </div>

      {/* Penalty Alert Bar */}
      {penaltyTriggered ? (
        <div className="bg-rose-500/10 border border-rose-500/40 rounded-xl p-4 flex items-center gap-3 text-rose-300 text-xs">
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
          <div>
            <strong className="text-white font-bold">₹20 Penalty Deducted: </strong>
            You remained marked 'Available' but did not respond to the doubt request within 20 minutes. Deducted from your wallet ledger.
          </div>
        </div>
      ) : (
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              WhatsApp Response Window (20-Min SLA)
            </span>
            <span className="text-amber-400 font-mono">{formatTimer(slaSeconds)} remaining</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                slaPercentage > 50 ? 'bg-emerald-500' : slaPercentage > 25 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${slaPercentage}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400">
            Failing to claim or reject before timer expires triggers an automated ₹20 deduction under SLA terms.
          </p>
        </div>
      )}

      {/* Active Doubt Requests List */}
      <div className="space-y-4">
        {doubts.map((doubt) => {
          const isLockedByMe = lockedDoubtId === doubt.id;
          const isLockedByOther = lockedDoubtId && !isLockedByMe;

          return (
            <div
              key={doubt.id}
              className={`rounded-2xl border p-5 transition-all relative ${
                isLockedByMe
                  ? 'border-indigo-500 bg-indigo-950/30 shadow-xl shadow-indigo-500/10'
                  : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    {doubt.subject}
                  </span>
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                    {doubt.examLevel}
                  </span>
                  <span className="text-xs text-slate-400">
                    Student: <strong className="text-white">{doubt.studentName}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-medium">Session Payout</span>
                    <span className="font-extrabold text-base text-emerald-400">₹{doubt.quotedPrice}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-medium">Allocated Time</span>
                    <span className="font-bold text-white">{doubt.durationMinutes} Minutes</span>
                  </div>
                </div>
              </div>

              {/* Title & Description */}
              <div className="my-4 space-y-2">
                <h3 className="text-base font-bold text-white leading-snug">{doubt.title}</h3>
                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  {doubt.description}
                </p>
              </div>

              {/* Special Requests & Attached Image Preview */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
                <div className="flex flex-wrap gap-1.5">
                  {doubt.specialRequests.map((req, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-medium border border-slate-700"
                    >
                      • {req}
                    </span>
                  ))}
                </div>

                {doubt.imageUrl && (
                  <span className="text-[11px] text-indigo-400 underline cursor-pointer hover:text-indigo-300">
                    📷 View Attached Question Photo
                  </span>
                )}
              </div>

              {/* Action State: Claim vs 5-Min Lock */}
              <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                {isLockedByMe ? (
                  <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 bg-indigo-950/60 border border-indigo-500/50 p-3.5 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-indigo-400" />
                      <div>
                        <span className="text-xs font-bold text-white block">
                          5-Minute Review Lock Active
                        </span>
                        <span className="text-[11px] text-indigo-300">
                          Review question & confirm before lock expires in:{' '}
                          <strong className="text-amber-400 font-mono font-bold">
                            {formatTimer(lockSeconds)}
                          </strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={handleReleaseLock}
                        className="flex-1 sm:flex-none px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                      >
                        Pass to Next
                      </button>
                      <button
                        onClick={() => handleConfirmAcceptance(doubt.id)}
                        className="flex-1 sm:flex-none px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Confirm & Accept Session
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-xs text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Received via WhatsApp Cloud API • First responder gets 5-min review lock</span>
                    </div>

                    <button
                      onClick={() => handleClaim(doubt.id)}
                      disabled={Boolean(isLockedByOther)}
                      className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                        isLockedByOther
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                      }`}
                    >
                      <Lock className="w-3.5 h-3.5" />
                      {isLockedByOther ? 'Locked by another tutor' : 'Claim Doubt (5-Min Lock)'}
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
