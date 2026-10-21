'use client';

import React, { useState } from 'react';
import { 
  X, 
  GraduationCap, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Phone, 
  Mail, 
  BookOpen, 
  Award,
  Wallet
} from 'lucide-react';
import { ExamLevel, Subject } from '@/types';

interface StudentRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessRegister: (studentData: {
    fullName: string;
    phone: string;
    email: string;
    examLevel: ExamLevel;
    subjects: string[];
  }) => void;
}

export const StudentRegisterModal: React.FC<StudentRegisterModalProps> = ({
  isOpen,
  onClose,
  onSuccessRegister,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [examLevel, setExamLevel] = useState<ExamLevel>('JEE Main');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['Physics', 'Mathematics']);

  if (!isOpen) return null;

  const toggleSubject = (subj: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subj) ? prev.filter(s => s !== subj) : [...prev, subj]
    );
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!fullName.trim() || !phone.trim()) {
        alert('Please fill in your name and WhatsApp number.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (selectedSubjects.length === 0) {
        alert('Please select at least one subject.');
        return;
      }
      setStep(3);
    }
  };

  const handleFinish = () => {
    onSuccessRegister({
      fullName,
      phone,
      email,
      examLevel,
      subjects: selectedSubjects,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header decoration */}
        <div className="h-2 bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500" />

        <div className="p-6 sm:p-8 space-y-6">
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Student Registration</h3>
                <p className="text-xs text-slate-400">Instant 1-on-1 Doubt Clearing Access</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Indicators */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div className={`flex-1 text-center py-1 text-xs font-semibold rounded-lg ${
              step >= 1 ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-500'
            }`}>
              1. Basic Info
            </div>
            <div className={`flex-1 text-center py-1 text-xs font-semibold rounded-lg ${
              step >= 2 ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-500'
            }`}>
              2. Exam & Goals
            </div>
            <div className={`flex-1 text-center py-1 text-xs font-semibold rounded-lg ${
              step === 3 ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-500'
            }`}>
              3. Welcome Bonus
            </div>
          </div>

          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <form onSubmit={handleNext} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Student Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aryan Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>WhatsApp Mobile Number *</span>
                  <span className="text-[10px] text-emerald-400 font-normal">For instant session alerts</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Email Address (Optional)</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    placeholder="aryan.sharma@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
                >
                  Continue to Exam Goals <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Exam & Subjects */}
          {step === 2 && (
            <form onSubmit={handleNext} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Select Your Target Class / Exam *</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {(['Class 10', 'Class 11', 'Class 12', 'NEET', 'JEE Main', 'JEE Advanced', 'GATE'] as ExamLevel[]).map((exam) => (
                    <button
                      key={exam}
                      type="button"
                      onClick={() => setExamLevel(exam)}
                      className={`p-2.5 rounded-xl border text-left font-semibold transition-all ${
                        examLevel === exam
                          ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm shadow-indigo-500/20'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      {exam}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-slate-300">Which Subjects Do You Need Doubts For?</label>
                <div className="flex flex-wrap gap-2">
                  {['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Botany'].map((subj) => (
                    <button
                      key={subj}
                      type="button"
                      onClick={() => toggleSubject(subj)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        selectedSubjects.includes(subj)
                          ? 'bg-violet-600 text-white border-violet-500 shadow-sm shadow-violet-500/20'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {selectedSubjects.includes(subj) ? '✓ ' : '+ '} {subj}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition-all"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
                >
                  Register & Claim Bonus <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Welcome Bonus & Success */}
          {step === 3 && (
            <div className="text-center space-y-5 py-2">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-white">Welcome, {fullName}!</h3>
                <p className="text-xs text-slate-400">
                  Your student account for <span className="text-indigo-400 font-semibold">{examLevel}</span> is ready.
                </p>
              </div>

              {/* Bonus Card */}
              <div className="bg-gradient-to-br from-indigo-950/60 to-purple-950/60 border border-indigo-500/30 rounded-2xl p-5 text-left space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-400">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Early Bird Welcome Gift</span>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">₹200</span>
                  <span className="text-xs text-slate-400">credited to your Just Doubts wallet</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  You can use this balance immediately to get your first 1-on-1 doubt session cleared with an expert teacher.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleFinish}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
                >
                  Go to Student Portal & Ask a Doubt <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
