'use client';

import React, { useState } from 'react';
import { Navbar, ActiveTab } from '@/components/Navbar';
import { LandingPage } from '@/components/landing/LandingPage';
import { StudentRegisterModal } from '@/components/auth/StudentRegisterModal';
import { TeacherRegisterModal } from '@/components/auth/TeacherRegisterModal';
import { DoubtSubmissionForm } from '@/components/student/DoubtSubmissionForm';
import { TeacherMatchBanner } from '@/components/student/TeacherMatchBanner';
import { TeacherAvailabilityManager } from '@/components/teacher/TeacherAvailabilityManager';
import { DoubtRequestFeed } from '@/components/teacher/DoubtRequestFeed';
import { TeacherWalletDashboard } from '@/components/teacher/TeacherWalletDashboard';
import { WebRTCClassroom } from '@/components/classroom/WebRTCClassroom';
import { ArchitectureViewer } from '@/components/docs/ArchitectureViewer';
import { INITIAL_TEACHERS, SAMPLE_DOUBTS } from '@/lib/mock-data';
import { DoubtSubmission } from '@/types';
import { 
  Sparkles, 
  GraduationCap, 
  BookOpen, 
  Video, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Wallet,
  Home
} from 'lucide-react';

export default function JustDoubtsPlatform() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('landing');
  const [userRole, setUserRole] = useState<'student' | 'teacher'>('student');

  // Modals state
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);

  // Wallets
  const [studentBalance, setStudentBalance] = useState<number>(650);
  const [teacherBalance, setTeacherBalance] = useState<number>(1420);

  // Active Doubts
  const [doubts, setDoubts] = useState<DoubtSubmission[]>(SAMPLE_DOUBTS);
  const [activeSessionDoubt, setActiveSessionDoubt] = useState<DoubtSubmission>(SAMPLE_DOUBTS[0]);

  // Student Registration handler
  const handleRegisterStudent = (data: {
    fullName: string;
    phone: string;
    email: string;
    examLevel: string;
    subjects: string[];
  }) => {
    // Add ₹200 early bird bonus
    setStudentBalance(prev => prev + 200);
    setActiveTab('student');
    setUserRole('student');
  };

  // Teacher Registration handler with ₹99 Onboarding Pass
  const handleRegisterTeacher = (data: {
    fullName: string;
    phone: string;
    email: string;
    qualification: string;
    experienceYears: number;
    subjects: any[];
    hasPenTablet: boolean;
    hasDocCam: boolean;
    onboardingPassPaid: boolean;
    expiresAt: string;
  }) => {
    setActiveTab('teacher');
    setUserRole('teacher');
  };

  // Submission handler
  const handleStudentSubmitDoubt = (newDoubt: DoubtSubmission) => {
    // Automatically match with Dr. Anand Raman for demo flow
    const matchedTeacher = INITIAL_TEACHERS[0];
    const enrichedDoubt: DoubtSubmission = {
      ...newDoubt,
      acceptedTeacher: {
        id: matchedTeacher.id,
        name: matchedTeacher.fullName,
        experienceYears: matchedTeacher.experienceYears,
        rating: matchedTeacher.rating,
        avatarUrl: matchedTeacher.avatarUrl,
        quotedFee: newDoubt.quotedPrice,
      },
      status: 'accepted_unpaid',
    };

    setDoubts(prev => [enrichedDoubt, ...prev]);
    setActiveSessionDoubt(enrichedDoubt);
    alert('Doubt submitted! Dispatched to eligible Physics teachers. Teacher Dr. Anand Raman has claimed it.');
  };

  // Student Escrow Payment -> Enters Room
  const handlePayAndJoinSession = (doubtId: string) => {
    const target = doubts.find(d => d.id === doubtId) || activeSessionDoubt;
    const fee = target.acceptedTeacher?.quotedFee || target.quotedPrice;

    // Deduct student wallet and put in escrow
    setStudentBalance(prev => Math.max(0, prev - fee));

    // Update doubt status
    setDoubts(prev =>
      prev.map(d => d.id === doubtId ? { ...d, status: 'paid_escrow' } : d)
    );

    // Switch view to Classroom
    setActiveSessionDoubt(target);
    setActiveTab('classroom');
  };

  // Teacher Accepts Doubt
  const handleTeacherAcceptDoubt = (doubtId: string) => {
    const teacher = INITIAL_TEACHERS[0];
    setDoubts(prev =>
      prev.map(d =>
        d.id === doubtId
          ? {
              ...d,
              status: 'accepted_unpaid',
              acceptedTeacher: {
                id: teacher.id,
                name: teacher.fullName,
                experienceYears: teacher.experienceYears,
                rating: teacher.rating,
                avatarUrl: teacher.avatarUrl,
                quotedFee: d.quotedPrice,
              },
            }
          : d
      )
    );
    alert('You have accepted the doubt! WhatsApp & App notification sent to student with payment escrow link.');
  };

  // SLA Penalty applied
  const handleApplyPenalty = (doubtId: string, penaltyAmount: number) => {
    setTeacherBalance(prev => Math.max(0, prev - penaltyAmount));
  };

  // Dual completion handler
  const handleDualSessionComplete = () => {
    const gross = activeSessionDoubt.quotedPrice;
    const commission = Math.round(gross * 0.10);
    const tds = Math.round(gross * 0.01);
    const netCredit = gross - commission - tds;

    setTeacherBalance(prev => prev + netCredit);
    setDoubts(prev =>
      prev.map(d => d.id === activeSessionDoubt.id ? { ...d, status: 'completed' } : d)
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        studentBalance={studentBalance}
        teacherBalance={teacherBalance}
        onOpenStudentRegister={() => setIsStudentModalOpen(true)}
        onOpenTeacherRegister={() => setIsTeacherModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Quick Role & Mode Switcher Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">Active Mode:</span>
            <span className="font-extrabold text-white uppercase tracking-wider bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
              {activeTab === 'landing' && 'Doubt Class Introduction & Overview (Landing Page)'}
              {activeTab === 'student' && 'Student Portal (Class 10-12, NEET, JEE, GATE)'}
              {activeTab === 'teacher' && 'Teacher Portal & WhatsApp 20-Min SLA Engine'}
              {activeTab === 'classroom' && '1-on-1 Hardware WebRTC Classroom (Pen Tablet / Doc Cam)'}
              {activeTab === 'architecture' && 'Full System Architecture & Supabase DDL'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('landing')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === 'landing'
                  ? 'bg-slate-700 text-white'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => {
                setUserRole('student');
                setActiveTab('student');
              }}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === 'student'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              Student Portal
            </button>
            <button
              onClick={() => {
                setUserRole('teacher');
                setActiveTab('teacher');
              }}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === 'teacher'
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              Teacher Portal
            </button>
          </div>
        </div>

        {/* 0. LANDING PAGE VIEW */}
        {activeTab === 'landing' && (
          <LandingPage
            onOpenStudentRegister={() => setIsStudentModalOpen(true)}
            onOpenTeacherRegister={() => setIsTeacherModalOpen(true)}
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              if (tab === 'student') setUserRole('student');
              if (tab === 'teacher') setUserRole('teacher');
            }}
          />
        )}

        {/* 1. STUDENT PORTAL FLOW */}
        {activeTab === 'student' && (
          <div className="space-y-8">
            {/* If there is an accepted doubt awaiting student payment */}
            {activeSessionDoubt && activeSessionDoubt.acceptedTeacher && (
              <TeacherMatchBanner
                doubt={activeSessionDoubt}
                studentBalance={studentBalance}
                onPayAndJoinSession={handlePayAndJoinSession}
              />
            )}

            {/* Main Doubt Submission Form */}
            <DoubtSubmissionForm onSubmitDoubt={handleStudentSubmitDoubt} />

            {/* Active Doubts Feed for Student */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-indigo-400" />
                  Your Active Doubt Submissions
                </h3>
                <span className="text-xs text-slate-400">
                  {doubts.length} Doubt(s) in system
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {doubts.map((d) => (
                  <div
                    key={d.id}
                    className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5 relative"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-indigo-400 uppercase tracking-wider text-[10px]">
                        {d.subject} • {d.examLevel}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        d.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : d.status === 'accepted_unpaid'
                          ? 'bg-amber-500/20 text-amber-300 animate-pulse'
                          : 'bg-indigo-500/20 text-indigo-300'
                      }`}>
                        {d.status.toUpperCase()}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white">{d.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2">{d.description}</p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                      <span className="font-extrabold text-white">₹{d.quotedPrice} ({d.durationMinutes}m)</span>
                      {d.acceptedTeacher && (
                        <button
                          onClick={() => {
                            setActiveSessionDoubt(d);
                            handlePayAndJoinSession(d.id);
                          }}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                        >
                          Join Session <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. TEACHER PORTAL FLOW */}
        {activeTab === 'teacher' && (
          <div className="space-y-8">
            {/* WhatsApp SLA Incoming Doubt Dispatch Feed */}
            <DoubtRequestFeed
              doubts={doubts.filter(d => d.status === 'routed' || d.status === 'submitted')}
              currentTeacherId={INITIAL_TEACHERS[0].id}
              onAcceptDoubt={handleTeacherAcceptDoubt}
              onApplyPenalty={handleApplyPenalty}
            />

            {/* 6 AM - 9 PM Availability Calendar Matrix */}
            <TeacherAvailabilityManager />

            {/* Double-Entry Ledger, Commission, TDS & Bank Payout */}
            <TeacherWalletDashboard
              balance={teacherBalance}
              bankAccount={INITIAL_TEACHERS[0].bankAccount}
            />
          </div>
        )}

        {/* 3. HARDWARE-READY WEBRTC CLASSROOM */}
        {activeTab === 'classroom' && (
          <WebRTCClassroom
            doubt={activeSessionDoubt}
            userRole={userRole}
            onDualComplete={handleDualSessionComplete}
            onExit={() => setActiveTab('student')}
          />
        )}

        {/* 4. SYSTEM ARCHITECTURE & SUPABASE DDL */}
        {activeTab === 'architecture' && (
          <ArchitectureViewer />
        )}
      </main>

      {/* Student Registration Modal */}
      <StudentRegisterModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        onSuccessRegister={handleRegisterStudent}
      />

      {/* Teacher Registration Modal (with ₹99 Monthly Onboarding Pass) */}
      <TeacherRegisterModal
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
        onSuccessRegister={handleRegisterTeacher}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 mt-12 text-center text-xs text-slate-500 space-y-2">
        <div className="flex items-center justify-center gap-3">
          <div className="h-6 w-6 rounded-lg bg-gradient-to-tr from-indigo-600 to-amber-500 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-slate-300">Just Doubts by Saitechverse Solutions</span>
        </div>
        <p>© 2026 Just Doubts • Instant 1-on-1 EdTech Doubt Clearing Marketplace</p>
        <p className="text-[11px] text-slate-600">
          Built for Class 10-12, NEET, JEE & GATE Aspirants • Hardware Enabled (Document Cam & Pen Tablets) • ₹99/mo Teacher Onboarding Pass
        </p>
      </footer>
    </div>
  );
}