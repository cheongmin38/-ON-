/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Heart, Phone, Home, AlertTriangle, Play, Pause,
  Volume2, ShieldAlert, ArrowLeft, X, PhoneCall,
  UserCheck, Compass, HelpCircle, MapPin
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
      setCurrentTime(date.toLocaleDateString("ko-KR", options));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
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
      utterance.rate = 0.85; // slightly slower for elderly
      utterance.onend = () => setIsPlayingAudio(false);
      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlayingAudio(true);
      alert(`🔊 [나레이션 가이드 재생]\n"${text}"`);
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
    <div className="flex-1 flex flex-col justify-between h-full bg-[#FCF8F2] relative overflow-hidden text-slate-800" id="patient-root">
      
      {/* Scrollable Patient Canvas */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 custom-scrollbar pb-24">
        
        {/* Dynamic header panel optimized for high visibility */}
        <div className="bg-[#FFFDF9] rounded-3xl p-5 border-2 border-[#EADAC2] shadow-sm text-center space-y-2">
          {/* Heart icon */}
          <div className="flex justify-center">
            <div className="bg-[#FFEFEF] p-2.5 rounded-full text-[#FF3B30] animate-pulse">
              <Heart className="w-8 h-8 fill-[#FF3B30]" />
            </div>
          </div>
          <p className="text-sm font-extrabold text-[#8F5A3C] tracking-wide">언제나 안전한 하루 기억ON</p>
          <p className="text-2xl font-black text-slate-900 leading-none">{currentTime || "6월 6일 토요일"}</p>
          <div className="bg-[#FFF5E6] py-2 px-3 rounded-xl border border-[#FAD8A8] text-xs font-bold text-[#A05C12]">
            👵 {patientInfo.name}님 환영합니다•주머니에 꼭 넣어 다녀 주세요.
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
                className="w-full h-24 bg-gradient-to-r from-[#34C759] to-[#28A745] hover:brightness-105 active:scale-95 text-white rounded-3xl shadow-[0_8px_20px_rgba(40,167,69,0.15)] border-2 border-white/20 flex items-center px-6 gap-5 transition duration-200 text-left cursor-pointer"
              >
                <div className="p-3.5 bg-white/20 rounded-2xl">
                  <Home className="w-10 h-10 text-white fill-white/20" />
                </div>
                <div className="flex-1">
                  <span className="text-xl font-black tracking-tight block">🏠 집으로 가는 안전한 길 찾기</span>
                  <span className="text-[11px] text-white/80 font-bold block mt-1">큰 글씨 지도와 음성 귀가 도움</span>
                </div>
              </button>

              {/* Button B: Emergency Call Contacts */}
              <div className="bg-white rounded-3xl border-2 border-[#E8DFD3] p-4 text-center space-y-3">
                <span className="text-sm font-extrabold text-[#876543] uppercase tracking-wide block">📞 터치 한 번으로 아들/딸에게 바로 전화</span>
                
                <div className="grid grid-cols-2 gap-3">
                  {familyContacts.length === 0 ? (
                    <div className="col-span-2 text-xs text-slate-400 py-3 font-semibold">등록된 가족 연락처가 아직 없습니다.</div>
                  ) : (
                    familyContacts.map((contact) => (
                      <button
                        key={contact.id}
                        onClick={() => setActiveCallContact(contact)}
                        className="p-4 bg-[#FFFDFC] border-2 border-[#F1E5D5] hover:border-[#FF9500] active:scale-95 rounded-2xl flex flex-col items-center justify-center space-y-1.5 transition text-center cursor-pointer"
                      >
                        <div className="w-12 h-12 bg-[#FFF3E0] text-[#FF9500] rounded-full font-black text-lg flex items-center justify-center shadow-xs border border-[#FFE0B2]">
                          🧑
                        </div>
                        <span className="text-[15px] font-black text-slate-800">{contact.name}</span>
                        <span className="text-[11px] font-extrabold text-[#B38F69] bg-[#FAF3EA] px-2 py-0.5 rounded-full">{contact.relationship}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Button C: High alert direct rescue SOS button */}
              <button
                onClick={() => {
                  setActiveFrame("SOS_ACTIVE");
                  // Simulate SOS distress trigger
                  speakText("비상 구조 신호를 가족과 경찰 일일 구 구조대에 즉시 전송하였습니다. 제자리에 편안히 쉬시며 기다려 주십시오.");
                }}
                className="w-full h-24 bg-gradient-to-r from-[#FF3B30] to-[#E02424] hover:brightness-110 active:scale-95 text-white rounded-3xl shadow-[0_10px_25px_rgba(255,59,48,0.22)] border-4 border-[#FFCDD2] flex items-center px-6 gap-5 transition duration-200 text-left animate-pulse cursor-pointer"
              >
                <div className="p-3.5 bg-white/25 rounded-2xl">
                  <AlertTriangle className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1">
                  <span className="text-2xl font-black tracking-tighter block">🚨 길을 잃었어요! (도와주세요)</span>
                  <span className="text-[11px] text-white/80 font-bold block mt-1">터치 즉시 보호자 및 119 정밀 GPS 전송</span>
                </div>
              </button>

            </div>

            {/* AI Dementia Memory Cards slideshow training loop */}
            <div className="bg-white rounded-3xl border-2 border-[#E2D5C3] p-5 shadow-xs space-y-4">
              <div className="flex justify-between items-center bg-[#FCF8F2] p-2.5 rounded-xl border border-[#EEE1D0]">
                <span className="text-xs font-black text-[#876543] flex items-center gap-1">
                  <Compass className="w-4 h-4 text-[#FF9500]" /> 소중한 정서 추억 보관실
                </span>
                <span className="text-[11px] text-slate-400 font-bold">
                  {memoryCards.length > 0 ? `${activeSlide + 1} / ${memoryCards.length}장` : "0장"}
                </span>
              </div>

              {memoryCards.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400 font-black">
                  보호자가 새로 생성해 준 '정서 추억치료 카드'가 아직 없습니다.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-2xl overflow-hidden shadow-md border border-slate-200">
                    <img
                      src={memoryCards[activeSlide].imageUrl}
                      alt="Recall slide"
                      className="w-full h-44 object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                      <span className="text-[10px] font-bold text-blue-300 tracking-wider">주인공 대표 인물 • {memoryCards[activeSlide].personName}</span>
                      <h4 className="text-[16px] font-black">{memoryCards[activeSlide].relation}과의 따끈한 이야기</h4>
                    </div>
                  </div>

                  <p className="text-md font-black text-slate-800 leading-relaxed text-center px-2">
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
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      이전 장
                    </button>

                    <div className="flex gap-2">
                      {isPlayingAudio ? (
                        <button
                          onClick={handleStopSpeech}
                          className="px-5 py-3 bg-red-100 hover:bg-red-200 text-red-700/90 rounded-2xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Pause className="w-4 h-4 fill-red-700" /> 소리 끄기
                        </button>
                      ) : (
                        <button
                          onClick={() => speakText(memoryCards[activeSlide].speechText)}
                          className="px-5 py-3 bg-[#FFF3E0] hover:bg-[#FFE0B2] text-[#FF9500] rounded-2xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-xs border border-[#FFF0E0]"
                        >
                          <Volume2 className="w-4 h-4 text-[#FF9500] fill-white" /> AI 목소리로 듣기
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        if (activeSlide < memoryCards.length - 1) setActiveSlide(prev => prev + 1);
                        else setActiveSlide(0);
                        handleStopSpeech();
                      }}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold transition cursor-pointer"
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
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-5">
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  setActiveFrame("HOME");
                  handleStopSpeech();
                }}
                className="p-3 bg-slate-200 hover:bg-slate-350 rounded-2xl transition cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5 text-slate-700 stroke-[3.5]" />
              </button>
              <h2 className="text-xl font-black text-slate-800">집으로 안전하게 돌아가기 🏠</h2>
            </div>

            {/* Giant instruction notice */}
            <div className="p-4 bg-emerald-50 border-2 border-emerald-200 rounded-3xl space-y-2">
              <div className="flex items-center gap-2">
                <Compass className="w-6 h-6 text-[#34C759] animate-spin" />
                <span className="text-base font-extrabold text-emerald-800">안심 귀가 보이스 길안내 가동 중</span>
              </div>
              <p className="text-sm font-bold text-emerald-700 leading-normal whitespace-pre-line">
                "어머님, 걱정 마세요. 현재 143번 버스를 기다려 타시는 정거장 위치가 지도에 보이고 있어요. 안심하시고 버스에 올라타시면 자택 앞 정거장에서 내리실 수 있습니다."
              </p>
            </div>

            {/* Big Vector screen map */}
            <div className="w-full h-80 bg-[#E5F1E8] rounded-3xl relative overflow-hidden border-4 border-white shadow-md flex items-center justify-center">
              
              {/* Fake navigation streets */}
              <svg className="absolute inset-0 w-full h-full text-emerald-900/10" xmlns="http://www.w3.org/2000/svg">
                <line x1="20%" y1="0" x2="20%" y2="100%" stroke="currentColor" strokeWidth="6" />
                <line x1="70%" y1="0" x2="70%" y2="100%" stroke="currentColor" strokeWidth="8" />
                <line x1="0" y1="40%" x2="100%" y2="40%" stroke="currentColor" strokeWidth="6" />
                <line x1="0" y1="80%" x2="100%" y2="80%" stroke="currentColor" strokeWidth="4" />
                
                {/* Simulated navigation target line */}
                <path d="M 120,290 L 120,130 L 250,130 Q 300,130 330,70" fill="none" stroke="#007AFF" strokeWidth="6" strokeDasharray="6" />
              </svg>

              {/* Home pointer icon */}
              <div className="absolute right-12 top-10 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-[#34C759] border-4 border-white text-white font-bold flex items-center justify-center text-xl shadow-lg">
                  🏠
                </div>
                <span className="text-xs bg-emerald-800 text-white font-extrabold px-2 py-0.5 rounded shadow mt-1 whitespace-nowrap">우리 집</span>
              </div>

              {/* Patient pointer icon */}
              <div className="absolute left-10 bottom-12 flex flex-col items-center">
                <div className="relative flex items-center justify-center">
                  <span className="absolute inline-flex h-14 w-14 rounded-full bg-[#007AFF]/25 animate-ping" />
                  <div className="w-12 h-12 rounded-full bg-[#007AFF] border-4 border-white text-white font-bold flex items-center justify-center text-xl shadow-lg">
                    👵
                  </div>
                </div>
                <span className="text-xs bg-blue-900 text-white font-extrabold px-2 py-0.5 rounded shadow mt-1 whitespace-nowrap">{patientInfo.name}님 (현재위치)</span>
              </div>

              {/* Friendly Landmark pointer */}
              <div className="absolute left-28 top-32 flex items-center gap-1.5 bg-white border border-slate-300 px-3 py-1.5 rounded-2xl shadow-xs">
                <MapPin className="w-4 h-4 text-orange-500" />
                <span className="text-[10px] font-bold text-slate-600">반포 종합사회복지관 정문</span>
              </div>

            </div>

            {/* Speak helper trigger */}
            <div className="flex gap-2">
              <button 
                onClick={speakHomeInstructions}
                className="flex-1 py-4 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-base font-black rounded-3xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Volume2 className="w-6 h-6 text-white" /> 목소리로 길안내 다시 들려줘 🔊
              </button>
            </div>

          </motion.div>
        )}

        {/* ========================================================= */}
        {/* VIEW 3: SOS DISTRESS ACTIVE PANEL */}
        {/* ========================================================= */}
        {activeFrame === "SOS_ACTIVE" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 text-center py-6">
            
            <div className="w-24 h-24 bg-red-100 text-[#FF3B30] rounded-full mx-auto flex items-center justify-center shadow-md animate-bounce">
              <ShieldAlert className="w-14 h-14" />
            </div>

            <h2 className="text-3xl font-black text-red-650 tracking-tighter">비상 안전 신호 가동</h2>
            <div className="p-5 bg-white border-2 border-red-200 rounded-3xl space-y-3.5 text-center shadow-xs">
              <p className="text-lg font-bold text-slate-800 leading-normal">
                "{patientInfo.name}(어머님)의 위치 정보를 아들 '김태진' 보호자에게 정밀 수집 전송하였습니다."
              </p>
              <div className="p-3 bg-red-50 text-red-800 rounded-2xl border border-red-100 font-bold text-xs leading-normal">
                🚨 보호자가 위치를 검수하고 어머님 전화를 통해 즉시 연락 중이오니, 당황하지 마시고 안전한 주변 상점이나 벤치에 앉아 편안히 대기해 주십시오!
              </div>
            </div>

            <button
              onClick={() => {
                setActiveFrame("HOME");
                handleStopSpeech();
              }}
              className="px-8 py-3.5 bg-slate-800 hover:bg-slate-900 text-white font-extrabold rounded-2xl shadow-md transition text-sm cursor-pointer"
            >
              상황 종료 (홈 화면으로 복귀)
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
              <span className="text-[11px] font-bold text-slate-400 tracking-widest uppercase block animate-pulse">기기 자체 안심 직발선 다이얼</span>
              <div className="w-24 h-24 bg-slate-800 rounded-full mx-auto flex items-center justify-center text-white border border-slate-700 shadow-md">
                <PhoneCall className="w-10 h-10 text-[#34C759]" />
              </div>
              <h2 className="text-3xl font-black">{activeCallContact.name}</h2>
              <span className="text-slate-400 text-base font-extrabold">{activeCallContact.relationship} • {activeCallContact.phone}</span>
              <p className="text-[#34C759] text-base font-black tracking-wider block pt-2">
                {callTimer === 0 ? "전화 거는 중..." : `연결됨 • ${formatCallDuration(callTimer)}`}
              </p>
            </div>

            {/* Dial option circles */}
            <div className="grid grid-cols-3 gap-6 max-w-xs mx-auto">
              {[
                { label: "음소거", status: "MUTE" },
                { label: "키패드", status: "DIAL" },
                { label: "스피커폰", status: "SPEAKER" },
                { label: "화상통화", status: "FACETIME" },
                { label: "사용자 추가", status: "ADD" },
                { label: "연락처", status: "CONTACTS" }
              ].map((btn, idx) => (
                <div key={idx} className="flex flex-col items-center space-y-1.5 cursor-pointer hover:opacity-80">
                  <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center border border-white/5 font-extrabold text-sm">
                    {btn.status === "SPEAKER" ? "🔊" : btn.status === "MUTE" ? "🎙️" : "⚙️"}
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
                className="w-18 h-18 bg-[#FF3B30] hover:brightness-110 active:scale-95 text-white rounded-full mx-auto flex items-center justify-center shadow-lg transition cursor-pointer border-2 border-red-300/20"
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
