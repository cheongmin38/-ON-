/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Heart, User, Phone, MapPin, Pill, Calendar, Activity,
  QrCode, Shield, Check, Volume2, Plus, Sparkles, Navigation,
  Trash2, AlertTriangle, ChevronRight, Settings, PhoneCall,
  Bell, FileText, ArrowRight, RefreshCw, Send, ShieldCheck
} from "lucide-react";
import { 
  GuardianInfo, PatientInfo, SafeZone, Medication, 
  FamilyContact, MemoryCard, CareChecklist, HospitalSchedule, CognitiveRecord 
} from "../types";

interface GuardianViewProps {
  guardianInfo: GuardianInfo;
  setGuardianInfo: React.Dispatch<React.SetStateAction<GuardianInfo>>;
  patientInfo: PatientInfo;
  setPatientInfo: React.Dispatch<React.SetStateAction<PatientInfo>>;
  safeZone: SafeZone;
  setSafeZone: React.Dispatch<React.SetStateAction<SafeZone>>;
  medications: Medication[];
  setMedications: React.Dispatch<React.SetStateAction<Medication[]>>;
  familyContacts: FamilyContact[];
  setFamilyContacts: React.Dispatch<React.SetStateAction<FamilyContact[]>>;
  memoryCards: MemoryCard[];
  setMemoryCards: React.Dispatch<React.SetStateAction<MemoryCard[]>>;
  checklists: CareChecklist[];
  setChecklists: React.Dispatch<React.SetStateAction<CareChecklist[]>>;
  schedules: HospitalSchedule[];
  setSchedules: React.Dispatch<React.SetStateAction<HospitalSchedule[]>>;
  cognitiveRecords: CognitiveRecord[];
  gpsLogs: Array<{ time: string; place: string; type: string }>;
  setGpsLogs: React.Dispatch<React.SetStateAction<Array<{ time: string; place: string; type: string }>>>;
  safetyViolations: Array<{ id: string; time: string; detail: string; action: string }>;
  setSafetyViolations: React.Dispatch<React.SetStateAction<Array<{ id: string; time: string; detail: string; action: string }>>>;
  aiSummary: string;
  setAiSummary: (s: string) => void;
  isSummarizing: boolean;
  generateAiDailySummary: () => Promise<void>;
  createAiRecallCard: (relation: string, name: string, context: string, imageUrl: string) => Promise<void>;
  isGeneratingRecall: boolean;
  onReset: () => void;
}

