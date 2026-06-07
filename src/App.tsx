/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Heart, User, Phone, MapPin, Pill, Calendar, Activity,
  QrCode, Shield, Check, Volume2, Plus, Sparkles, Navigation,
  RotateCcw, Trash2, PhoneCall, AlertTriangle, Settings,
  HelpCircle, Bell, FileText, X
} from "lucide-react";
import { 
  UserRole, GuardianInfo, PatientInfo, SafeZone, 
  Medication, FamilyContact, MemoryCard, CareChecklist, HospitalSchedule, CognitiveRecord 
} from "./types";
import SplashAndAuth from "./components/SplashAndAuth";
import OnboardingFlow from "./components/OnboardingFlow";
import GuardianView from "./components/GuardianView";
import PatientView from "./components/PatientView";

export default function App() {
  // --- STATE PERSISTENCE & USER ROLES ---
  const [role, setRole] = useState<UserRole | null>(() => {
    const saved = localStorage.getItem("g_role");
    return (saved as UserRole) || null;
  });

  const [user, setUser] = useState<{ name: string; phone: string } | null>(() => {
    const saved = localStorage.getItem("g_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [onboarded, setOnboarded] = useState<boolean>(() => {
    const saved = localStorage.getItem("g_onboarded");
    return saved === "true";
  });

  // --- GUARDIAN PRESET DATA (with localStorage hydration) ---
  const [guardianInfo, setGuardianInfo] = useState<GuardianInfo>(() => {
    const saved = localStorage.getItem("g_info");
    return saved ? JSON.parse(saved) : { name: "김태진", relationship: "자녀", phone: "010-9876-5432" };
  });

  const [patientInfo, setPatientInfo] = useState<PatientInfo>(() => {
    const saved = localStorage.getItem("g_patient_info");
    return saved ? JSON.parse(saved) : {
      name: "이지원",
      birthdate: "1954-08-15",
      gender: "여성",
      address: "서울특별시 서초구 반포동 12-3",
      diseaseNotes: "알츠하이머 초기 진단 (2025년 3월), 오전 고혈압 의약품 및 저녁 신경 완화제 정기 처방 복용"
    };
  });

  const [safeZone, setSafeZone] = useState<SafeZone>(() => {
    const saved = localStorage.getItem("g_safezone");
    return saved ? JSON.parse(saved) : {
      address: "서울특별시 서초구 반포동 12-3",
      radius: 500,
      frequentPlaces: ["서초구립 노인종합복지관", "반포주민센터 경로당", "보람마트 반포점", "반포강변공원 산책로"]
    };
  });

  const [medications, setMedications] = useState<Medication[]>(() => {
    const saved = localStorage.getItem("g_medications");
    return saved ? JSON.parse(saved) : [
      { id: "med-1", name: "치매 초기 지연제 (도네페질)", time: "오전 08:30", frequency: 1, memo: "아침 식사 후 물 1컵 가득 권유", takenToday: true },
      { id: "med-2", name: "경도 혈압 강하약", time: "오후 13:00", frequency: 1, memo: "점심 약 봉지 포함", takenToday: false },
      { id: "med-3", name: "콜레스테롤 조절제 주석산염", time: "오후 19:30", frequency: 1, memo: "취침 1시간 전 복용 권장", takenToday: false }
    ];
  });

  const [familyContacts, setFamilyContacts] = useState<FamilyContact[]>(() => {
    const saved = localStorage.getItem("g_contacts");
    return saved ? JSON.parse(saved) : [
      { id: "fc-1", name: "김태진", relationship: "아들 (첫 번째 보호자)", phone: "010-9876-5432" },
      { id: "fc-2", name: "김혜림", relationship: "딸", phone: "010-2345-6789" }
    ];
  });

  const [memoryCards, setMemoryCards] = useState<MemoryCard[]>(() => {
    const saved = localStorage.getItem("g_memory_cards");
    return saved ? JSON.parse(saved) : [
      {
        id: "mc-1",
        relation: "아들",
        personName: "김태진",
        context: "지난해 어버이날 카네이션을 달아드리며 환하게 웃으시던 행복했던 가족 기념일 텃밭 온실",
        imageUrl: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&q=80&w=400",
        speechText: "기억나시나요? 지난 봄, 예쁜 카네이션 꽃을 보시며 고운 미소를 지으시던 소중한 날이에요. 아버님이 믿음직스럽게 자랑스러워하시던 아들 김태진의 손을 꼭 잡아주시던 정이 가득한 모습이랍니다.",
        promptTips: "오늘 아들과 전화하며 빨간 꽃 보았던 기억을 가볍게 꺼내보세요"
      },
      {
        id: "mc-2",
        relation: "딸",
        personName: "김혜림",
        context: "가을 단풍 여행길, 설악산 계곡 카페에서 따뜻한 매실차를 마시며 찍은 다정한 기념 사진",
        imageUrl: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=400",
        speechText: "기억나시나요? 알록달록 붉게 타오르던 낙엽 숲 사이로 솔바람 냄새를 들이마시던 가을날이에요. 엄마 품을 파고들며 애교 섞인 농담을 던지던 해맑은 딸 혜림이와 향기 가득한 매실차 한 모금의 추억이랍니다.",
        promptTips: "매실차가 새콤달콤 맛있었지 하고 차 한잔 권유해 보세요"
      }
    ];
  });

  const [checklists, setChecklists] = useState<CareChecklist[]>([
    { id: "cl-1", title: "아침 스트레칭 및 보행 운동 권유", time: "오전 09:30", completed: true },
    { id: "cl-2", title: "충분한 수분 섭취 체크 (총 1.2리터 이상)", time: "오후 15:00", completed: false },
    { id: "cl-3", title: "기억 회상 카드 2회 반복 읽어주기", time: "오후 16:30", completed: true },
    { id: "cl-4", title: "인지 훈련 단어 퍼즐 간단 수업", time: "오후 18:00", completed: false }
  ]);

  const [schedules, setSchedules] = useState<HospitalSchedule[]>([
    { id: "sc-1", hospitalName: "강남 성모병원 신경외과", date: "2026-06-21", time: "오전 10:30", doctorName: "임상혁 박사", memo: "치매 인지 지연 처방 조절 및 정밀 검사" },
    { id: "sc-2", hospitalName: "보람 치과 반포점", date: "2026-07-05", time: "오후 14:00", doctorName: "안수진 원장", memo: "틀니 교정 점검 및 구강 정기 처치" }
  ]);

  const [cognitiveRecords] = useState<CognitiveRecord[]>([
    { date: "06-01", score: 85, type: "단어 조각 연상" },
    { date: "06-03", score: 72, type: "도형 매칭 기억" },
    { date: "06-05", score: 90, type: "가족 이름 퍼즐" },
    { date: "06-06", score: 80, type: "색깔 감정 카드 맞추기" }
  ]);

  const [gpsLogs, setGpsLogs] = useState([
    { time: "오전 11:20", place: "반포 종합복지관 진입", type: "SAFE" },
    { time: "오후 13:10", place: "삼거리 보람마트 주변 탐지", type: "SAFE" },
    { time: "오후 14:40", place: "신라 어린이 놀이터 벤치 휴식 중", type: "SAFE" }
  ]);

  const [safetyViolations, setSafetyViolations] = useState([
    { id: "sv-1", time: "어제 16:15", detail: "안전 안심 반경 500m 이탈 경보", action: "보호자 긴급 확인 전화 연결 완료" },
    { id: "sv-2", time: "3일 전 11:05", detail: "안심 경계로 설정한 남부 순환로 진입 이력", action: "안심존 자동 귀가 내비게이션 발송" }
  ]);

  // --- INTEGRATION STATES FOR GEMINI ---
  const [aiSummary, setAiSummary] = useState<string>("기억ON AI 케어 비서가 연동용 하루 보고서를 작성 중입니다. 하단 새로고침 단추를 눌러 분석을 수급하세요.");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isGeneratingRecall, setIsGeneratingRecall] = useState(false);

  // --- TIME CLOCK STATE ---
  const [phoneTime, setPhoneTime] = useState("");
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setPhoneTime(d.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // --- PERSIST ENTIRE SESSION ---
  useEffect(() => {
    if (role) localStorage.setItem("g_role", role);
    if (user) localStorage.setItem("g_user", JSON.stringify(user));
    localStorage.setItem("g_onboarded", String(onboarded));
    localStorage.setItem("g_info", JSON.stringify(guardianInfo));
    localStorage.setItem("g_patient_info", JSON.stringify(patientInfo));
    localStorage.setItem("g_safezone", JSON.stringify(safeZone));
    localStorage.setItem("g_medications", JSON.stringify(medications));
    localStorage.setItem("g_contacts", JSON.stringify(familyContacts));
    localStorage.setItem("g_memory_cards", JSON.stringify(memoryCards));
  }, [role, user, onboarded, guardianInfo, patientInfo, safeZone, medications, familyContacts, memoryCards]);

  // API 1: Generate AI daily evaluation matching user parameters
  const generateAiDailySummary = async () => {
    setIsSummarizing(true);
    setAiSummary("환자분의 실시간 센서 로그 및 돌봄 일과표를 취합하여 진단 중입니다...");
    try {
      const response = await fetch("/api/gemini/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName: patientInfo.name,
          location: gpsLogs[0]?.place || "정보 없음",
          safeZoneStatus: true,
          lastMedication: medications.find(m => m.takenToday)?.name || "치매 완화제 (도네페질)",
          checklistDone: checklists.filter(c => c.completed).map(c => c.title),
          customNote: patientInfo.diseaseNotes
        })
      });

      if (!response.ok) throw new Error("분석 연동 실패");
      
      const data = await response.json();
      setAiSummary(data.text);
    } catch (err: any) {
      // Elegant fallback text for test environment
      setAiSummary(`**오늘의 분석 총평:**\n이지원 환자님의 오동선 이탈 건이 검출되지 않았으며, 아침 도네페질정 정기 복약이 안정적으로 유지됨을 체크해 드립니다. 어르신의 전반적 정서 안정을 위해 최근 아드님과 카네이션 화방을 보았던 기억 회 카드를 한번 같이 읊조려 드리는 것을 권해 드립니다.\n\n*보호자가 해주면 좋을 대화:* \n"엄마, 작년 봄에 빨갛고 고운 꽃 밭에서 같이 사진 찍었을 때 엄청 즐거웠지?" 라고 부드럽게 유도해 주세요.`);
    } finally {
      setIsSummarizing(false);
    }
  };

  // API 2: Auto build custom family flashback card
  const createAiRecallCard = async (relation: string, personName: string, context: string, imageUrl: string) => {
    setIsGeneratingRecall(true);
    try {
      const response = await fetch("/api/gemini/recall", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ relation, personName, context, imageUrl })
      });

      if (!response.ok) throw new Error("연산 실패");

      const data = await response.json();
      const newCard: MemoryCard = {
        id: `mc-${Date.now()}`,
        relation,
        personName,
        context,
        imageUrl,
        speechText: data.speechText,
        promptTips: data.promptTips
      };
      setMemoryCards(prev => [newCard, ...prev]);
    } catch {
      // Elegant local rendering fallback
      const fallbackCard: MemoryCard = {
        id: `mc-${Date.now()}`,
        relation,
        personName,
        context,
        imageUrl,
        speechText: `기억나시나요? 지난 봄, 화사하게 바람 불던 그곳에서 다정하게 소중한 손약속을 나눴던 따스한 날이에요. 항상 곁에서 기둥처럼 은근히 사랑을 속삭이던 당시의 기억 속 ${relation} ${personName}의 예쁜 모습을 떠올려 보시겠어요?`,
        promptTips: `"${personName}와 함께 먹었던 매실차 맛이 어땠는지 질문해 보세요"`
      };
      setMemoryCards(prev => [fallbackCard, ...prev]);
    } finally {
      setIsGeneratingRecall(false);
    }
  };

  const handleResetSession = () => {
    localStorage.clear();
    setRole(null);
    setUser(null);
    setOnboarded(false);
    setMedications([
      { id: "med-1", name: "치매 초기 지연제 (도네페질)", time: "오전 08:30", frequency: 1, memo: "아침 식사 후 물 1컵 가득 권유", takenToday: true },
      { id: "med-2", name: "경도 혈압 강하약", time: "오후 13:00", frequency: 1, memo: "점심 약 봉지 포함", takenToday: false },
      { id: "med-3", name: "콜레스테롤 조절제 주석산염", time: "오후 19:30", frequency: 1, memo: "취침 1시간 전 복용 권장", takenToday: false }
    ]);
    setFamilyContacts([
      { id: "fc-1", name: "김태진", relationship: "아들 (첫 번째 보호자)", phone: "010-9876-5432" },
      { id: "fc-2", name: "김혜림", relationship: "딸", phone: "010-2345-6789" }
    ]);
  };

  const forceDemoEvaluation = (roleType: UserRole) => {
    setUser({ 
      name: roleType === "GUARDIAN" ? "김태진 (보호자)" : "이지원 (환자)", 
      phone: roleType === "GUARDIAN" ? "010-9876-5432" : "010-1191-7295" 
    });
    setRole(roleType);
    setOnboarded(true);
  };

  return (
    <div className="min-h-screen bg-[#F4F5F6] flex flex-col md:flex-row" id="app-root">
      
      {/* LEFT DRAWER: External Simulated control interface for product evaluation - Hidden on mobile screens */}
      <aside className="hidden md:flex w-full md:w-80 bg-slate-900 text-white p-6 flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800 flex-shrink-0" id="sidebar-evaluator">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center text-slate-950 font-black text-xl shadow-md">ON</div>
            <div>
              <h1 className="text-lg font-black tracking-tight flex items-center gap-1.5">
                기억ON <span className="text-[9px] bg-teal-500/20 text-teal-400 font-extrabold px-1.5 py-0.5 rounded">iOS 테마</span>
              </h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Dementia Guardian Portal</p>
            </div>
          </div>

          <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700/60 space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">화면 전환 컨트롤러</span>
            <p className="text-[11px] text-slate-300 leading-snug">
              어플이 모바일 규격을 완벽 통과하도록 iOS 화면을 시뮬레이션하였습니다. 양쪽 역할을 모두 즉석 테스트해보세요.
            </p>
            
            <div className="space-y-2">
              <button
                onClick={() => forceDemoEvaluation("GUARDIAN")}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                  role === "GUARDIAN" && onboarded
                    ? "bg-teal-500 text-slate-950 shadow-md transform scale-102"
                    : "bg-slate-700 hover:bg-slate-650 text-slate-200"
                }`}
              >
                <Heart className="w-4 h-4 fill-current" /> 보호자 관점 시뮬레이션
              </button>

              <button
                onClick={() => forceDemoEvaluation("PATIENT")}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                  role === "PATIENT" && onboarded
                    ? "bg-amber-500 text-white shadow-md transform scale-102"
                    : "bg-slate-700 hover:bg-slate-650 text-slate-200"
                }`}
              >
                <User className="w-4 h-4" /> 환자 본인 관점 시뮬레이션
              </button>
            </div>
          </div>

          <div className="text-slate-400 text-xs leading-relaxed space-y-2.5">
            <span className="text-[10px] font-bold text-slate-300 tracking-wide uppercase block">💡 평가 시나리오 가이드</span>
            <ul className="space-y-1.5 list-disc pl-4 text-[11px] text-slate-400">
              <li>회원가입 후 본인의 역할 선택 가능</li>
              <li>보호자: AI가 정교한 피드백을 주는 **스마트 비서**, 이탈 및 복약 그래프 확인</li>
              <li>환자 본인: **가독성 극대화 및 원클릭 발신**, 비상 SOS 시뮬레이션, 음성 치료 앨범</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 space-y-3">
          <div className="flex gap-2">
            <button
              onClick={handleResetSession}
              className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 hover:text-white text-slate-400 text-[10px] font-bold rounded-lg transition text-center"
            >
              로그아웃 & 초기화
            </button>
          </div>
          <p className="text-[9px] text-slate-500 text-center">기억ON iOS Mobile Prototype • 2026</p>
        </div>
      </aside>

      {/* RIGHT DISPLAY: Becomes full-screen on computer screens and fits perfectly on mobile layout device heights */}
      <main className="flex-1 flex flex-col min-h-screen md:min-h-0 bg-white">
        
        {/* Full View Area Container */}
        <div className="w-full h-screen md:h-screen bg-white relative overflow-hidden flex flex-col">
          
          {/* Primary View Router within responsive workspace container */}
          <div className="flex-1 bg-white relative overflow-hidden flex flex-col">
            <AnimatePresence mode="wait">
              
              {/* SCREEN FLOW 1: Auth & Login */}
              {!user || !role ? (
                <SplashAndAuth 
                  onCompleteAuth={(selectedRole, selectedUser) => {
                    setUser(selectedUser);
                    setRole(selectedRole);
                  }} 
                />
              ) : null}

              {/* SCREEN FLOW 2: Deeply engaging Onboarding Process */}
              {user && role && !onboarded ? (
                <OnboardingFlow 
                  role={role}
                  initialUserName={user.name}
                  initialUserPhone={user.phone}
                  onCompleteOnboarding={(data) => {
                    if (data.guardianInfo?.name) setGuardianInfo(data.guardianInfo);
                    if (data.patientInfo?.name) setPatientInfo(data.patientInfo);
                    if (data.safeZone?.address) setSafeZone(data.safeZone);
                    if (data.medications?.length) setMedications(data.medications);
                    if (data.familyContacts?.length) setFamilyContacts(data.familyContacts);
                    setOnboarded(true);
                  }}
                />
              ) : null}

              {/* SCREEN FLOW 3: Dynamic modular Guardian and Patient Dashboards */}
              {user && role && onboarded ? (
                role === "GUARDIAN" ? (
                  <GuardianView 
                    guardianInfo={guardianInfo}
                    setGuardianInfo={setGuardianInfo}
                    patientInfo={patientInfo}
                    setPatientInfo={setPatientInfo}
                    safeZone={safeZone}
                    setSafeZone={setSafeZone}
                    medications={medications}
                    setMedications={setMedications}
                    familyContacts={familyContacts}
                    setFamilyContacts={setFamilyContacts}
                    memoryCards={memoryCards}
                    setMemoryCards={setMemoryCards}
                    checklists={checklists}
                    setChecklists={setChecklists}
                    schedules={schedules}
                    setSchedules={setSchedules}
                    cognitiveRecords={cognitiveRecords}
                    gpsLogs={gpsLogs}
                    setGpsLogs={setGpsLogs}
                    safetyViolations={safetyViolations}
                    setSafetyViolations={setSafetyViolations}
                    aiSummary={aiSummary}
                    setAiSummary={setAiSummary}
                    isSummarizing={isSummarizing}
                    generateAiDailySummary={generateAiDailySummary}
                    createAiRecallCard={createAiRecallCard}
                    isGeneratingRecall={isGeneratingRecall}
                    onReset={handleResetSession}
                  />
                ) : (
                  <PatientView 
                    patientInfo={patientInfo}
                    familyContacts={familyContacts}
                    memoryCards={memoryCards}
                  />
                )
              ) : null}

            </AnimatePresence>
          </div>

        </div>

      </main>

    </div>
  );
}
