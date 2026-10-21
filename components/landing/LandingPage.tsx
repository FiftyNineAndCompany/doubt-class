'use client';

import React, { useState } from 'react';

const basePath = process.env.NODE_ENV === 'production' ? '/doubt-class' : '';
import { 
  Sparkles, 
  GraduationCap, 
  BookOpen, 
  Video, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Phone,
  Smartphone,
  Check,
  Star,
  Zap,
  HelpCircle,
  Users,
  Award,
  ChevronRight,
  PenTool,
  Camera,
  Layers,
  TrendingUp,
  MessageCircle,
  FileCheck,
  Play
} from 'lucide-react';
import { ActiveTab } from '@/components/Navbar';

interface LandingPageProps {
  onOpenStudentRegister: () => void;
  onOpenTeacherRegister: () => void;
  onNavigateTab: (tab: ActiveTab) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenStudentRegister,
  onOpenTeacherRegister,
  onNavigateTab,
}) => {
  const [activeStoryTab, setActiveStoryTab] = useState<'problem' | 'solution'>('solution');

  return (
    <div className="space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 sm:pt-12 text-center max-w-5xl mx-auto space-y-8">
        {/* Glow backdrop behind hero */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-violet-600/20 to-pink-500/10 blur-3xl rounded-full pointer-events-none -z-10" />

        {/* Top Announcement Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-xs text-indigo-300 shadow-lg shadow-indigo-500/10 hover:border-indigo-500/50 transition-all cursor-pointer">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold">Just Doubts</span>
          <span className="text-slate-500">•</span>
          <span>Instant 1-on-1 Doubt Resolution by Saitechverse Solutions</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        </div>

        {/* Main Headline */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
            Stuck on a Tough Question? <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-amber-300 bg-clip-text text-transparent">
              Instant Relief in Under 15 Mins.
            </span>
          </h1>
          <p className="max-w-3xl mx-auto text-base sm:text-xl text-slate-300 leading-relaxed font-normal">
            No expensive yearly subscriptions. Connect <strong className="text-white">Class 10–12, NEET, JEE & GATE</strong> students with India&apos;s verified educators over live 1-on-1 audio-video with <strong className="text-indigo-400">digital pen tablets & document cameras</strong>.
          </p>
        </div>

        {/* Primary Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={onOpenStudentRegister}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold rounded-2xl text-base shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <GraduationCap className="w-5 h-5 text-indigo-200" />
            <span>Register as Student</span>
            <span className="text-xs bg-indigo-700/60 border border-indigo-400/30 px-2 py-0.5 rounded-full text-indigo-100 font-semibold">
              Get ₹200 Free Bonus
            </span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          <button
            onClick={onOpenTeacherRegister}
            className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800/90 border border-violet-500/40 hover:border-violet-400 text-white font-extrabold rounded-2xl text-base shadow-xl shadow-violet-950/40 flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <BookOpen className="w-5 h-5 text-violet-400" />
            <span>Register as Teacher</span>
            <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold">
              ₹99/mo Onboarding
            </span>
          </button>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 text-left">
          <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">20-Min SLA</p>
              <p className="text-[11px] text-slate-400">Guaranteed quick response</p>
            </div>
          </div>

          <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">WhatsApp Alerts</p>
              <p className="text-[11px] text-slate-400">Instant doubt dispatch</p>
            </div>
          </div>

          <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center shrink-0">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Hardware Pen Tablet</p>
              <p className="text-[11px] text-slate-400">Live whiteboard formulas</p>
            </div>
          </div>

          <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Escrow Payment</p>
              <p className="text-[11px] text-slate-400">100% money-back security</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VISUAL STORYTELLING: DOUBT VS INSTANT RELIEF (BEFORE & AFTER) */}
      <section className="space-y-8">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
            The Just Doubts Experience
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            From Late-Night Frustration to Instant Relief
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            Self-study is grueling when a single equation blocks your progress for hours. See how Just Doubts transforms student life.
          </p>
        </div>

        {/* Story Tab Switcher */}
        <div className="flex justify-center">
          <div className="inline-flex p-1.5 bg-slate-900 border border-slate-800 rounded-2xl">
            <button
              onClick={() => setActiveStoryTab('problem')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeStoryTab === 'problem'
                  ? 'bg-rose-600/20 text-rose-300 border border-rose-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              😰 The Problem: Stuck Late Night
            </button>
            <button
              onClick={() => setActiveStoryTab('solution')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeStoryTab === 'solution'
                  ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🎉 The Solution: Instant 1-on-1 Relief
            </button>
          </div>
        </div>

        {/* Interactive Comparison Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-10 backdrop-blur-sm">
          {/* Visual Side */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl group">
            {activeStoryTab === 'problem' ? (
              <div className="relative">
                <img
                  src={`${basePath}/images/struggling.jpg`}
                  alt="Student overwhelmed with difficult doubts late at night"
                  className="w-full h-[360px] sm:h-[420px] object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute top-4 left-4 bg-rose-500/90 backdrop-blur-md text-white font-black text-xs px-3 py-1.5 rounded-xl shadow-lg">
                  Before: Without Just Doubts
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-xs text-rose-200 bg-rose-950/70 p-3 rounded-xl border border-rose-500/30 backdrop-blur-md">
                  &quot;Stuck on a tricky KVL loop calculation at 11:45 PM. No teacher to ask, parents can&apos;t help, and tomorrow is the mock test!&quot;
                </div>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={`${basePath}/images/relief.jpg`}
                  alt="Student experiencing instant relief and clarity on tablet"
                  className="w-full h-[360px] sm:h-[420px] object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute top-4 left-4 bg-emerald-500/90 backdrop-blur-md text-slate-950 font-black text-xs px-3 py-1.5 rounded-xl shadow-lg">
                  After: With Just Doubts Platform
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-xs text-emerald-200 bg-emerald-950/70 p-3 rounded-xl border border-emerald-500/30 backdrop-blur-md">
                  &quot;Uploaded photo, matched in 3 mins. Teacher derived every step on live pen tablet. Problem solved, 100% confidence restored!&quot;
                </div>
              </div>
            )}
          </div>

          {/* Details & Copy Side */}
          <div className="space-y-6">
            {activeStoryTab === 'problem' ? (
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 text-rose-400 text-xs font-extrabold uppercase tracking-wider">
                  <span>The Pain Point Faced by Millions</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Why Conventional Coaching Fails at 10 PM
                </h3>
                <ul className="space-y-3.5 text-sm text-slate-300">
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✕</div>
                    <span><strong>No instant feedback:</strong> WhatsApp groups with 100+ students get crowded and ignored.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✕</div>
                    <span><strong>Pre-recorded videos don&apos;t answer your step:</strong> Generic video explanations skip the specific algebra step where you got stuck.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✕</div>
                    <span><strong>Loss of momentum & anxiety:</strong> Being stuck for 2 hours destroys study enthusiasm and ruins sleep.</span>
                  </li>
                </ul>

                <button
                  onClick={() => setActiveStoryTab('solution')}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
                >
                  See How Just Doubts Solves This <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-extrabold uppercase tracking-wider">
                  <span>The Just Doubts Breakthrough</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Instant 1-on-1 Clarity, Pay Only Per Doubt
                </h3>
                <ul className="space-y-3.5 text-sm text-slate-300">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>No hefty subscriptions:</strong> Post a doubt for as low as ₹150 for 30 mins or quote your own price.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Live step-by-step whiteboard:</strong> Teacher writes calculations in real time using a digital pen tablet.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Escrow safety guarantee:</strong> Money is only released to the teacher when both student and teacher confirm the doubt is resolved.</span>
                  </li>
                </ul>

                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    onClick={onOpenStudentRegister}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-indigo-600/30"
                  >
                    Claim ₹200 Free Trial Credit <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onNavigateTab('student')}
                    className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs sm:text-sm transition-all cursor-pointer"
                  >
                    Explore Student Portal
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. HARDWARE-READY CLASSROOM SHOWCASE (STUDENT-TEACHER INTERACTION) */}
      <section className="space-y-8">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-violet-400 bg-violet-500/10 border border-violet-500/20 px-3 py-1 rounded-full">
            State-of-the-Art Technology
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            1-on-1 Hardware Classroom: Pen Tablet & Document Camera
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            Real math and physics cannot be taught with clumsy mouse typing. Our teachers use specialized hardware to explain concepts as if sitting beside you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-10">
          {/* Main Visual */}
          <div className="lg:col-span-7 relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
            <img
              src={`${basePath}/images/interaction.jpg`}
              alt="Interactive 1-on-1 doubt session with document camera and pen tablet"
              className="w-full h-auto object-cover rounded-2xl"
            />
            <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-xl text-[11px] font-bold text-emerald-400 flex items-center gap-1.5 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Hardware WebRTC
            </div>
          </div>

          {/* Hardware Feature Highlights */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">
                How Our Classroom Outperforms Zoom & Google Meet
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tailored for STEM doubt resolution with zero latency, dual hardware camera streaming, and strict privacy masking.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                  <PenTool className="w-4 h-4" />
                  <span>Digital Graphic Pen Tablet</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Pressure-sensitive writing allows teachers to derive multi-step calculus, organic chemistry mechanisms, and circuit equations with clean, fluid handwriting.
                </p>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-violet-400 font-bold text-sm">
                  <Camera className="w-4 h-4" />
                  <span>Overhead Document Camera</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Instantly points to physical textbooks (HC Verma, Irodov, NCERT), notes, or graph sheets without blurry webcam glare.
                </p>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Real-Time PII & Phone Number Masking</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Built-in AI filters prevent sharing of phone numbers, social media handles, or offline contacts to safeguard student safety at all times.
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('classroom')}
              className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20 cursor-pointer"
            >
              <Video className="w-4 h-4" />
              Launch Hardware Classroom Demo
            </button>
          </div>
        </div>
      </section>

      {/* 4. TEACHER PARTNER PROGRAM (₹99 ONBOARDING PASS) */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-950/70 via-slate-900 to-indigo-950/70 border border-violet-500/30 rounded-3xl p-8 sm:p-12 shadow-2xl">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-violet-500/20 pb-6">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full">
                Educator Partner Program
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">
                Teach Doubts. Earn ₹300 – ₹800/Hour.
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Flexible teaching hours (6:00 AM – 9:00 PM). Work right from your desk with zero student acquisition cost.
              </p>
            </div>

            {/* ₹99 Badge */}
            <div className="bg-slate-950/80 border border-amber-500/40 rounded-2xl p-4 text-center shrink-0 shadow-lg">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Partner Onboarding Pass
              </span>
              <div className="flex items-baseline justify-center gap-1 my-0.5">
                <span className="text-4xl font-black text-amber-400">₹99</span>
                <span className="text-xs text-slate-400">/ 1 Month</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-400 block">
                Valid for 30 Days
              </span>
            </div>
          </div>

          {/* Perks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                <Phone className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">Instant WhatsApp Push Alerts</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Whenever a student posts a doubt in your subject, you receive a direct WhatsApp ping with the question and quoted fee.
              </p>
            </div>

            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-2">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">5-Min Claim Priority</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Lock and review incoming doubt requests exclusively for 5 minutes before accepting into your live schedule.
              </p>
            </div>

            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                <FileCheck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">Direct Escrow Bank Payouts</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Earnings are backed by student escrow deposit. Weekly automated transfers to your bank account with complete TDS records.
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-violet-500/20">
            <div className="text-xs text-slate-300">
              ⚡ <strong className="text-white">Why the ₹99 fee?</strong> It covers automated WhatsApp API alerts and ensures our teacher network maintains top quality and high response rates.
            </div>
            <button
              onClick={onOpenTeacherRegister}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black rounded-xl text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              Get Your ₹99 Teacher Pass Now <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS (4 STEPS) */}
      <section className="space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
            Seamless Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            How Just Doubts Works in 4 Simple Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl relative space-y-3">
            <div className="text-3xl font-black text-indigo-400/30">01</div>
            <h4 className="text-base font-bold text-white">Student Submits Doubt</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload photo of question or type problem. Select Class/Exam, required duration (30m/60m), and quoted budget.
            </p>
          </div>

          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl relative space-y-3">
            <div className="text-3xl font-black text-violet-400/30">02</div>
            <h4 className="text-base font-bold text-white">WhatsApp & App Dispatch</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Matching verified teachers receive real-time alerts. Teacher claims the doubt with a 5-minute exclusivity window.
            </p>
          </div>

          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl relative space-y-3">
            <div className="text-3xl font-black text-amber-400/30">03</div>
            <h4 className="text-base font-bold text-white">Escrow Payment Lock</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Student accepts teacher profile and deposits fee into safe escrow. Neither party risks unpaid or wasted time.
            </p>
          </div>

          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl relative space-y-3">
            <div className="text-3xl font-black text-emerald-400/30">04</div>
            <h4 className="text-base font-bold text-white">Hardware Class & Release</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Connect 1-on-1 on interactive pen-tablet canvas. Once resolved, dual completion triggers instant payout credit.
            </p>
          </div>
        </div>
      </section>

      {/* 6. SUBJECTS & EXAMS COVERED */}
      <section className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-8">
        <div className="text-center space-y-2">
          <h3 className="text-2xl sm:text-3xl font-bold text-white">Exams & Subjects We Specialize In</h3>
          <p className="text-xs sm:text-sm text-slate-400">Rigorous doubt clearing by subject matter masters</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
          {[
            { title: 'Class 10 CBSE/ICSE', tag: 'Boards' },
            { title: 'Class 11 & 12', tag: 'Science Stream' },
            { title: 'NEET UG', tag: 'Medical Aspirants' },
            { title: 'JEE Main', tag: 'Engineering' },
            { title: 'JEE Advanced', tag: 'Top IIT Ranks' },
            { title: 'GATE & Foundation', tag: 'Advanced Concepts' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 bg-slate-950 border border-slate-800/80 rounded-2xl space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-indigo-400 block">{item.tag}</span>
              <p className="text-xs font-bold text-white">{item.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-2xl sm:text-3xl font-bold text-white">Frequently Asked Questions</h3>
          <p className="text-xs text-slate-400">Everything you need to know about our doubt clearing marketplace</p>
        </div>

        <div className="space-y-3 text-xs sm:text-sm">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1.5">
            <p className="font-bold text-white">How quickly will my doubt be answered?</p>
            <p className="text-slate-400 leading-relaxed">
              Our teachers are alerted via instant WhatsApp broadcasts within 60 seconds of submission. In over 94% of cases, a teacher claims the doubt and joins within 15–20 minutes.
            </p>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1.5">
            <p className="font-bold text-white">Why does a Teacher pay ₹99 for onboarding?</p>
            <p className="text-slate-400 leading-relaxed">
              The ₹99 monthly fee keeps the educator community active and serious, while funding the automated WhatsApp message dispatch infrastructure that sends new doubt alerts directly to your phone.
            </p>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1.5">
            <p className="font-bold text-white">What if the teacher doesn&apos;t clear my doubt properly?</p>
            <p className="text-slate-400 leading-relaxed">
              Your money remains held securely in escrow until you confirm satisfaction. If you are unsatisfied, our dispute resolution team issues a 100% refund to your student wallet.
            </p>
          </div>
        </div>
      </section>

      {/* 8. BOTTOM CTA BANNER */}
      <section className="text-center bg-gradient-to-r from-indigo-900/40 via-violet-900/40 to-slate-900 border border-indigo-500/30 rounded-3xl p-8 sm:p-12 space-y-6">
        <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
          Ready to Clear Your Doubts or Start Teaching?
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Join thousands of high school and entrance exam students and top educators across India.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onOpenStudentRegister}
            className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm shadow-xl shadow-indigo-600/30 flex items-center gap-2 cursor-pointer transition-all"
          >
            <GraduationCap className="w-4 h-4" />
            Student Sign Up (₹200 Free)
          </button>
          <button
            onClick={onOpenTeacherRegister}
            className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm shadow-xl shadow-amber-500/20 flex items-center gap-2 cursor-pointer transition-all"
          >
            <BookOpen className="w-4 h-4" />
            Teacher Sign Up (₹99 / Mo)
          </button>
        </div>
      </section>
    </div>
  );
};