export default function GuardianView({
  guardianInfo,
  setGuardianInfo,
  patientInfo,
  setPatientInfo,
  safeZone,
  setSafeZone,
  medications,
  setMedications,
  familyContacts,
  setFamilyContacts,
  memoryCards,
  setMemoryCards,
  checklists,
  setChecklists,
  schedules,
  setSchedules,
  cognitiveRecords,
  gpsLogs,
  setGpsLogs,
  safetyViolations,
  setSafetyViolations,
  aiSummary,
  setAiSummary,
  isSummarizing,
  generateAiDailySummary,
  createAiRecallCard,
  isGeneratingRecall,
  onReset
}: GuardianViewProps) {
  const [activeTab, setActiveTab] = useState<"HOME" | "LOCATION" | "CARE" | "MEMORY" | "SETTINGS">("HOME");

  // Local Form states
  const [newMedName, setNewMedName] = useState("");
  const [newMedTime, setNewMedTime] = useState("오전 08:30");
  const [newMedMemo, setNewMedMemo] = useState("");

  const [newContactName, setNewContactName] = useState("");
  const [newContactRel, setNewContactRel] = useState("딸");
  const [newContactPhone, setNewContactPhone] = useState("");

  const [newMemRelation, setNewMemRelation] = useState("아들");
  const [newMemName, setNewMemName] = useState("");
  const [newMemContext, setNewMemContext] = useState("");
  const [newMemImg, setNewMemImg] = useState("https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&q=80&w=400");

  const [notificationsMock, setNotificationsMock] = useState<Array<{ id: string; title: string; body: string; time: string }>>([
    { id: "1", title: "복약 완료 피드백", body: "이지원 환자님의 아침 치매 예방약 복용이 완료되었습니다.", time: "오전 08:35" },
    { id: "2", title: "안심동선 안도 알림", body: "환자님이 자주 가시는 '반포 노인종합복지관'에 무사히 진입하였습니다.", time: "오전 10:15" }
  ]);

  // Audio narrator mock for reading prompt draft
  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ko-KR";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } else {
      alert(`🔊 [나레이션 음성 안내가 켜졌습니다]\n"${text}"`);
    }
  };

  const handleAddMed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName) return;
    const newMed: Medication = {
      id: `med-${Date.now()}`,
      name: newMedName,
      time: newMedTime,
      frequency: 1,
      memo: newMedMemo,
      takenToday: false
    };
    setMedications(prev => [...prev, newMed]);
    setNewMedName("");
    setNewMedMemo("");
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName || !newContactPhone) return;
    const newContact: FamilyContact = {
      id: `fc-${Date.now()}`,
      name: newContactName,
      relationship: newContactRel,
      phone: newContactPhone
    };
    setFamilyContacts(prev => [...prev, newContact]);
    setNewContactName("");
    setNewContactPhone("");
  };

  const triggerMockEscapeAlert = () => {
    const timestamp = new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
    const escapePlace = "수변 아파트 앞 한강 산책로 부근";
    
    // Simulate immediate system alert
    alert(`🚨 [긴급 경보 수신]\n${patientInfo.name} 환자분이 안전 구역(${safeZone.address} 반경 ${safeZone.radius}m)을 벗어나 '${escapePlace}'으로 이동 중입니다!`);
    
    const newViolation = {
      id: `sv-${Date.now()}`,
      time: `오늘 ${timestamp}`,
      detail: `안심 안전구역 (${safeZone.radius}m) 이탈 감지 경고`,
      action: "스피커 귀가 유도 안심 나레이션 자동 발송 및 보호자 긴급 통화 연동"
    };
    setSafetyViolations(prev => [newViolation, ...prev]);
    setGpsLogs(prev => [{ time: timestamp, place: `${escapePlace} (이탈 감지)`, type: "VIOLATION" }, ...prev]);
    
    // Core iOS style push pop
    setNotificationsMock(prev => [
      {
        id: `push-${Date.now()}`,
        title: "🚨 안심영역 이탈 경보",
        body: `${patientInfo.name}님이 안심반경을 초과하여 ${escapePlace}에 있습니다. 지도를 열어 추적하세요.`,
        time: "방금 전"
      },
      ...prev
    ]);
  };

  const toggleMedTaken = (id: string) => {
    setMedications(prev => prev.map(m => m.id === id ? { ...m, takenToday: !m.takenToday } : m));
  };

  const toggleChecklistDone = (id: string) => {
    setChecklists(prev => prev.map(c => c.id === id ? { ...c, completed: !c.completed } : c));
  };

  const deleteMed = (id: string) => {
    setMedications(prev => prev.filter(m => m.id !== id));
  };

  const deleteContact = (id: string) => {
    setFamilyContacts(prev => prev.filter(c => c.id !== id));
  };

  const deleteMemoryCard = (id: string) => {
    setMemoryCards(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="flex-1 flex flex-col justify-between h-full bg-[#F2F2F7]" id="guardian-root">
      
      {/* Scrollable Screen Body */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 custom-scrollbar">
        
        {/* iOS Push Notification Simulator Center */}
        {notificationsMock.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[11px] font-bold text-slate-400 px-1 uppercase tracking-wider">
              <span>알림 센터 (iOS 푸시 알림 가상 연동)</span>
              <button 
                onClick={() => setNotificationsMock([])} 
                className="text-[#007AFF] hover:underline"
              >
                모두 지우기
              </button>
            </div>
            <div className="space-y-2">
              <AnimatePresence>
                {notificationsMock.slice(0, 2).map((p) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white/90 backdrop-blur-md rounded-2xl p-3.5 shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-slate-200/50 flex gap-3 items-start relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#007AFF]" />
                    <div className="p-1.5 bg-blue-50 text-[#007AFF] rounded-lg">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div className="flex-1 text-xs">
                      <div className="flex justify-between items-center font-bold text-slate-800">
                        <span>{p.title}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{p.time}</span>
                      </div>
                      <p className="text-slate-500 mt-1 leading-normal text-[11px]">{p.body}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 1: GUARDIAN HOME */}
        {/* ========================================================= */}
        {activeTab === "HOME" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            
            {/* Health Apple Banner Header */}
            <div className="flex justify-between items-start pb-1">
              <div>
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">모니터링 포털</span>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">돌봄 정보 센터</h1>
              </div>
              <div 
                onClick={triggerMockEscapeAlert}
                title="시뮬레이션 이탈 알림 작동"
                className="flex items-center gap-1 bg-[#FFF2F2] border border-[#FFD9D9] text-[#FF3B30] hover:bg-[#FFE5E5] px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5" /> 시뮬레이션 이탈
              </div>
            </div>

            {/* Smart Gemini AI Summary Card (The Hero Component) */}
            <div className="bg-gradient-to-tr from-[#1E293B] via-[#0F172A] to-[#1E3A8A] rounded-3xl p-5 text-white shadow-[0_12px_30px_rgba(15,23,42,0.15)] border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-44 h-44 bg-[#3B82F6]/10 rounded-full blur-2xl -translate-y-10 translate-x-10" />
              
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-1.5 bg-white/10 text-blue-200 border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                  <Sparkles className="w-3 h-3 text-amber-200 fill-amber-300 animate-pulse" /> 안심ON AI 케어 비서
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#34C759] animate-ping" />
                  <span className="text-[9px] text-white/50 tracking-wider">실시간 연동 상태</span>
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-base font-extrabold text-white leading-tight">이지원 환자님 일일 상태 보고서</h2>
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 text-xs text-slate-200 leading-relaxed whitespace-pre-line max-h-[160px] overflow-y-auto custom-scrollbar">
                  {aiSummary}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between gap-3 pt-3 mt-2 border-t border-white/10">
                <span className="text-[10px] text-slate-400">Gemini-3.5 기반 자동 요약 연동</span>
                <button
                  onClick={generateAiDailySummary}
                  disabled={isSummarizing}
                  className="bg-white hover:bg-slate-50 active:scale-95 text-slate-900 text-[11px] font-extrabold px-3.5 py-2 rounded-xl transition flex items-center gap-1 shadow-md disabled:opacity-50"
                >
                  {isSummarizing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" /> 작성 중...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" /> AI 보고서 갱신
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* iOS style Health status grid */}
            <div className="grid grid-cols-2 gap-3.5">
              
              {/* Quick GPS Status Widget */}
              <div 
                onClick={() => setActiveTab("LOCATION")}
                className="bg-white p-4 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-slate-200/60 cursor-pointer hover:border-[#007AFF] transition-all flex flex-col justify-between h-28"
              >
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-[10px] font-bold block uppercase tracking-wider">위치 모니터</span>
                  <Navigation className="w-4 h-4 text-[#007AFF] fill-blue-50" />
                </div>
                <div className="mt-1">
                  <span className="text-[10px] text-slate-400">현재 상태</span>
                  <h3 className="text-sm font-extrabold text-slate-800 truncate mt-0.5">안전구역 내부 체류</h3>
                  <p className="text-[10px] text-[#34C759] font-bold mt-1">✓ 이탈 정보 없음</p>
                </div>
              </div>

              {/* Quick Medication progress Widget */}
              <div 
                onClick={() => setActiveTab("CARE")}
                className="bg-white p-4 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-slate-200/60 cursor-pointer hover:border-[#007AFF] transition-all flex flex-col justify-between h-28"
              >
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-[10px] font-bold block uppercase tracking-wider">복약 달성률</span>
                  <Pill className="w-4 h-4 text-[#FF9500]" />
                </div>
                <div>
                  <div className="flex justify-between items-end">
                    <span className="text-[20px] font-black text-slate-800">
                      {Math.round((medications.filter(m => m.takenToday).length / medications.length) * 100)}%
                    </span>
                    <span className="text-[10px] text-slate-400 block pb-1">
                      {medications.filter(m => m.takenToday).length}/{medications.length} 회 완료
                    </span>
                  </div>
                  {/* Subtle bar */}
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1.5">
                    <div 
                      className="bg-[#34C759] h-full transition-all duration-500" 
                      style={{ width: `${(medications.filter(m => m.takenToday).length / medications.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Apple style Task Checklist of Daily Care */}
            <div className="bg-white rounded-3xl p-4.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-slate-200/60">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">오늘 중요 케어 진행 사항</h3>
                <span className="text-[10px] text-slate-400">보호자 대리 동의 가능</span>
              </div>
              
              <div className="space-y-2">
                {checklists.map((todo) => (
                  <div 
                    key={todo.id}
                    onClick={() => toggleChecklistDone(todo.id)}
                    className="flex justify-between items-center p-3 bg-[#F8F9FA] hover:bg-[#F2F2F7] rounded-xl border border-slate-100 cursor-pointer transition select-none"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-5 h-5 rounded-md flex items-center justify-center border text-white ${
                        todo.completed 
                          ? "bg-[#34C759] border-[#34C759]" 
                          : "bg-white border-slate-300"
                      }`}>
                        {todo.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </span>
                      <span className={`text-[12px] ${todo.completed ? "line-through text-slate-400" : "font-semibold text-slate-700"}`}>
                        {todo.title}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">{todo.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Apple style Patient Bio & Medical Profile Container */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/60 shadow-[0_2px_12px_rgba(0,0,0,0.01)] space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF5E3A] to-[#FF9500] text-white font-extrabold text-sm flex items-center justify-center">
                  {patientInfo.name[0]}
                </div>
                <div>
                  <h3 className="text-[13px] font-black text-slate-850">집중 모니터링 프로필</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">이지원 환자 • 여성 • 만 71세</p>
                </div>
              </div>
              <div className="space-y-2.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400 truncate">환자 주소코드</span>
                  <span className="font-bold text-slate-700">{patientInfo.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 truncate">병력/치료 일지</span>
                  <span className="font-bold text-slate-700 text-right max-w-[180px] truncate">{patientInfo.diseaseNotes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">장치 배터리 잔량</span>
                  <span className="font-bold text-[#34C759]">88% 정상 보호중</span>
                </div>
              </div>
            </div>

          </motion.div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: GUARDIAN LOCATION (Custom Tracking Map) */}
        {/* ========================================================= */}
        {activeTab === "LOCATION" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            
            <div className="pb-1">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">실시간 안전 존</span>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">안심 지도 모니터</h1>
            </div>

            {/* Clean Vector SVG Interactive Map representation */}
            <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#FF3B30]" /> 이지원 환자 위치 트래킹
                </span>
                <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 font-extrabold animate-pulse">● 실시간 위성 양호</span>
              </div>

              {/* Simulated Map Render */}
              <div className="w-full h-56 bg-sky-50 rounded-2xl relative overflow-hidden border border-slate-200 flex items-center justify-center">
                
                {/* SVG decorative street layout grids */}
                <svg className="absolute inset-0 w-full h-full text-slate-200/50" xmlns="http://www.w3.org/2000/svg">
                  <line x1="10%" y1="0" x2="10%" y2="100%" stroke="currentColor" strokeWidth="4" />
                  <line x1="50%" y1="0" x2="50%" y2="100%" stroke="currentColor" strokeWidth="6" />
                  <line x1="85%" y1="0" x2="85%" y2="100%" stroke="currentColor" strokeWidth="3" />
                  <line x1="0" y1="30%" x2="100%" y2="30%" stroke="currentColor" strokeWidth="5" />
                  <line x1="0" y1="75%" x2="100%" y2="75%" stroke="currentColor" strokeWidth="3" />
                  {/* Han-river vector */}
                  <path d="M 0,20 Q 150,55 450,45" fill="none" stroke="#A5F3FC" strokeWidth="35" opacity="0.8" />
                </svg>

                {/* Safe zone circle indicator overlays */}
                <div 
                  className="absolute rounded-full bg-emerald-500/10 border-2 border-dashed border-[#34C759]/60 flex items-center justify-center transition-all duration-300 pointer-events-none"
                  style={{ 
                    width: `${safeZone.radius === 300 ? "140px" : safeZone.radius === 500 ? "200px" : "280px"}`, 
                    height: `${safeZone.radius === 300 ? "140px" : safeZone.radius === 500 ? "200px" : "280px"}` 
                  }}
                >
                  <span className="text-[9px] text-[#34C759] font-black bg-white px-2 py-0.5 rounded-full shadow-xs border border-emerald-200">
                    안심 반경 {safeZone.radius}m
                  </span>
                </div>

                {/* House home center pointer */}
                <div className="absolute flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-slate-950/80 border-2 border-white flex items-center justify-center shadow-lg text-white">
                    🏠
                  </div>
                  <span className="text-[9px] bg-slate-900 text-white px-1.5 py-0.5 rounded shadow mt-1 whitespace-nowrap">안심 중심지 (집)</span>
                </div>

                {/* Patient coordinates pointer */}
                <motion.div 
                  animate={{ y: [-4, 4, -4] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                  className="absolute translate-x-12 -translate-y-8 flex flex-col items-center z-10"
                >
                  <div className="relative flex items-center justify-center">
                    <span className="absolute inline-flex h-9 w-9 rounded-full bg-[#007AFF]/30 animate-ping" />
                    <div className="w-8 h-8 rounded-full bg-[#007AFF] border-2 border-white flex items-center justify-center shadow-lg text-white">
                      👩‍🦳
                    </div>
                  </div>
                  <span className="text-[9px] bg-[#007AFF] text-white px-1.5 py-0.5 rounded-full font-bold shadow-md mt-1 animate-bounce whitespace-nowrap">
                    {patientInfo.name} 환자
                  </span>
                </motion.div>

                {/* Floating GPS location card */}
                <div className="absolute bottom-2.5 left-2.5 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl text-[10px] border border-slate-200/60 shadow-md">
                  <p className="text-slate-400">현재 수집 위치</p>
                  <p className="font-extrabold text-slate-800 mt-0.5">반포 수변공원 인지 쉼터 주변</p>
                </div>
              </div>

              {/* Interactive radius slider selector */}
              <div className="bg-[#F8F9FA] p-3 rounded-2xl border border-slate-100 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-slate-800">안심 반경 모니터 설정</span>
                  <p className="text-[10px] text-slate-400">이 범위를 넘어가면 대피 경고 송출</p>
                </div>
                <div className="flex gap-1">
                  {[300, 500, 1000].map((r) => (
                    <button
                      key={r}
                      onClick={() => setSafeZone(prev => ({ ...prev, radius: r }))}
                      className={`px-2.5 py-1 text-[10px] font-black rounded-lg border transition ${
                        safeZone.radius === r 
                          ? "bg-[#007AFF] text-white border-transparent" 
                          : "bg-white text-slate-600 border-slate-250"
                      }`}
                    >
                      {r >= 1000 ? "1km" : `${r}m`}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Location Trajectory Timeline */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">오늘 실시간 안전 동선 경로</h3>
              
              <div className="space-y-3.5 relative pl-4 before:absolute before:left-1.5 before:top-1.5 before:bottom-1.5 before:w-0.5 before:bg-slate-200">
                {gpsLogs.map((log, idx) => (
                  <div key={idx} className="relative flex justify-between items-center text-[12px]">
                    {/* Ring dot handle */}
                    <span className={`absolute -left-[14.5px] w-3 h-3 rounded-full border-2 border-white ${
                      log.type === "VIOLATION" ? "bg-[#FF3B30]" : "bg-[#007AFF]"
                    }`} />
                    <div>
                      <span className={`font-bold ${log.type === "VIOLATION" ? "text-[#FF3B30]" : "text-slate-800"}`}>
                        {log.place}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety Violations warning reports */}
            <div className="bg-[#FFF2F2] rounded-3xl p-4 border border-[#FFD9D9] space-y-2">
              <h3 className="text-xs font-black text-[#FF3B30] uppercase tracking-wider flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> 안심영역 이탈 과거 감지 기록
              </h3>
              
              {safetyViolations.length === 0 ? (
                <p className="text-[11px] text-[#A66060] text-center py-2">검출된 안심 구역 밖 무단 이동 이력이 없습니다.</p>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-1">
                  {safetyViolations.map((v) => (
                    <div key={v.id} className="p-3 bg-white rounded-xl border border-[#FFD9D9] text-[11px]">
                      <div className="flex justify-between font-bold text-slate-800">
                        <span className="text-[#FF3B30]">{v.detail}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{v.time}</span>
                      </div>
                      <p className="text-slate-500 mt-1 leading-normal">안도 피드백: {v.action}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </motion.div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: GUARDIAN CARE (Medication & Doctor Appointments) */}
        {/* ========================================================= */}
        {activeTab === "CARE" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            
            <div className="pb-1">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">건강 캘린더</span>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">의약품 및 진료 관리</h1>
            </div>

            {/* Interactive Medications schedule manager */}
            <div className="bg-white rounded-3xl p-4.5 border border-slate-200/60 shadow-sm space-y-3.5">
              <h3 className="text-xs font-black text-slate-850 uppercase tracking-wider">복약 의약 스케줄 목록</h3>
              
              <div className="space-y-2.5">
                {medications.map((med) => (
                  <div key={med.id} className="p-3 bg-[#F8F9FA] rounded-2xl border border-slate-100 flex justify-between items-center text-xs">
                    <div className="flex items-start gap-2.5">
                      <div className="p-1.5 bg-[#FFF9F2] text-[#FF9500] rounded-lg mt-0.5">
                        <Pill className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-800">{med.name}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">{med.time} • {med.memo}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleMedTaken(med.id)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-xs transition ${
                          med.takenToday 
                            ? "bg-[#34C759] text-white" 
                            : "bg-slate-200 text-slate-500 hover:bg-slate-350"
                        }`}
                      >
                        {med.takenToday ? "오늘 복용" : "미복용 대기"}
                      </button>
                      <button 
                        onClick={() => deleteMed(med.id)}
                        className="p-1.5 text-slate-300 hover:text-red-500 rounded-lg transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add medic inline form */}
              <form onSubmit={handleAddMed} className="p-3 bg-[#F2F2F7] rounded-2xl space-y-2 border border-slate-200/40">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">새 정기 의약품 추가</span>
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text" 
                    required 
                    value={newMedName}
                    onChange={(e) => setNewMedName(e.target.value)}
                    placeholder="약 종류명 (예: 도네페질정)" 
                    className="p-2 bg-white border border-slate-200 rounded-xl text-[11px] focus:outline-none"
                  />
                  <select
                    value={newMedTime}
                    onChange={(e) => setNewMedTime(e.target.value)}
                    className="p-2 bg-white border border-slate-200 rounded-xl text-[11px] outline-none"
                  >
                    <option>오전 08:30</option>
                    <option>오후 13:00</option>
                    <option>오후 19:30</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={newMedMemo}
                    onChange={(e) => setNewMedMemo(e.target.value)}
                    placeholder="알림 팁 (예: 식후 바로 물 1정)" 
                    className="flex-1 p-2 bg-white border border-slate-200 rounded-xl text-[11px] focus:outline-none"
                  />
                  <button type="submit" className="px-3 bg-[#007AFF] text-white rounded-xl text-[11px] font-bold flex items-center gap-0.5">
                    <Plus className="w-4.5 h-4.5" /> 추가
                  </button>
                </div>
              </form>
            </div>

            {/* Apple style Clinical Schedule */}
            <div className="bg-white rounded-3xl p-4.5 border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-xs font-black text-slate-850 uppercase tracking-wider">정기 신경 신경과 병원 예약</h3>
              
              <div className="space-y-2.5">
                {schedules.map((appointment) => (
                  <div key={appointment.id} className="p-3 bg-[#F8F9FA] rounded-2xl border border-slate-100/50 text-[11px]">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-extrabold text-slate-800 text-xs">{appointment.hospitalName} ({appointment.doctorName})</span>
                      <span className="bg-blue-50 text-[#007AFF] font-bold px-2 py-0.5 rounded-lg border border-blue-100 text-[9px]">{appointment.date}</span>
                    </div>
                    <p className="text-slate-500">진료 시간: {appointment.time}</p>
                    <p className="text-slate-400 mt-1">질병 설명: {appointment.memo}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Interactive SVG Chart representing cognitive training indices */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
              <div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">주간 인지 지수 트레이닝 리포트</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">최근 인지 훈련 평가 점수 변화도</p>
              </div>

              {/* Lightweight robust interactive graph vector layout */}
              <div className="relative pt-4">
                <svg className="w-full h-28" viewBox="0 0 400 100" overflow="visible">
                  {/* Grid lines */}
                  <line x1="0" y1="10" x2="400" y2="10" stroke="#F1F3F5" strokeWidth="1" />
                  <line x1="0" y1="50" x2="400" y2="50" stroke="#F1F3F5" strokeWidth="1" />
                  <line x1="0" y1="90" x2="400" y2="90" stroke="#F1F3F5" strokeWidth="1" />

                  {/* SVG Path calculation matching indices */}
                  {/* Indices: 06-01: 85 (y=25), 06-03: 72 (y=38), 06-05: 90 (y=20), 06-06: 80 (y=30) */}
                  <path 
                    d="M 50,25 L 150,38 L 250,20 L 350,30" 
                    fill="none" 
                    stroke="#007AFF" 
                    strokeWidth="3.5" 
                    strokeLinecap="round"
                    strokeLinejoin="round" 
                  />

                  {/* Gradient Area below line */}
                  <path 
                    d="M 50,25 L 150,38 L 250,20 L 350,30 L 350,90 L 50,90 Z" 
                    fill="url(#grad)" 
                    opacity="0.1" 
                  />

                  {/* Gradient definition */}
                  <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#007AFF" />
                      <stop offset="100%" stopColor="#007AFF" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Interactive Dot labels */}
                  <circle cx="50" cy="25" r="5" fill="#007AFF" stroke="white" strokeWidth="1.5" />
                  <circle cx="150" cy="38" r="5" fill="#007AFF" stroke="white" strokeWidth="1.5" />
                  <circle cx="250" cy="20" r="5" fill="#007AFF" stroke="white" strokeWidth="1.5" />
                  <circle cx="350" cy="30" r="5" fill="#007AFF" stroke="white" strokeWidth="1.5" />

                  {/* Points labels */}
                  <text x="50" y="15" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#007AFF">85</text>
                  <text x="150" y="28" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#007AFF">72</text>
                  <text x="250" y="10" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#007AFF">90</text>
                  <text x="350" y="20" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#007AFF">80</text>

                  {/* Dates footer labels */}
                  <text x="50" y="102" textAnchor="middle" fontSize="8" fill="#999">6/1</text>
                  <text x="150" y="102" textAnchor="middle" fontSize="8" fill="#999">6/3</text>
                  <text x="250" y="102" textAnchor="middle" fontSize="8" fill="#999">6/5</text>
                  <text x="350" y="102" textAnchor="middle" fontSize="8" fill="#999">오늘</text>
                </svg>
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-400 bg-slate-50 p-2.5 rounded-lg">
                <span>평가 유형 : 도형 회상 & 일상 퍼즐 매치 지침</span>
                <span className="font-bold text-slate-700">안심안정 상태 유지</span>
              </div>
            </div>

          </motion.div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: GUARDIAN MEMORY ALBUM (TTS & AI Prompt Design) */}
        {/* ========================================================= */}
        {activeTab === "MEMORY" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            
            <div className="pb-1">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">AI 정서 케어</span>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">회상 기억 재생 카드</h1>
            </div>

            {/* AI Generator Box */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-xs font-black text-[#007AFF] flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 fill-blue-100" /> 신규 치료 기억 회상 카드 빌더
              </h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                과거의 다정했던 상황 사진을 등록해 주시면, 환자용 나레이션 가이드 문장과 대화 유도 팁을 AI 비서로 자동 정형 코딩합니다.
              </p>

              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!newMemName || !newMemContext) return;
                  await createAiRecallCard(newMemRelation, newMemName, newMemContext, newMemImg);
                  setNewMemName("");
                  setNewMemContext("");
                }}
                className="space-y-3.5 pt-2"
              >
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 block">가족 관계</label>
                    <select
                      value={newMemRelation}
                      onChange={(e) => setNewMemRelation(e.target.value)}
                      className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                    >
                      <option>아들</option>
                      <option>딸</option>
                      <option>배우자</option>
                      <option>손주</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] font-black text-slate-500 block">가족 실명</label>
                    <input 
                      type="text" 
                      required
                      value={newMemName}
                      onChange={(e) => setNewMemName(e.target.value)}
                      placeholder="이름 예) 김태진"
                      className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 block">기록하고 싶은 행복했던 순간 설명</label>
                  <textarea 
                    rows={2}
                    required
                    value={newMemContext}
                    onChange={(e) => setNewMemContext(e.target.value)}
                    placeholder="예) 지난 겨울 손주 백일 잔치 때 어머님이 활짝 웃으시며 안고 계시던 시절"
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none resize-none"
                  />
                </div>

                {/* Preset image choice wrapper */}
                <div>
                  <span className="text-[10px] font-black text-slate-500 block mb-1">앨범 모의 프리셋 선택</span>
                  <div className="flex gap-2">
                    {[
                      { url: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&q=80&w=200", label: "봄 카네이션 밭" },
                      { url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=200", label: "가을 단풍 온천" },
                      { url: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&q=80&w=200", label: "따스한 햇살 차" }
                    ].map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setNewMemImg(img.url)}
                        className={`flex-1 p-1 bg-slate-50 rounded-lg border text-[10px] truncate ${
                          newMemImg === img.url ? "border-[#007AFF] ring-2 ring-blue-50 bg-blue-50/20" : "border-slate-200"
                        }`}
                      >
                        {img.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isGeneratingRecall}
                  className="w-full py-2.5 bg-[#007AFF] hover:bg-blue-600 disabled:opacity-55 font-extrabold text-[#fff] text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  {isGeneratingRecall ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> 정교한 AI 나레이션 가이드 쓰는 중...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 stroke-[3]" /> 새 추억치료 회상카드 빌드하기
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* List of active memory cards */}
            <div className="space-y-3">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider px-1">등록된 기억 보존 카드 리스트 ({memoryCards.length})</h3>
              
              <div className="space-y-3">
                {memoryCards.map((card) => (
                  <div key={card.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs flex flex-col md:flex-row">
                    <img 
                      src={card.imageUrl} 
                      alt="Memory cover" 
                      className="w-full md:w-32 h-28 object-cover flex-shrink-0"
                    />
                    <div className="p-4 flex-1 flex flex-col justify-between text-xs space-y-2">
                      <div>
                        <div className="flex justify-between items-center">
                          <span className="font-extrabold text-[#007AFF] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100/60 pb-1 text-[10px]">
                            {card.relation} • {card.personName}
                          </span>
                          <button 
                            onClick={() => deleteMemoryCard(card.id)}
                            className="text-slate-300 hover:text-red-500 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-slate-500 font-bold mt-1.5 text-[11px]">줄거리: {card.context}</p>
                        <p className="text-slate-700 italic bg-slate-50/70 p-2 rounded-lg border border-slate-100 leading-normal mt-2 text-[10px]">
                          📢 나레이션: "{card.speechText}"
                        </p>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-slate-100 flex-wrap gap-2">
                        <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 font-bold">{card.promptTips || "당시 옷 색깔을 질문해 보세요"}</span>
                        
                        <button
                          onClick={() => speakText(card.speechText || "")}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-[9px] font-bold text-slate-700 flex items-center gap-1 transition"
                        >
                          <Volume2 className="w-3 h-3 text-[#007AFF]" /> 가상 재생
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: GUARDIAN CONFIGURATION */}
        {/* ========================================================= */}
        {activeTab === "SETTINGS" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            
            <div className="pb-1">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">제어반</span>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">시스템 환경설정</h1>
            </div>

            {/* Account config */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/60 shadow-xs space-y-4">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">주요 보호자 & 피보호자 동기화 설정</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-black text-slate-400 block pb-1">보호자 이름</label>
                  <input 
                    type="text" 
                    value={guardianInfo.name}
                    onChange={(e) => setGuardianInfo(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-2.5 bg-[#F2F2F7] border border-slate-200 rounded-xl text-xs focus:outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 block pb-1">보호자와 관계</label>
                  <input 
                    type="text" 
                    value={guardianInfo.relationship}
                    onChange={(e) => setGuardianInfo(prev => ({ ...prev, relationship: e.target.value }))}
                    className="w-full p-2.5 bg-[#F2F2F7] border border-slate-200 rounded-xl text-xs focus:outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 block pb-1">긴급 발신 연락망 최우선폰</label>
                  <input 
                    type="text" 
                    value={guardianInfo.phone}
                    onChange={(e) => setGuardianInfo(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full p-2.5 bg-[#F2F2F7] border border-slate-200 rounded-xl text-xs focus:outline-none font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Sync link block */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/65 shadow-xs text-center space-y-3 flex flex-col items-center">
              <QrCode className="w-20 h-20 text-slate-800" />
              <div>
                <h4 className="text-xs font-black text-slate-800">환자 휴대폰 동기화 코드 고유키</h4>
                <p className="text-[10px] text-[#007AFF] font-black tracking-widest mt-1">ON-7295</p>
                <p className="text-[10px] text-slate-400 mt-1 leading-normal max-w-[220px]">이 연동 고유코드를 지참해 어르신의 전화기 어플리케이션 가동 시 채워주시면 동선 연동이 영구 보장됩니다.</p>
              </div>
            </div>

            {/* Reset configurations with beautiful button */}
            <div className="bg-[#FFF2F2] rounded-3xl p-4.5 border border-[#FFD9D9] space-y-2">
              <h3 className="text-xs font-black text-[#FF3B30] uppercase tracking-wider">클린 가속 테스트 데이터 초기화</h3>
              <p className="text-[10px] text-[#A66060] leading-normal">
                세션이 꼬이거나 다른 데모 흐름을 쾌적하게 처음부터 모의 승인하려면 하단 리셋 단추를 사용합니다.
              </p>
              <button
                onClick={onReset}
                className="w-full py-2.5 bg-[#FF3B30] text-white hover:brightness-110 font-bold rounded-xl text-xs transition"
              >
                전체 스토리지 데이터 초기 리셋 및 포맷
              </button>
            </div>

          </motion.div>
        )}

      </div>

      {/* ========================================================= */}
      {/* iOS TAB BAR COMPONENT */}
      {/* ========================================================= */}
      <footer className="h-16 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 flex justify-around items-center select-none" id="guardian-tabbar">
        
        <button 
          onClick={() => setActiveTab("HOME")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            activeTab === "HOME" ? "text-[#007AFF] scale-105" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Heart className={`w-5 h-5 ${activeTab === "HOME" ? "fill-blue-50 stroke-[2.5]" : "stroke-[2]"}`} />
          <span className="text-[9px] font-bold mt-1">홈 케어</span>
        </button>

        <button 
          onClick={() => setActiveTab("LOCATION")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            activeTab === "LOCATION" ? "text-[#007AFF] scale-105" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Navigation className={`w-5 h-5 ${activeTab === "LOCATION" ? "fill-blue-50 stroke-[2.5]" : "stroke-[2]"}`} />
          <span className="text-[9px] font-bold mt-1">안심 지도</span>
        </button>

        <button 
          onClick={() => setActiveTab("CARE")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            activeTab === "CARE" ? "text-[#007AFF] scale-105" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Pill className={`w-5 h-5 ${activeTab === "CARE" ? "fill-blue-50 stroke-[2.5]" : "stroke-[2]"}`} />
          <span className="text-[9px] font-bold mt-1">건강보고</span>
        </button>

        <button 
          onClick={() => setActiveTab("MEMORY")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            activeTab === "MEMORY" ? "text-[#007AFF] scale-105" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <FileText className={`w-5 h-5 ${activeTab === "MEMORY" ? "fill-blue-50 stroke-[2.5]" : "stroke-[2]"}`} />
          <span className="text-[9px] font-bold mt-1">추억치료</span>
        </button>

        <button 
          onClick={() => setActiveTab("SETTINGS")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            activeTab === "SETTINGS" ? "text-[#007AFF] scale-105" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Settings className={`w-5 h-5 ${activeTab === "SETTINGS" ? "fill-blue-50 stroke-[2.5]" : "stroke-[2]"}`} />
          <span className="text-[9px] font-bold mt-1">제어반</span>
        </button>

      </footer>

    </div>
  );
}
