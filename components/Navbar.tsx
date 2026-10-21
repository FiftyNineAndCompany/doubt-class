'use client';

import React from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Video, 
  Database, 
  Wallet, 
  Sparkles,
  Home,
  UserPlus
} from 'lucide-react';

export type ActiveTab = 'landing' | 'student' | 'teacher' | 'classroom' | 'architecture';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  studentBalance: number;
  teacherBalance: number;
  onOpenStudentRegister?: () => void;
  onOpenTeacherRegister?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  studentBalance,
  teacherBalance,
  onOpenStudentRegister,
  onOpenTeacherRegister,
}) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/85 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-amber-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
                  Just Doubts
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                  1-on-1 Instant
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">by Saitechverse Solutions</p>
            </div>
          </div>

          {/* Navigation Flow Tabs */}
          <nav className="hidden lg:flex items-center gap-1 p-1 bg-slate-900/90 border border-slate-800 rounded-xl">
            <button
              onClick={() => setActiveTab('landing')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'landing'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              Home & About
            </button>

            <button
              onClick={() => setActiveTab('student')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'student'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Student Portal
            </button>

            <button
              onClick={() => setActiveTab('teacher')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'teacher'
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Teacher SLA
            </button>

            <button
              onClick={() => setActiveTab('classroom')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'classroom'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 animate-pulse'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              Hardware Classroom
            </button>

            <button
              onClick={() => setActiveTab('architecture')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'architecture'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              Architecture
            </button>
          </nav>

          {/* Quick Register CTAs & Wallets */}
          <div className="flex items-center gap-2.5">
            {onOpenStudentRegister && (
              <button
                onClick={onOpenStudentRegister}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 hover:border-indigo-400 rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                Student Sign-Up
              </button>
            )}

            {onOpenTeacherRegister && (
              <button
                onClick={onOpenTeacherRegister}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:border-amber-400 rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                Teacher (₹99)
              </button>
            )}

            {/* Wallet summary */}
            <div 
              onClick={() => setActiveTab('student')}
              className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs cursor-pointer hover:border-slate-700 transition-all"
            >
              <Wallet className="w-3.5 h-3.5 text-emerald-400" />
              <div className="flex flex-col text-right">
                <span className="text-[9px] text-slate-400 leading-tight">Student</span>
                <span className="font-bold text-emerald-400">₹{studentBalance}</span>
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('teacher')}
              className="hidden md:flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs cursor-pointer hover:border-slate-700 transition-all"
            >
              <div className="flex flex-col text-right">
                <span className="text-[9px] text-slate-400 leading-tight">Teacher</span>
                <span className="font-bold text-violet-400">₹{teacherBalance}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
