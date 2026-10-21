'use client';

import React, { useState } from 'react';
import { 
  Subject, 
  ExamLevel, 
  DoubtSubmission, 
  TimeSlot 
} from '@/types';
import { generateCalendarSlots } from '@/lib/mock-data';
import { 
  Upload, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  AlertCircle,
  HelpCircle,
  Image as ImageIcon
} from 'lucide-react';

const SUBJECTS: { label: Subject; icon: string; color: string }[] = [
  { label: 'Mathematics', icon: '📐', color: 'from-blue-600 to-indigo-600' },
  { label: 'Physics', icon: '⚡', color: 'from-amber-500 to-orange-600' },
  { label: 'Chemistry', icon: '🧪', color: 'from-emerald-500 to-teal-600' },
  { label: 'Biology', icon: '🧬', color: 'from-rose-500 to-pink-600' },
  { label: 'Botany', icon: '🌿', color: 'from-lime-500 to-emerald-600' },
];

const EXAM_LEVELS: ExamLevel[] = [
  'NEET',
  'JEE Main',
  'JEE Advanced',
  'GATE',
  'Class 12',
  'Class 11',
  'Class 10',
];

const SPECIAL_REQUEST_OPTIONS = [
  'Need handwritten notes PDF',
  'Focus on formula derivation',
  'Exam shortcut & time-saving tricks',
  'Hindi + English explanation',
  'Break down fundamental basics first',
];

interface DoubtSubmissionFormProps {
  onSubmitDoubt: (doubt: DoubtSubmission) => void;
}

