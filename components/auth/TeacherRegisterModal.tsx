'use client';

import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Phone, 
  Mail, 
  Award,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Check,
  Calendar,
  Layers,
  Banknote,
  Lock
} from 'lucide-react';
import { Subject, TeacherProfile } from '@/types';

interface TeacherRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessRegister: (teacherData: {
    fullName: string;
    phone: string;
    email: string;
    qualification: string;
    experienceYears: number;
    subjects: Subject[];
    hasPenTablet: boolean;
    hasDocCam: boolean;
    onboardingPassPaid: boolean;
    expiresAt: string;
  }) => void;
}

export const TeacherRegisterModal: React.FC<TeacherRegisterModalProps> = ({
  isOpen,
  onClose,
  onSuccessRegister,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [qualification, setQualification] = useState('M.Sc Physics (IIT Roorkee)');
  const [experienceYears, setExperienceYears] = useState(5);
  const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>(['Physics']);
  
  // Hardware checklist
  const [hasPenTablet, setHasPenTablet] = useState(true);
  const [hasDocCam, setHasDocCam] = useState(true);
  const [hasBroadband, setHasBroadband] = useState(true);

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('educator@okaxis');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  if (!isOpen) return null;

  const toggleSubject = (subj: Subject) => {
    setSelectedSubjects(prev => 
      prev.includes(subj) ? prev.filter(s => s !== subj) : [...prev, subj]
    );
  };

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      alert('Please fill in your name and WhatsApp number.');
      return;
    }
    if (selectedSubjects.length === 0) {
      alert('Please select at least one subject you teach.');
      return;
    }
    setStep(2);
  };

  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPenTablet) {
      const confirmContinue = confirm(
        'Note: Having a Graphic Pen Tablet or iPad/stylus gives you 3x higher student acceptance. Do you want to proceed?'
      );
      if (!confirmContinue) return;
    }
    setStep(3); // Go to ₹99 Onboarding Fee
  };

  const handleProcessPayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setStep(4); // Success step
    }, 1500);
  };

  // 30 days from today
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 30);
  const formattedExpiry = expiryDate.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const handleFinish = () => {
    onSuccessRegister({
      fullName,
      phone,
      email,
      qualification,
      experienceYears,
      subjects: selectedSubjects,
      hasPenTablet,
      hasDocCam,
      onboardingPassPaid: true,
      expiresAt: formattedExpiry,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header gradient banner */}
        <div className="h-2 bg-gradient-to-r from-violet-600 via-indigo-600 to-amber-500" />

        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  Teacher Registration & Onboarding
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">
                    ₹99 / Mo
                  </span>
                </h3>
                <p className="text-xs text-slate-400">Receive verified student doubt requests on App & WhatsApp</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Header */}
          <div className="grid grid-cols-4 gap-1.5 border-b border-slate-800 pb-3 text-center text-[11px] font-semibold">
            <div className={`py-1 rounded-lg ${step >= 1 ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30' : 'text-slate-500'}`}>
              1. Profile
            </div>
            <div className={`py-1 rounded-lg ${step >= 2 ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30' : 'text-slate-500'}`}>
              2. Hardware
            </div>
            <div className={`py-1 rounded-lg ${step >= 3 ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30' : 'text-slate-500'}`}>
              3. ₹99 Pass
            </div>
            <div className={`py-1 rounded-lg ${step === 4 ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-500'}`}>
              4. Active
            </div>
          </div>

          {/* STEP 1: Educator Profile */}
          {step === 1 && (
            <form onSubmit={handleNextStep1} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Educator Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Anand Raman"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                    <span>WhatsApp Phone *</span>
                    <span className="text-[10px] text-emerald-400">Gets real-time doubts</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      placeholder="teacher@saitechverse.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Years of Experience</label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Highest Academic Qualification / College</label>
                <input
                  type="text"
                  placeholder="e.g. M.Tech IIT Delhi, M.Sc Chemistry, MBBS"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Subjects You Will Solve *</label>
                <div className="flex flex-wrap gap-2">
                  {(['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Botany'] as Subject[]).map((subj) => (
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

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2 transition-all"
                >
                  Continue to Hardware Verification <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Hardware Readiness */}
          {step === 2 && (
            <form onSubmit={handleNextStep2} className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Just Doubts Hardware Standards
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  To ensure top student ratings and 100% clarity, our platform supports direct document camera capture and digital stylus tablets so you can write derivations effortlessly.
                </p>
              </div>

              <div className="space-y-3">
                <label className="flex items-start gap-3 p-3.5 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700 transition-all">
                  <input
                    type="checkbox"
                    checked={hasPenTablet}
                    onChange={(e) => setHasPenTablet(e.target.checked)}
                    className="mt-1 rounded border-slate-700 text-violet-600 focus:ring-violet-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">Digital Pen Tablet / Stylus (Recommended)</span>
                    <span className="text-[11px] text-slate-400">Wacom, XP-Pen, Huion, iPad with Apple Pencil, or Touchscreen Laptop.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700 transition-all">
                  <input
                    type="checkbox"
                    checked={hasDocCam}
                    onChange={(e) => setHasDocCam(e.target.checked)}
                    className="mt-1 rounded border-slate-700 text-violet-600 focus:ring-violet-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">Overhead Document Camera / Phone Stand</span>
                    <span className="text-[11px] text-slate-400">Allows instant real-time video of your handwritten notebook or physical diagram.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700 transition-all">
                  <input
                    type="checkbox"
                    checked={hasBroadband}
                    onChange={(e) => setHasBroadband(e.target.checked)}
                    className="mt-1 rounded border-slate-700 text-violet-600 focus:ring-violet-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">Stable Internet Connection (&gt; 10 Mbps)</span>
                    <span className="text-[11px] text-slate-400">Smooth WebRTC peer-to-peer audio and video transmission.</span>
                  </div>
                </label>
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
                  className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2 transition-all"
                >
                  Proceed to Onboarding Pass (₹99) <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: ₹99 Onboarding Fee Payment */}
          {step === 3 && (
            <div className="space-y-5">
              {/* Plan Card */}
              <div className="bg-gradient-to-br from-violet-950/80 via-slate-900 to-indigo-950/80 border border-violet-500/40 rounded-2xl p-5 space-y-4 shadow-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-violet-500/20 text-violet-300 px-2.5 py-0.5 rounded-full border border-violet-500/30">
                      Educator Partner Pass
                    </span>
                    <h4 className="text-xl font-black text-white mt-1">Monthly Doubt Dispatch License</h4>
                  </div>
                  <div className="text-right">
                    <div className="flex items-baseline justify-end gap-1">
                      <span className="text-3xl font-black text-amber-400">₹99</span>
                      <span className="text-xs text-slate-400">/ 1 Month</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-semibold">Valid for 30 days</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-slate-800 text-xs text-slate-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Real-time WhatsApp doubt push alerts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>In-App instant 5-min claim priority</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Earn ₹300 - ₹800/hr (Direct escrow)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Gold Verified Educator profile badge</span>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800/80 text-[11px] text-slate-400">
                  💡 <span className="text-slate-300 font-semibold">Why ₹99?</span> Ensures a high-intent, spam-free educator pool with dedicated automated WhatsApp API broadcasts for your selected subjects ({selectedSubjects.join(', ')}).
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-300">Choose Instant Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      paymentMethod === 'upi'
                        ? 'bg-violet-600/20 border-violet-500 text-white shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
                    <span className="text-xs font-bold block">UPI / QR</span>
                    <span className="text-[10px] text-slate-500">GPay, PhonePe, Paytm</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      paymentMethod === 'card'
                        ? 'bg-violet-600/20 border-violet-500 text-white shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 mx-auto mb-1 text-indigo-400" />
                    <span className="text-xs font-bold block">Cards</span>
                    <span className="text-[10px] text-slate-500">Debit / Credit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      paymentMethod === 'netbanking'
                        ? 'bg-violet-600/20 border-violet-500 text-white shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Banknote className="w-5 h-5 mx-auto mb-1 text-amber-400" />
                    <span className="text-xs font-bold block">NetBanking</span>
                    <span className="text-[10px] text-slate-500">All major banks</span>
                  </button>
                </div>

                {paymentMethod === 'upi' && (
                  <div className="space-y-1.5 pt-1">
                    <label className="text-[11px] font-semibold text-slate-400">Enter Your UPI ID / VPA</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@okhdfcbank"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition-all"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={isProcessingPayment}
                  onClick={handleProcessPayment}
                  className="flex-1 py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black rounded-xl text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isProcessingPayment ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      Authorizing ₹99 Payment...
                    </>
                  ) : (
                    <>
                      Pay ₹99 & Activate 1-Month Pass <Lock className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Success & WhatsApp Activated */}
          {step === 4 && (
            <div className="text-center space-y-5 py-2">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-white">Congratulations, {fullName}!</h3>
                <p className="text-xs text-slate-300">
                  Your Teacher Onboarding is completed & payment of <span className="text-amber-400 font-bold">₹99</span> was successful.
                </p>
              </div>

              {/* Verification & WhatsApp Notice */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-left space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Partner Educator Status: ACTIVE</span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400">
                    Valid till {formattedExpiry}
                  </span>
                </div>

                <div className="p-3 bg-emerald-950/30 border border-emerald-500/20 rounded-xl space-y-1 text-xs">
                  <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" /> WhatsApp Dispatch Enabled
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Student doubts for <strong className="text-white">{selectedSubjects.join(', ')}</strong> will now be broadcast to <strong className="text-white">{phone}</strong> and your in-app feed.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleFinish}
                  className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2 transition-all"
                >
                  Enter Teacher Portal & View Incoming Doubts <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
