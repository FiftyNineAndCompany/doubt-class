'use client';

import React, { useState } from 'react';
import { Subject, TimeSlot } from '@/types';
import { generateCalendarSlots } from '@/lib/mock-data';
import { 
  Clock, 
  Calendar, 
  Check, 
  AlertTriangle, 
  Settings, 
  Sparkles,
  Info
} from 'lucide-react';

const ALL_SUBJECTS: Subject[] = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Botany'];

export const TeacherAvailabilityManager: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>(['Physics', 'Mathematics']);
  const [rate30m, setRate30m] = useState<number>(150);
  const [rate60m, setRate60m] = useState<number>(300);

  // Initial 6 AM - 9 PM slots (Default: ALL Available)
  const initialSlots = generateCalendarSlots('Today');
  const [slots, setSlots] = useState<TimeSlot[]>(initialSlots);
  const [saveToast, setSaveToast] = useState(false);

  const toggleSlotAvailability = (slotId: string) => {
    setSlots(prev =>
      prev.map(s => s.id === slotId ? { ...s, isAvailable: !s.isAvailable } : s)
    );
  };

  const toggleSubject = (sub: Subject) => {
    setSubjects(prev =>
      prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub]
    );
  };

  const markAll = (available: boolean) => {
    setSlots(prev => prev.map(s => ({ ...s, isAvailable: available })));
  };

  const handleSave = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const availableCount = slots.filter(s => s.isAvailable).length;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-800 gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-violet-400" />
            Teacher Availability & Rate Settings
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Set your daily active teaching hours (6:00 AM - 9:00 PM). Default status is 
            <span className="text-emerald-400 font-semibold"> Available</span>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => markAll(true)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 rounded-lg"
          >
            Mark All Available
          </button>
          <button
            onClick={() => markAll(false)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 rounded-lg"
          >
            Mark All Unavailable
          </button>
        </div>
      </div>

      {/* SLA Penalty Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-200/90 leading-relaxed">
          <strong className="text-amber-300 font-bold">Strict SLA Policy: </strong>
          When a time slot is marked <span className="font-bold underline text-white">Available</span>, 
          you will receive student doubt alerts via WhatsApp. You have <strong className="text-white">20 minutes</strong> to respond. 
          If a request goes unaddressed for 20 minutes while you are marked Available, a <strong className="text-white">₹20 penalty</strong> is automatically deducted from your wallet balance. 
          Mark slots <em>Unavailable</em> whenever taking a break.
        </div>
      </div>

      {/* Pricing & Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Subject Expertise */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Subject Certifications
          </label>
          <p className="text-[11px] text-slate-400 mb-3">
            You will only receive doubt dispatches matching your selected subjects.
          </p>
          <div className="flex flex-wrap gap-2">
            {ALL_SUBJECTS.map((sub) => {
              const active = subjects.includes(sub);
              return (
                <button
                  type="button"
                  key={sub}
                  onClick={() => toggleSubject(sub)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 ${
                    active
                      ? 'border-violet-500 bg-violet-950/40 text-violet-300'
                      : 'border-slate-800 bg-slate-900 text-slate-500'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${active ? 'bg-violet-400' : 'bg-slate-600'}`} />
                  {sub}
                </button>
              );
            })}
          </div>
        </div>

        {/* Pricing Configuration */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Custom Session Pricing
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[11px] text-slate-400 block mb-1">30-Min Resolution</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  min={150}
                  step={10}
                  value={rate30m}
                  onChange={(e) => setRate30m(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-bold focus:outline-none focus:border-violet-500"
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">Starts at ₹150</span>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 block mb-1">60-Min In-Depth</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  min={300}
                  step={20}
                  value={rate60m}
                  onChange={(e) => setRate60m(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-bold focus:outline-none focus:border-violet-500"
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">Starts at ₹300</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6 AM - 9 PM Calendar Slots Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-violet-400" />
            <h3 className="text-sm font-bold text-white">
              Daily Slot Roster (6:00 AM - 9:00 PM)
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            Active: <strong className="text-emerald-400 font-bold">{availableCount}</strong> / {slots.length} Slots
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-56 overflow-y-auto pr-1">
          {slots.map((slot) => {
            return (
              <button
                type="button"
                key={slot.id}
                onClick={() => toggleSlotAvailability(slot.id)}
                className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-between gap-1.5 ${
                  slot.isAvailable
                    ? 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300 shadow-sm shadow-emerald-500/10'
                    : 'border-slate-800/80 bg-slate-950/80 text-slate-600 line-through'
                }`}
              >
                <span className="text-[11px] font-bold">{slot.formattedLabel}</span>
                <span
                  className={`text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded ${
                    slot.isAvailable
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {slot.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <span className="text-xs text-slate-400 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5" />
          Settings sync instantly with WhatsApp Dispatch Worker
        </span>

        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-lg shadow-violet-600/30 flex items-center gap-2"
        >
          {saveToast ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              Roster Synced Successfully!
            </>
          ) : (
            'Save Availability & Rates'
          )}
        </button>
      </div>
    </div>
  );
};