export const DoubtSubmissionForm: React.FC<DoubtSubmissionFormProps> = ({ onSubmitDoubt }) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject>('Physics');
  const [selectedExam, setSelectedExam] = useState<ExamLevel>('JEE Advanced');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedRequests, setSelectedRequests] = useState<string[]>(['Need handwritten notes PDF']);
  const [duration, setDuration] = useState<30 | 60>(30);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Calendar Slots (6 AM - 9 PM)
  const allSlots = generateCalendarSlots('Today');
  const [selectedSlotIds, setSelectedSlotIds] = useState<string[]>(['slot_10_1', 'slot_10_2']);

  // Dynamic Pricing Calculation
  // Base 30 min = ₹150, 60 min = ₹300. Competitive exams add slight premium for top tier.
  const baseRate = duration === 30 ? 150 : 300;
  const examMultiplier = (selectedExam === 'GATE' || selectedExam === 'JEE Advanced') ? 1.1 : 1.0;
  const calculatedPrice = Math.round(baseRate * examMultiplier);

  const toggleRequest = (item: string) => {
    setSelectedRequests(prev => 
      prev.includes(item) ? prev.filter(r => r !== item) : [...prev, item]
    );
  };

  const toggleSlot = (slotId: string) => {
    setSelectedSlotIds(prev => 
      prev.includes(slotId) 
        ? prev.filter(id => id !== slotId) 
        : [...prev, slotId]
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Please fill in the doubt title and description.');
      return;
    }
    if (selectedSlotIds.length === 0) {
      alert('Please select at least one preferred time slot between 6 AM and 9 PM.');
      return;
    }

    const chosenSlots = allSlots.filter(s => selectedSlotIds.includes(s.id));

    const newDoubt: DoubtSubmission = {
      id: `dbt_${Date.now().toString().slice(-4)}`,
      studentId: 'stu_demo_current',
      studentName: 'Aarav Patel (Class 12 Aspirant)',
      subject: selectedSubject,
      examLevel: selectedExam,
      title,
      description,
      imageUrl: imagePreview || undefined,
      specialRequests: selectedRequests,
      durationMinutes: duration,
      preferredSlots: chosenSlots,
      quotedPrice: calculatedPrice,
      status: 'routed',
      createdAt: new Date().toISOString(),
      slaDeadlineAt: new Date(Date.now() + 20 * 60 * 1000).toISOString(),
    };

    onSubmitDoubt(newDoubt);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between pb-5 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            Submit Instant Doubt
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Class 10-12 & Competitive Aspirants (NEET, JEE, GATE). Direct routing to certified subject experts.
          </p>
        </div>
        <span className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs px-3 py-1 rounded-full font-semibold">
          6 AM - 9 PM Active Slots
        </span>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Step 1: Select Subject */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            1. Select Subject (Only eligible teachers will receive request)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {SUBJECTS.map((sub) => {
              const isSelected = selectedSubject === sub.label;
              return (
                <button
                  type="button"
                  key={sub.label}
                  onClick={() => setSelectedSubject(sub.label)}
                  className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-950/40 shadow-md shadow-indigo-500/10 text-white'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span className="text-2xl mb-1.5">{sub.icon}</span>
                  <span className="text-xs font-bold leading-tight">{sub.label}</span>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 absolute top-2 right-2" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Target Exam Level */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            2. Target Examination / Class Level
          </label>
          <div className="flex flex-wrap gap-2">
            {EXAM_LEVELS.map((exam) => (
              <button
                type="button"
                key={exam}
                onClick={() => setSelectedExam(exam)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  selectedExam === exam
                    ? 'bg-violet-600 border-violet-500 text-white shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {exam}
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Doubt Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                3. Doubt Title & Concept
              </label>
              <input
                type="text"
                placeholder="e.g. Rotational Motion: Rolling on Inclined Plane"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Detailed Question or Problem Statement
              </label>
              <textarea
                rows={4}
                placeholder="Describe where you are stuck, formulas you tried, or what specific derivation you need..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
                required
              />
            </div>
          </div>

          {/* Image Upload Area */}
          <div className="flex flex-col">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Upload Textbook / Notebook Snapshot</span>
              <span className="text-[10px] text-slate-500 font-normal">PNG, JPG, WebP</span>
            </label>
            <div className="flex-1 border-2 border-dashed border-slate-800 hover:border-indigo-500/60 rounded-xl p-4 flex flex-col items-center justify-center bg-slate-950/50 transition-colors relative cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              {imagePreview ? (
                <div className="relative w-full h-40 rounded-lg overflow-hidden border border-slate-700">
                  <img
                    src={imagePreview}
                    alt="Doubt Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-xs text-white bg-slate-900/90 px-2 py-1 rounded">
                      Click to Replace Image
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center p-4">
                  <div className="w-12 h-12 mx-auto rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-2">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-medium text-slate-300">
                    Drag and drop your question image or <span className="text-indigo-400 underline">browse</span>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Clear photos of question sheets help tutors prepare solutions faster
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Step 4: Special Requests */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            4. Special Requests for the Teacher
          </label>
          <div className="flex flex-wrap gap-2">
            {SPECIAL_REQUEST_OPTIONS.map((req) => {
              const active = selectedRequests.includes(req);
              return (
                <button
                  type="button"
                  key={req}
                  onClick={() => toggleRequest(req)}
                  className={`text-xs px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all ${
                    active
                      ? 'border-indigo-500 bg-indigo-950/40 text-indigo-300'
                      : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-indigo-400' : 'bg-slate-600'}`} />
                  {req}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 5: Session Duration & Calendar Slots (6 AM - 9 PM) */}
        <div className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/70">
            <div>
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                Select Session Length & Dynamic Base Pricing
              </span>
              <p className="text-[11px] text-slate-400">
                Transparent flat pricing: ₹150 for 30m, ₹300 for 60m (+ tier adjustments)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDuration(30)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  duration === 30
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 border border-slate-700 text-slate-300'
                }`}
              >
                30 Minutes (₹{Math.round(150 * examMultiplier)})
              </button>
              <button
                type="button"
                onClick={() => setDuration(60)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  duration === 60
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 border border-slate-700 text-slate-300'
                }`}
              >
                60 Minutes (₹{Math.round(300 * examMultiplier)})
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                Choose Preferred Available Slots (6:00 AM - 9:00 PM)
              </label>
              <span className="text-[11px] text-slate-400">
                {selectedSlotIds.length} slot(s) selected
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-44 overflow-y-auto pr-1">
              {allSlots.slice(0, 18).map((slot) => {
                const isSelected = selectedSlotIds.includes(slot.id);
                return (
                  <button
                    type="button"
                    key={slot.id}
                    onClick={() => toggleSlot(slot.id)}
                    className={`px-2.5 py-2 rounded-lg text-[11px] font-medium border text-center transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-600/30 text-white font-bold ring-1 ring-indigo-500'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {slot.formattedLabel}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pricing Summary & Submit */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <span className="text-[10px] text-emerald-400 uppercase tracking-wider block font-bold">
                Total Doubt Fee
              </span>
              <span className="text-2xl font-black text-emerald-400">
                ₹{calculatedPrice}
              </span>
            </div>
            <div className="text-xs text-slate-400">
              <p className="font-semibold text-slate-300">Escrow Protected</p>
              <p className="text-[11px]">Paid to platform wallet only after teacher accepts</p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Route Doubt to Verified Teachers
          </button>
        </div>
      </form>
    </div>
  );
};
