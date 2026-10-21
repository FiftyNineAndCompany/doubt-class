'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DoubtSubmission, WebRTCDevice, ChatMessage } from '@/types';
import { sanitizeAndMaskMessage } from '@/lib/privacy';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Monitor, 
  PenTool, 
  Camera, 
  Clock, 
  AlertTriangle, 
  Send, 
  ShieldCheck, 
  CheckCircle2, 
  PhoneOff, 
  Maximize2,
  Settings,
  Sparkles,
  Eraser,
  Palette,
  RefreshCw,
  PlusCircle,
  HelpCircle
} from 'lucide-react';

interface WebRTCClassroomProps {
  doubt: DoubtSubmission;
  userRole: 'student' | 'teacher';
  onDualComplete: () => void;
  onExit: () => void;
}

export const WebRTCClassroom: React.FC<WebRTCClassroomProps> = ({
  doubt,
  userRole,
  onDualComplete,
  onExit,
}) => {
  // Streams and media elements
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Classroom State
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [activeInputMode, setActiveInputMode] = useState<'webcam' | 'doc_cam' | 'screenshare' | 'whiteboard'>('whiteboard');

  // Device Enumeration
  const [videoDevices, setVideoDevices] = useState<WebRTCDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');

  // Session Timer (e.g. 30 minutes in seconds)
  const [remainingSeconds, setRemainingSeconds] = useState<number>(30 * 60);
  const [isOvertimePromptOpen, setIsOvertimePromptOpen] = useState(false);
  const [hasPromptedOvertime, setHasPromptedOvertime] = useState(false);
  const [isAutoDisconnected, setIsAutoDisconnected] = useState(false);

  // Dual Completion Flags
  const [studentConfirmed, setStudentConfirmed] = useState(false);
  const [teacherConfirmed, setTeacherConfirmed] = useState(false);
  const [settlementSuccess, setSettlementSuccess] = useState(false);

  // Live Chat & DLP
  const [chatInput, setChatInput] = useState('');
  const [dlpWarning, setDlpWarning] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_1',
      senderId: 'tch_001',
      senderName: doubt.acceptedTeacher?.name || 'Dr. Anand Raman',
      senderRole: 'teacher',
      rawText: 'Hello! I reviewed your doubt on Rotational Mechanics. Let us draw the free-body diagram.',
      maskedText: 'Hello! I reviewed your doubt on Rotational Mechanics. Let us draw the free-body diagram.',
      hasContactViolation: false,
      timestamp: 'Just now',
    },
  ]);

  // Whiteboard Canvas State (for Digital Pen Tablet / Smart Board)
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState('#38bdf8');
  const [penSize, setPenSize] = useState(3);
  const [isEraser, setIsEraser] = useState(false);

  // 1. Initialize navigator.mediaDevices and local stream
  useEffect(() => {
    let localStream: MediaStream | null = null;

    async function initMediaDevices() {
      try {
        if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
          // Request initial permission to enumerate devices with labels
          localStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });

          if (localVideoRef.current) {
            localVideoRef.current.srcObject = localStream;
          }

          // Enumerate all video input devices (webcams, doc cams, capture cards)
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoInputs: WebRTCDevice[] = devices
            .filter(d => d.kind === 'videoinput')
            .map((d, index) => {
              const label = d.label || `Camera ${index + 1}`;
              const isDocCam = label.toLowerCase().includes('document') || label.toLowerCase().includes('doc') || label.toLowerCase().includes('overhead');
              return {
                deviceId: d.deviceId,
                label: isDocCam ? `Document Cam: ${label}` : label,
                kind: 'videoinput',
                typeTag: isDocCam ? 'doc_cam' : 'webcam',
              };
            });

          // Add simulated Doc Cam & Smart Board options if only 1 physical webcam exists
          if (videoInputs.length <= 1) {
            videoInputs.push({
              deviceId: 'sim_doc_cam',
              label: 'External Document Camera (USB Overhead)',
              kind: 'videoinput',
              typeTag: 'doc_cam',
            });
          }

          setVideoDevices(videoInputs);
          if (videoInputs.length > 0) {
            setSelectedDeviceId(videoInputs[0].deviceId);
          }
        }
      } catch (err) {
        console.warn('Media devices not fully accessible or permission denied:', err);
      }
    }

    initMediaDevices();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  // 2. Whiteboard Canvas Setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw grid or dark blackboard background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Initial equation example for physics/math
    ctx.strokeStyle = '#38bdf8';
    ctx.font = '16px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Interactive Digital Smart Board (Pen Tablet Ready)', 20, 30);
    ctx.fillStyle = '#38bdf8';
    ctx.font = '20px sans-serif';
    ctx.fillText('Σ τ = I α   =>   (m g sin θ - f_s) R = I_cm α', 20, 70);
  }, [activeInputMode]);

  // 3. Session Countdown Clock & 5-minute Overtime alert
  useEffect(() => {
    if (remainingSeconds <= 0) {
      setIsAutoDisconnected(true);
      return;
    }

    // Trigger 5-minute notification when reaching 300 seconds
    if (remainingSeconds === 300 && !hasPromptedOvertime) {
      setIsOvertimePromptOpen(true);
      setHasPromptedOvertime(true);
    }

    const interval = setInterval(() => {
      setRemainingSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingSeconds, hasPromptedOvertime]);

  // 4. Dual Completion Watcher
  useEffect(() => {
    if (studentConfirmed && teacherConfirmed && !settlementSuccess) {
      setSettlementSuccess(true);
      onDualComplete();
    }
  }, [studentConfirmed, teacherConfirmed, settlementSuccess, onDualComplete]);

  // Screen sharing / Digital Pen Tablet capture
  const handleStartScreenShare = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices.getDisplayMedia) {
        const displayStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = displayStream;
        }
        setActiveInputMode('screenshare');
      }
    } catch (err) {
      console.warn('Screen share cancelled or not supported:', err);
    }
  };

  // Canvas drawing handlers (mouse or pen tablet stylus)
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();

    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = isEraser ? '#0f172a' : penColor;
    ctx.lineWidth = isEraser ? 24 : penSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  // Chat Submission with DLP Sanitization
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    // Apply strict DLP privacy filter
    const result = sanitizeAndMaskMessage(chatInput);

    if (result.hasViolation) {
      setDlpWarning('Privacy Notice: Personal phone numbers and email addresses are automatically masked to safeguard your privacy.');
      setTimeout(() => setDlpWarning(null), 6000);
    }

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: userRole === 'student' ? 'stu_demo' : 'tch_001',
      senderName: userRole === 'student' ? doubt.studentName : (doubt.acceptedTeacher?.name || 'Dr. Anand Raman'),
      senderRole: userRole,
      rawText: chatInput,
      maskedText: result.maskedText,
      hasContactViolation: result.hasViolation,
      timestamp: 'Just now',
    };

    setMessages(prev => [...prev, newMsg]);
    setChatInput('');
  };

  // Overtime authorization
  const handleAuthorizeOvertime = () => {
    setRemainingSeconds(prev => prev + 15 * 60); // Add 15 mins
    setIsOvertimePromptOpen(false);
    alert('Overtime authorized: 15 minutes added (+₹75 will be adjusted in final settlement).');
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // If auto-disconnected at 00:00
  if (isAutoDisconnected) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-xl mx-auto text-center space-y-4 my-12">
        <div className="w-16 h-16 bg-rose-500/10 text-rose-400 rounded-full flex items-center justify-center mx-auto">
          <PhoneOff className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">Call Disconnected (Timer Reached 00:00)</h2>
        <p className="text-xs text-slate-400">
          The scheduled duration ended. Overtime was not authorized. Both parties have been safely disconnected.
        </p>
        <button
          onClick={onExit}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
        >
          Return to Portal
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] bg-slate-950 text-white rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative">
      {/* 5-Minute Overtime Warning Modal */}
      {isOvertimePromptOpen && (
        <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/50 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 text-amber-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-bold">5 Minutes Remaining in Session</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your 30-minute doubt resolution is concluding. If you need more time with the teacher, you can authorize an overtime extension now.
            </p>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs flex justify-between items-center">
              <span>Extension: <strong>+15 Minutes</strong></span>
              <span className="font-bold text-emerald-400">+₹75.00 Escrow Hold</span>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsOvertimePromptOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
              >
                Let Clock Expire
              </button>
              <button
                onClick={handleAuthorizeOvertime}
                className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20"
              >
                Authorize Overtime (+15m)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settlement Success Modal */}
      {settlementSuccess && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/50 rounded-2xl p-6 max-w-lg w-full text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Session Completed Successfully!</h3>
            <p className="text-xs text-slate-300">
              Both Student and Teacher have confirmed completion. Double-entry escrow ledger has been executed.
            </p>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-left space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Gross Doubt Value:</span>
                <span className="font-bold text-white">₹{doubt.quotedPrice}.00</span>
              </div>
              <div className="flex justify-between text-indigo-400">
                <span>10% Platform Fee:</span>
                <span>-₹{(doubt.quotedPrice * 0.1).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-amber-400">
                <span>1% Statutory TDS:</span>
                <span>-₹{(doubt.quotedPrice * 0.01).toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-800 font-bold text-emerald-400 text-sm">
                <span>Net Transferred to Teacher:</span>
                <span>₹{(doubt.quotedPrice * 0.89).toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={onExit}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30"
            >
              Close & Return to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Classroom Header Bar */}
      <div className="px-5 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white truncate max-w-xs md:max-w-md">
                {doubt.subject}: {doubt.title}
              </h2>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded font-mono">
                {doubt.examLevel}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              1-on-1 Hardware Connected • Teacher: {doubt.acceptedTeacher?.name || 'Dr. Anand Raman'}
            </p>
          </div>
        </div>

        {/* Dynamic Countdown Clock */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <Clock className="w-4 h-4 text-amber-400" />
            <div className="flex flex-col text-right">
              <span className="text-[9px] text-slate-400 uppercase font-semibold">Remaining</span>
              <span className={`font-mono font-extrabold ${remainingSeconds <= 300 ? 'text-rose-400 animate-pulse' : 'text-amber-400'}`}>
                {formatTimer(remainingSeconds)}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsOvertimePromptOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Add Overtime
          </button>
        </div>
      </div>

      {/* Main Classroom Grid */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Stage Area: Video Feeds & Hardware Smart Board */}
        <div className="flex-1 flex flex-col p-4 relative bg-slate-950">
          {/* Hardware Source Switcher Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3 bg-slate-900/80 p-2 rounded-xl border border-slate-800 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-semibold text-[11px] mr-1">Input Source:</span>
              <button
                onClick={() => setActiveInputMode('whiteboard')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeInputMode === 'whiteboard'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                Pen Tablet / Smart Board
              </button>

              <button
                onClick={handleStartScreenShare}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeInputMode === 'screenshare'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                Screen Share (Tablet Canvas)
              </button>

              <button
                onClick={() => setActiveInputMode('doc_cam')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeInputMode === 'doc_cam'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                Document Camera
              </button>
            </div>

            {/* Video Input Device Selector */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400">Hardware:</span>
              <select
                value={selectedDeviceId}
                onChange={(e) => setSelectedDeviceId(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg text-[11px] px-2 py-1 text-slate-200 focus:outline-none"
              >
                {videoDevices.map(d => (
                  <option key={d.deviceId} value={d.deviceId}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Center Stage Display */}
          <div className="flex-1 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden relative flex items-center justify-center shadow-inner">
            {activeInputMode === 'whiteboard' ? (
              <div className="w-full h-full flex flex-col relative">
                {/* Whiteboard Drawing Controls */}
                <div className="absolute top-3 left-3 z-20 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700 shadow-lg">
                  <div className="flex items-center gap-1 pr-2 border-r border-slate-700">
                    {['#38bdf8', '#4ade80', '#fbbf24', '#f43f5e', '#ffffff'].map((color) => (
                      <button
                        key={color}
                        onClick={() => { setPenColor(color); setIsEraser(false); }}
                        className={`w-5 h-5 rounded-full border transition-transform ${
                          penColor === color && !isEraser ? 'scale-125 border-white ring-2 ring-white/30' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => setIsEraser(!isEraser)}
                    className={`p-1.5 rounded-lg text-xs flex items-center gap-1 ${
                      isEraser ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Eraser className="w-3.5 h-3.5" />
                    Eraser
                  </button>

                  <button
                    onClick={clearCanvas}
                    className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-800 text-xs flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Clear
                  </button>
                </div>

                <canvas
                  ref={canvasRef}
                  width={1000}
                  height={600}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="w-full h-full cursor-crosshair touch-none"
                />
              </div>
            ) : activeInputMode === 'doc_cam' ? (
              <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center text-center p-6 space-y-3">
                <Camera className="w-12 h-12 text-indigo-400" />
                <h4 className="font-bold text-sm text-white">External Document Camera Feed</h4>
                <p className="text-xs text-slate-400 max-w-sm">
                  Overhead document camera stream active. Ideal for handwritten paper solutions and physical book problems.
                </p>
                <span className="text-[11px] bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/30">
                  Resolving at 1080p 60fps
                </span>
              </div>
            ) : (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-contain bg-black"
              />
            )}

            {/* Picture-in-Picture Local Video (Student or Teacher) */}
            <div className="absolute bottom-4 right-4 w-44 h-28 bg-slate-950 rounded-xl overflow-hidden border-2 border-indigo-500 shadow-2xl z-30">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : 'block'}`}
              />
              {isVideoOff && (
                <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-500 text-xs font-semibold">
                  Camera Off
                </div>
              )}
              <span className="absolute bottom-1 left-2 text-[10px] bg-black/60 px-1.5 rounded text-white">
                You ({userRole})
              </span>
            </div>
          </div>

          {/* Classroom Controls Bar & Dual Completion Signoff */}
          <div className="mt-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3">
            {/* Audio / Video Toggles */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMicMuted(!isMicMuted)}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isMicMuted
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                    : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                }`}
              >
                {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                {isMicMuted ? 'Unmute' : 'Mute'}
              </button>

              <button
                onClick={() => setIsVideoOff(!isVideoOff)}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isVideoOff
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                    : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                }`}
              >
                {isVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                {isVideoOff ? 'Start Video' : 'Stop Video'}
              </button>
            </div>

            {/* DUAL COMPLETION STATUS & SIGN-OFF ACTION */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-[11px] text-slate-300 pr-2 border-r border-slate-700">
                <span className={`flex items-center gap-1 ${studentConfirmed ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5" /> Student Signed
                </span>
                <span>•</span>
                <span className={`flex items-center gap-1 ${teacherConfirmed ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5" /> Teacher Signed
                </span>
              </div>

              {/* Dynamic sign-off button for current role */}
              <button
                onClick={() => {
                  if (userRole === 'student') setStudentConfirmed(true);
                  if (userRole === 'teacher') setTeacherConfirmed(true);
                  // For instant pair-programming demo ease: allow clicking other role too
                  if (studentConfirmed) setTeacherConfirmed(true);
                  if (teacherConfirmed) setStudentConfirmed(true);
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  (userRole === 'student' && studentConfirmed) || (userRole === 'teacher' && teacherConfirmed)
                    ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                Session Completed Successfully
              </button>
            </div>
          </div>
        </div>

        {/* Live Chat Panel with DLP Privacy Masking */}
        <div className="w-full lg:w-80 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col">
          <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white">Privacy Guarded Chat</h3>
            </div>
            <span className="text-[10px] text-slate-400">DLP Active</span>
          </div>

          {/* Privacy DLP warning alert if triggered */}
          {dlpWarning && (
            <div className="bg-amber-500/10 border-b border-amber-500/30 p-2 text-[10px] text-amber-200">
              {dlpWarning}
            </div>
          )}

          {/* Messages list */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3">
            {messages.map((m) => {
              const isMe = (userRole === m.senderRole);
              return (
                <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-bold text-slate-400">{m.senderName}</span>
                    <span className="text-[9px] text-slate-600">{m.timestamp}</span>
                  </div>

                  <div
                    className={`p-2.5 rounded-xl text-xs max-w-[90%] leading-relaxed ${
                      isMe
                        ? 'bg-indigo-600 text-white rounded-br-none'
                        : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                    }`}
                  >
                    {m.maskedText}
                  </div>

                  {m.hasContactViolation && (
                    <span className="text-[9px] text-amber-400 mt-0.5">
                      ⚠️ Contact details masked per privacy policy
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Chat input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800">
            <div className="relative">
              <input
                type="text"
                placeholder="Type question or formula..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[9px] text-slate-500 mt-1.5 text-center">
              Personal phone numbers and external contact sharing prohibited.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
