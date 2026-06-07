/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Heart, Phone, Home, AlertTriangle, Play, Pause,
  Volume2, ShieldAlert, ArrowLeft, X, PhoneCall,
  UserCheck, Compass, HelpCircle, MapPin, Navigation, User
} from "lucide-react";
import { PatientInfo, FamilyContact, MemoryCard } from "../types";

interface PatientViewProps {
  patientInfo: PatientInfo;
  familyContacts: FamilyContact[];
  memoryCards: MemoryCard[];
}

export default function PatientView({
  patientInfo,
  familyContacts,
  memoryCards
}: PatientViewProps) {
  // Navigation states
  const [activeFrame, setActiveFrame] = useState<"HOME" | "MAP_GUIDE" | "SOS_ACTIVE">("HOME");
  
  // Calling state simulation
  const [activeCallContact, setActiveCallContact] = useState<FamilyContact | null>(null);
  const [callTimer, setCallTimer] = useState(0);

  // Dementia Album Slide states
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Digital clock helper
  const [currentTime, setCurrentTime] = useState("");
  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      const options: Intl.DateTimeFormatOptions = { 
        month: "long", 
        day: "numeric", 
        weekday: "short", 
        hour: "numeric", 
        minute: "2-digit", 
        hour12: true 
      };
      // Format manual time elegantly without relying on system dependent formats that might output differently
      const formatted = date.toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "short" }) + " " + 
                        date.toLocaleTimeString("ko-KR", { hour: "numeric", minute: "2-digit", hour12: false });
      setCurrentTime(formatted);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Outgoing phone timer simulator
  useEffect(() => {
    let timerId: any;
    if (activeCallContact) {
      setCallTimer(0);
      timerId = setInterval(() => {
        setCallTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timerId);
  }, [activeCallContact]);

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ko-KR";
      utterance.rate = 0.85; // gently slower for elderly
      utterance.onend = () => setIsPlayingAudio(false);
      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlayingAudio(true);
      alert(`[안내 방송 재생]\n"${text}"`);
      setTimeout(() => setIsPlayingAudio(false), 3000);
    }
  };

  const handleStopSpeech = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
  };

  const speakHomeInstructions = () => {
    const text = `어머님, 걱정하지 마세요. 현재 계신 곳에서 약 사백미터 앞 근방에 어머님의 안락한 보금자리 반포동 십이 다시 삼 주소가 마련되어 있어요. 복지길 대로변에서 백사십삼번 버스를 타시면 안전하게 가실 수 있습니다. 아들이 이미 위치를 확인 중이에요.`;
    speakText(text);
  };

  const formatCallDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="flex-1 flex flex-col justify-between h-full bg-[#F2F4F6] relative overflow-hidden text-[#191F28] font-sans" id="patient-root">
      
      {/* Scrollable Patient Canvas */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 custom-scrollbar pb-24">
        
        {/* Dynamic header panel optimized for high visibility */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm text-center space-y-2">
          {/* Heart icon */}
          <div className="flex justify-center">
            <div className="bg-red-50 p-2.5 rounded-full text-[#FF3B30] animate-pulse">
              <Heart className="w-8 h-8 fill-[#FF3B30] text-[#FF3B30]" />
            </div>
          </div>
          <p className="text-xs font-bold text-[#3182f6] uppercase tracking-wider">안전하고 편안한 하루 • 기억ON</p>
          <p className="text-xl font-black text-[#191F28] leading-none">{currentTime || "6월 7일 일요일"}</p>
          <div className="bg-[#FAFAFB] py-2 px-3 rounded-xl border border-slate-100 text-xs font-bold text-slate-600">
            {patientInfo.name}님 대시보드 | 전원을 켠채 주머니에 넣어주세요.
          </div>
        </div>

        {/* ========================================================= */}
        {/* VIEW 1: PATIENT MAIN HOME */}
        {/* ========================================================= */}
        {activeFrame === "HOME" && (
          <div className="space-y-5">
            
            {/* The giant triple rescue button matrix - high impact, 44px+ touch targets */}
            <div className="space-y-4">
              
              {/* Button A: Go Home Safe Navigation */}
              <button
                onClick={() => {
                  setActiveFrame("MAP_GUIDE");
                  speakHomeInstructions();
                }}
                className="w-full h-24 bg-[#3182f6] hover:bg-[#1b64da] active:scale-95 text-white rounded-3xl shadow-sm flex items-center px-6 gap-5 transition duration-200 text-left cursor-pointer"
              >
                <div className="p-3 bg-white/15 rounded-2xl">
                  <Home className="w-10 h-10 text-white fill-white/10" />
                </div>
                <div className="flex-1">
                  <span className="text-xl font-extrabold tracking-tight block">집으로 가는 안전한 길 찾기</span>
                  <span className="text-xs text-blue-100 block mt-1">큰 글씨 지도와 음성 귀가 도움 받기</span>
                </div>
              </button>

              {/* Button B: Emergency Call Contacts */}
              <div className="bg-white rounded-3xl border border-slate-150 p-4 text-center space-y-3">
                <span className="text-xs font-extrabold text-[#3182f6] uppercase tracking-wider block">터치 한 번으로 지정 가족에게 빠른 전화</span>
                
                <div className="grid grid-cols-2 gap-3">
                  {familyContacts.length === 0 ? (
                    <div className="col-span-2 text-xs text-slate-400 py-3 font-semibold">등록된 가족 연락처가 아직 없습니다.</div>
                  ) : (
                    familyContacts.map((contact) => (
                      <button
                        key={contact.id}
                        onClick={() => setActiveCallContact(contact)}
                        className="p-4 bg-[#FAFAFB] hover:border-[#3182f6] active:scale-95 rounded-2xl flex flex-col items-center justify-center space-y-1.5 transition text-center cursor-pointer border border-transparent"
                      >
                        <div className="w-11 h-11 bg-blue-50 text-[#3182f6] rounded-full flex items-center justify-center shadow-xs">
                          <User className="w-5 h-5" />
                        </div>
                        <span className="text-md font-extrabold text-[#191F28]">{contact.name}</span>
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-150 px-2.5 py-0.5 rounded-full">{contact.relationship}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Button C: High alert direct rescue SOS button */}
              <button
                onClick={() => {
                  setActiveFrame("SOS_ACTIVE");
                  speakText("비상 구조 신호를 가족과 연락망에 즉시 발송하였습니다. 당황하지 마시고 안전한 주변 상점이나 벤치에 제자리에 편안히 쉬시며 기다려 주십시오.");
                }}
                className="w-full h-24 bg-[#FF3B30] hover:bg-red-600 active:scale-95 text-white rounded-3xl shadow-[0_10px_20px_rgba(255,59,48,0.15)] flex items-center px-6 gap-5 transition duration-200 text-left animate-pulse cursor-pointer"
              >
                <div className="p-3 bg-white/20 rounded-2xl">
                  <AlertTriangle className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1">
                  <span className="text-xl font-extrabold tracking-tight block">길을 잃었어요! (도움 요청하기)</span>
                  <span className="text-xs text-red-100 block mt-1">터치 즉시 보호자 및 비상망에 위치 전송</span>
                </div>
              </button>

            </div>

            {/* AI Dementia Memory Cards slideshow training loop */}
            <div className="bg-white rounded-3xl border border-slate-150 p-5 shadow-xs space-y-4">
              <div className="flex justify-between items-center bg-[#FAFAFB] p-2.5 rounded-xl border border-slate-100">
                <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-[#3182f6]" /> 소중한 정서 기억 치료방
                </span>
                <span className="text-[11px] text-slate-400 font-bold">
                  {memoryCards.length > 0 ? `${activeSlide + 1} / ${memoryCards.length}장` : "0장"}
                </span>
              </div>

              {memoryCards.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400 font-bold">
                  보호자가 새로 생성해 준 정서 기억 교재가 아직 없습니다.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-2xl overflow-hidden shadow-xs border border-slate-200">
                    <img
                      src={memoryCards[activeSlide].imageUrl}
                      alt="Recall slide"
                      className="w-full h-44 object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                      <span className="text-[10px] font-bold text-blue-300 tracking-wider">주인공 성함 • {memoryCards[activeSlide].personName} ({memoryCards[activeSlide].relation})</span>
                      <h4 className="text-[15px] font-black">사랑하는 가족과의 깊은 연결</h4>
                    </div>
                  </div>

                  <p className="text-md font-bold text-slate-800 leading-relaxed text-center px-2">
                    "{memoryCards[activeSlide].speechText}"
                  </p>

                  {/* Narration voice assistant actions */}
                  <div className="flex items-center justify-between gap-3 pt-2">
                    <button
                      onClick={() => {
                        if (activeSlide > 0) setActiveSlide(prev => prev - 1);
                        else setActiveSlide(memoryCards.length - 1);
                        handleStopSpeech();
                      }}
                      className="px-4 py-2 bg-[#FAFAFB] hover:bg-slate-100 rounded-xl text-xs font-bold border border-slate-100 transition cursor-pointer"
                    >
                      이전 장
                    </button>

                    <div className="flex gap-2">
                      {isPlayingAudio ? (
                        <button
                          onClick={handleStopSpeech}
                          className="px-5 py-3 bg-red-50 hover:bg-red-100 text-[#FF3B30] rounded-2xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Pause className="w-4 h-4 fill-[#FF3B30]" /> 소리 끄기
                        </button>
                      ) : (
                        <button
                          onClick={() => speakText(memoryCards[activeSlide].speechText)}
                          className="px-5 py-3 bg-[#3182f6]/10 hover:bg-[#3182f6]/15 text-[#3182f6] rounded-2xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Volume2 className="w-4 h-4 text-[#3182f6]" /> 목소리로 듣기
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        if (activeSlide < memoryCards.length - 1) setActiveSlide(prev => prev + 1);
                        else setActiveSlide(0);
                        handleStopSpeech();
                      }}
                      className="px-4 py-2 bg-[#FAFAFB] hover:bg-slate-100 rounded-xl text-xs font-bold border border-slate-100 transition cursor-pointer"
                    >
                      다음 장
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: MAP NAV INSTRUCTIONS */}
        {/* ========================================================= */}
        {activeFrame === "MAP_GUIDE" && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  setActiveFrame("HOME");
                  handleStopSpeech();
                }}
                className="p-3 bg-white hover:bg-slate-100 border border-slate-200 rounded-2xl transition cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5 text-slate-700 stroke-[3.5]" />
              </button>
              <h2 className="text-xl font-black text-[#191F28] tracking-tight">집으로 돌아가는 길 안내</h2>
            </div>

            {/* Giant instruction notice */}
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl space-y-2">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-emerald-600 animate-spin" />
                <span className="text-sm font-extrabold text-emerald-800">안심 귀가 보이스 가이드가 켜져 있습니다</span>
              </div>
              <p className="text-xs font-semibold text-emerald-700 leading-normal">
                현재 계신 복지관 삼거리 정류소에서 143번 버스를 기다리시면 안전하게 자택 바로 앞 정거장까지 도착합니다. 마음 편안히 버스를 기다려 타주십시오.
              </p>
            </div>

            {/* Big Vector screen map */}
            <div className="w-full h-80 bg-slate-100 rounded-3xl relative overflow-hidden border border-slate-200 shadow-xs flex items-center justify-center">
              
              {/* Fake navigation streets */}
              <svg className="absolute inset-0 w-full h-full text-slate-200" xmlns="http://www.w3.org/2000/svg">
                <line x1="20%" y1="0" x2="20%" y2="100%" stroke="currentColor" strokeWidth="6" />
                <line x1="70%" y1="0" x2="70%" y2="100%" stroke="currentColor" strokeWidth="8" />
                <line x1="0" y1="40%" x2="100%" y2="40%" stroke="currentColor" strokeWidth="6" />
                <line x1="0" y1="80%" x2="100%" y2="80%" stroke="currentColor" strokeWidth="4" />
                
                {/* Simulated navigation target line */}
                <path d="M 120,290 L 120,130 L 250,130 Q 300,130 330,70" fill="none" stroke="#3182f6" strokeWidth="5" strokeDasharray="5" />
              </svg>

              {/* Home pointer icon */}
              <div className="absolute right-12 top-10 flex flex-col items-center">
                <div className="w-11 h-11 rounded-full bg-emerald-600 border-2 border-white text-white font-bold flex items-center justify-center shadow-md">
                  <Home className="w-5 h-5" />
                </div>
                <span className="text-[10px] bg-emerald-800 text-white font-extrabold px-2 py-0.5 rounded shadow-sm mt-1 whitespace-nowrap">우리 집</span>
              </div>

              {/* Patient pointer icon */}
              <div className="absolute left-10 bottom-12 flex flex-col items-center">
                <div className="relative flex items-center justify-center">
                  <span className="absolute inline-flex h-12 w-12 rounded-full bg-[#3182f6]/20 animate-ping" />
                  <div className="w-11 h-11 rounded-full bg-[#3182f6] border-2 border-white text-white font-bold flex items-center justify-center shadow-md">
                    <User className="w-5 h-5 text-white" />
                  </div>
                </div>
                <span className="text-[10px] bg-slate-800 text-white font-extrabold px-2 py-0.5 rounded shadow-sm mt-1 whitespace-nowrap">본인 (현재위치)</span>
              </div>

              {/* Friendly Landmark pointer */}
              <div className="absolute left-28 top-32 flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-2xl shadow-xs">
                <MapPin className="w-3.5 h-3.5 text-orange-500" />
                <span className="text-[9px] font-bold text-slate-500">종합 복지관 정문</span>
              </div>

            </div>

            {/* Speak helper trigger */}
            <div className="flex gap-2 pt-1">
              <button 
                onClick={speakHomeInstructions}
                className="w-full py-4 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-md font-extrabold rounded-2xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Volume2 className="w-5 h-5 text-white" /> 목소리로 길안내 다시 듣기
              </button>
            </div>

          </motion.div>
        )}

        {/* ========================================================= */}
        {/* VIEW 3: SOS DISTRESS ACTIVE PANEL */}
        {/* ========================================================= */}
        {activeFrame === "SOS_ACTIVE" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 text-center py-6">
            
            <div className="w-20 h-20 bg-red-100 text-[#FF3B30] rounded-full mx-auto flex items-center justify-center shadow-xs animate-bounce">
              <ShieldAlert className="w-12 h-12" />
            </div>

            <h2 className="text-2xl font-black text-[#FF3B30] tracking-tight">비상 안전 신호 오작동 확인 중</h2>
            <div className="p-5 bg-white border border-slate-200 rounded-3xl space-y-3.5 text-center shadow-xs">
              <p className="text-sm font-bold text-slate-800 leading-normal">
                "{patientInfo.name}님의 실시간 지피에스 좌표가 가장 가까운 보호자 아드님 대시보드 화면에 적색 경보와 함께 긴급 발송되었습니다."
              </p>
              <div className="p-3 bg-red-50 text-red-800 rounded-2xl border border-red-100 font-bold text-xs leading-normal">
                당황하지 마시고 제자리에 편안히 의자가 있는 곳에 앉아 계시면 보호자 아드님이 위치를 확인하고 즉각 전화를 거는 중입니다. 안심하고 대기하세요.
              </div>
            </div>

            <button
              onClick={() => {
                setActiveFrame("HOME");
                handleStopSpeech();
              }}
              className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-2xl shadow-sm transition text-xs cursor-pointer"
            >
              종료하고 대시보드 이동
            </button>

          </motion.div>
        )}

      </div>

      {/* ========================================================= */}
      {/* OUTGOING TELEPHONE CALL SCREEN SIMULATION MODAL */}
      {/* ========================================================= */}
      <AnimatePresence>
        {activeCallContact && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 180 }}
            className="absolute inset-0 bg-[#1C1C1E] text-white z-50 flex flex-col justify-between p-10 text-center select-none"
          >
            {/* Top area */}
            <div className="space-y-3.5 pt-12">
              <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase block mb-1">긴급 전화 연결</span>
              <div className="w-20 h-20 bg-slate-800 rounded-full mx-auto flex items-center justify-center text-white border border-slate-700 shadow-md">
                <PhoneCall className="w-10 h-10 text-[#34C759]" />
              </div>
              <h2 className="text-3xl font-black">{activeCallContact.name}</h2>
              <span className="text-slate-400 text-sm font-bold">{activeCallContact.relationship} • {activeCallContact.phone}</span>
              <p className="text-[#34C759] text-base font-black tracking-wider block pt-2">
                {callTimer === 0 ? "전화 연결 중..." : `통화 시간 • ${formatCallDuration(callTimer)}`}
              </p>
            </div>

            {/* Dial option circles */}
            <div className="grid grid-cols-3 gap-6 max-w-xs mx-auto">
              {[
                { label: "음소거", status: "MUTE" },
                { label: "키패드", status: "DIAL" },
                { label: "스피커폰", status: "SPEAKER" },
              ].map((btn, idx) => (
                <div key={idx} className="flex flex-col items-center space-y-1.5 cursor-pointer hover:opacity-80">
                  <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center border border-white/5 font-extrabold text-sm">
                    {btn.status === "SPEAKER" ? <Volume2 className="w-5 h-5 text-white" /> : btn.status === "MUTE" ? <X className="w-5 h-5 text-white" /> : <Home className="w-5 h-5 text-white" />}
                  </div>
                  <span className="text-[11px] font-bold text-slate-400">{btn.label}</span>
                </div>
              ))}
            </div>

            {/* Red End decline trigger btn */}
            <div className="pb-10">
              <button
                onClick={() => {
                  setActiveCallContact(null);
                  handleStopSpeech();
                }}
                className="w-16 h-16 bg-[#FF3B30] hover:brightness-110 active:scale-95 text-white rounded-full mx-auto flex items-center justify-center shadow-lg transition cursor-pointer border-0"
              >
                <X className="w-8 h-8 stroke-[3]" />
              </button>
              <span className="text-xs text-slate-400 block mt-2 font-bold">통화 종료</span>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
