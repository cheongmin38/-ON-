/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Heart, User, Phone, MapPin, Calendar, Activity, Eye, 
  QrCode, Clipboard, Pill, AlertTriangle, ShieldCheck, 
  ArrowRight, ArrowLeft, Camera, Shield, Check, Volume2, HelpCircle 
} from "lucide-react";
import { 
  UserRole, GuardianInfo, PatientInfo, SafeZone, 
  Medication, FamilyContact 
} from "../types";

interface OnboardingFlowProps {
  role: UserRole;
  initialUserName: string;
  initialUserPhone: string;
  onCompleteOnboarding: (data: {
    guardianInfo: GuardianInfo;
    patientInfo: PatientInfo;
    safeZone: SafeZone;
    medications: Medication[];
    familyContacts: FamilyContact[];
  }) => void;
}

export default function OnboardingFlow({ 
  role, 
  initialUserName, 
  initialUserPhone, 
  onCompleteOnboarding 
}: OnboardingFlowProps) {
  
  // Guardian steps indices: 0 to 6
  // Patient steps indices: 0 to 3
  const [step, setStep] = useState(0);

  // 1. Guardian Info
  const [guardianInfo, setGuardianInfo] = useState<GuardianInfo>({
    name: role === "GUARDIAN" ? initialUserName : "",
    relationship: "자녀",
    phone: role === "GUARDIAN" ? initialUserPhone : "",
  });

  // 2. Patient Info
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    name: role === "PATIENT" ? initialUserName : "이지원",
    birthdate: "1954-08-15",
    gender: "여성",
    address: "서울특별시 서초구 반포동 12-3",
    diseaseNotes: "알츠하이머 초기 판정 (2025년 3월), 당뇨약 오전 복용 필요.",
  });

  // 3. Patient Link Code
  const [enteredLinkCode, setEnteredLinkCode] = useState("");
  const [patientLinked, setPatientLinked] = useState(false);

  // 4. Safe Zone
  const [safeZone, setSafeZone] = useState<SafeZone>({
    address: "서울특별시 서초구 반포동 12-3",
    radius: 500,
    frequentPlaces: ["반포 종합사회복지관", "새빛 아파트 경로당", "보람 마트 반포점"],
  });
  const [newFrequentPlace, setNewFrequentPlace] = useState("");

  // 5. Medication Info
  const [medications, setMedications] = useState<Medication[]>([
    { id: "1", name: "치매 완화제 (도네페질)", time: "오전 08:30", frequency: 1, memo: "아침 식사 직후 꼭 물 1컵과 함께 복용" },
    { id: "2", name: "혈압약 (바소디핀)", time: "오후 07:00", frequency: 1, memo: "저녁 식사 후 복용" }
  ]);
  const [tempMed, setTempMed] = useState({ name: "", time: "오전 09:00", frequency: 1, memo: "" });

  // 6. Family Contact
  const [familyContacts, setFamilyContacts] = useState<FamilyContact[]>([
    { id: "1", name: "김태진", relationship: "아들 (비상연락망 1위)", phone: "010-9876-5432" },
    { id: "2", name: "김혜림", relationship: "딸", phone: "010-2345-6789" }
  ]);
  const [tempContact, setTempContact] = useState({ name: "", relationship: "아들", phone: "" });

  // 7. System permissions selection
  const [permissions] = useState({
    location: true,
    notification: true,
    calling: true,
    camera: true
  });

  // Code Submit handler
  const handleLinkCodeSubmit = () => {
    if (enteredLinkCode.replace(/\s/g, "").toUpperCase() === "ON-7295" || enteredLinkCode === "7295") {
      setPatientLinked(true);
    } else {
      alert("올바르지 않은 코드입니다. 동기화를 위해 '7295' 또는 'ON-7295'를 입력해 주세요.");
    }
  };

  const addPlace = () => {
    if (newFrequentPlace.trim()) {
      setSafeZone(prev => ({
        ...prev,
        frequentPlaces: [...prev.frequentPlaces, newFrequentPlace.trim()]
      }));
      setNewFrequentPlace("");
    }
  };

  const removePlace = (index: number) => {
    setSafeZone(prev => ({
      ...prev,
      frequentPlaces: prev.frequentPlaces.filter((_, i) => i !== index)
    }));
  };

  const addMedication = () => {
    if (tempMed.name.trim()) {
      setMedications(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          name: tempMed.name,
          time: tempMed.time,
          frequency: tempMed.frequency,
          memo: tempMed.memo
        }
      ]);
      setTempMed({ name: "", time: "오전 09:00", frequency: 1, memo: "" });
    }
  };

  const addContact = () => {
    if (tempContact.name.trim() && tempContact.phone.trim()) {
      setFamilyContacts(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          name: tempContact.name,
          relationship: tempContact.relationship,
          phone: tempContact.phone
        }
      ]);
      setTempContact({ name: "", relationship: "아들", phone: "" });
    }
  };

  const handleNext = () => {
    const totalSteps = role === "GUARDIAN" ? 7 : 4;
    if (step < totalSteps - 1) {
      setStep(prev => prev + 1);
    } else {
      onCompleteOnboarding({
        guardianInfo,
        patientInfo,
        safeZone,
        medications,
        familyContacts
      });
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(prev => prev - 1);
    }
  };

  // -------------------------------------------------------------
  // GUARDIAN RENDER STEPS
  // -------------------------------------------------------------
  const renderGuardianStep = () => {
    switch (step) {
      case 0: // Step 1: Guardian Info
        return (
          <motion.div key="g-step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 bg-[#3182f6]/10 text-[#3182f6] rounded-full flex items-center justify-center text-xs">1</span>
              보호자 기본 정보 입력
            </h4>
            <p className="text-xs text-slate-400 mt-1">치매 환자를 직접 감독/보호하시는 보호자 한 분의 정보입니다.</p>
            
            <div className="space-y-4 mt-6">
              <div>
                <label className="text-xs font-bold text-slate-500 block pl-1">보호자 성함</label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text"
                    value={guardianInfo.name}
                    onChange={(e) => setGuardianInfo({...guardianInfo, name: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-[#F2F4F6] border-0 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#3182f6]"
                    placeholder="성함을 입력해 주세요"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block pl-1">환자와의 관계</label>
                <div className="grid grid-cols-4 gap-2 mt-1.5">
                  {["아들", "딸", "배우자", "기타"].map((rel) => (
                    <button
                      key={rel}
                      type="button"
                      onClick={() => setGuardianInfo({...guardianInfo, relationship: rel})}
                      className={`py-2 px-1 text-xs font-bold rounded-lg border transition ${
                        guardianInfo.relationship === rel 
                          ? "bg-[#3182f6]/5 border-[#3182f6] text-[#3182f6]" 
                          : "bg-[#F2F4F6] border-transparent text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {rel}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block pl-1">긴급 연락처 (보호자 번호)</label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="tel"
                    value={guardianInfo.phone}
                    onChange={(e) => setGuardianInfo({...guardianInfo, phone: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-[#F2F4F6] border-0 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#3182f6]"
                    placeholder="예) 01012345678"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 1: // Step 2: Patient Info
        return (
          <motion.div key="g-step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 bg-[#3182f6]/10 text-[#3182f6] rounded-full flex items-center justify-center text-xs">2</span>
              관리 대상 환자 등록
            </h4>
            <p className="text-xs text-slate-400 mt-1">집중 관리 및 보호 대상이 될 어머님 혹은 아버님의 정보입니다.</p>

            <div className="space-y-3.5 mt-5 max-h-[460px] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-500 block pl-1">환자 존함</label>
                  <input 
                    type="text"
                    value={patientInfo.name}
                    onChange={(e) => setPatientInfo({...patientInfo, name: e.target.value})}
                    className="w-full mt-1 px-3 py-2.5 bg-[#F2F4F6] border-0 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#3182f6]"
                    placeholder="성함"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block pl-1">성별</label>
                  <div className="grid grid-cols-2 gap-1.5 mt-1">
                    {["여성", "남성"].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setPatientInfo({...patientInfo, gender: g})}
                        className={`py-2 text-xs font-bold rounded-lg border text-center ${
                          patientInfo.gender === g
                            ? "bg-[#3182f6]/5 border-[#3182f6] text-[#3182f6]"
                            : "bg-[#F2F4F6] border-transparent text-slate-600"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block pl-1">생년월일</label>
                <div className="relative mt-1">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="date"
                    value={patientInfo.birthdate}
                    onChange={(e) => setPatientInfo({...patientInfo, birthdate: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F2F4F6] border-0 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#3182f6]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block pl-1">환자 거주지 주소</label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text"
                    value={patientInfo.address}
                    onChange={(e) => setPatientInfo({...patientInfo, address: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F2F4F6] border-0 rounded-xl text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#3182f6]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block pl-1">의학적 주요 참고사항</label>
                <textarea 
                  value={patientInfo.diseaseNotes}
                  onChange={(e) => setPatientInfo({...patientInfo, diseaseNotes: e.target.value})}
                  rows={2}
                  className="w-full mt-1 p-3 bg-[#F2F4F6] border-0 rounded-xl text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#3182f6] resize-none"
                  placeholder="증상, 지병, 당부사항 등"
                />
              </div>
            </div>
          </motion.div>
        );

      case 2: // Step 3: Device Sync Code
        return (
          <motion.div key="g-step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 bg-[#3182f6]/10 text-[#3182f6] rounded-full flex items-center justify-center text-xs">3</span>
              환자 모바일 연동 코드 발급
            </h4>
            <p className="text-xs text-slate-400 mt-1">가족 연동 시스템 가동을 위한 치매 환자 보조기 연동 코드번호입니다.</p>

            <div className="py-8 bg-[#FAFAFB] rounded-2xl border border-slate-100 flex flex-col justify-center items-center text-center">
              <QrCode className="w-16 h-16 text-[#3182f6] mb-4" />
              <span className="text-xs text-slate-400 font-medium">연동 인증 코드</span>
              <span className="text-3xl font-black text-slate-800 tracking-wider mt-1">ON-7295</span>
              <p className="text-[11px] text-[#3182f6] px-8 mt-4 leading-normal font-semibold">
                환자용 휴대전화 앱을 열고 온보딩 단계에서 위 코드 '7295'를 입력하면 동기화 완료됩니다.
              </p>
            </div>

            <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-50 text-[11px] text-slate-500 flex gap-2">
              <Clipboard className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <span>동기화 코드는 연동 시 단 한 번 인증하며, 설정 완료 후에는 자동으로 안전 관리가 시작됩니다.</span>
            </div>
          </motion.div>
        );

      case 3: // Step 4: Safe Zone Settings
        return (
          <motion.div key="g-step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 bg-[#3182f6]/10 text-[#3182f6] rounded-full flex items-center justify-center text-xs">4</span>
              안심영역 및 이탈 경보 반경 설정
            </h4>
            <p className="text-xs text-slate-400">환자분이 거주지나 자주 가시는 범위 밖으로 갈 경우 자동 이탈 알림이 발생합니다.</p>

            <div className="space-y-3.5 mt-2">
              <div>
                <label className="text-xs font-extrabold text-[#3182f6] block">기본 보호 반경 범위</label>
                <div className="grid grid-cols-3 gap-2 mt-1.5">
                  {[300, 500, 1000].map((radius) => (
                    <button
                      key={radius}
                      type="button"
                      onClick={() => setSafeZone({...safeZone, radius})}
                      className={`py-2 text-xs font-bold rounded-lg border ${
                        safeZone.radius === radius 
                          ? "bg-[#3182f6]/5 border-[#3182f6] text-[#3182f6]" 
                          : "bg-[#F2F4F6] border-transparent text-slate-500"
                      }`}
                    >
                      {radius}m ({radius === 300 ? "좁음" : radius === 500 ? "보통" : "넓음"})
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block pl-1">자주 방문하시는 이동 거점</label>
                <div className="flex gap-2 mt-1">
                  <input 
                    type="text"
                    value={newFrequentPlace}
                    onChange={(e) => setNewFrequentPlace(e.target.value)}
                    className="flex-1 px-3 py-2.5 bg-[#F2F4F6] border-0 rounded-xl text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#3182f6]"
                    placeholder="복지관, 주간보호센터 등 추가"
                  />
                  <button 
                    type="button"
                    onClick={addPlace}
                    className="px-3.5 bg-[#3182f6] hover:bg-[#1b64da] text-white text-xs font-bold rounded-xl transition"
                  >
                    추가
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3 max-h-[110px] overflow-y-auto">
                  {safeZone.frequentPlaces.map((place, idx) => (
                    <span 
                      key={idx}
                      className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-medium rounded-full flex items-center gap-1.5 hover:bg-slate-200 transition"
                    >
                      {place}
                      <button 
                        type="button" 
                        onClick={() => removePlace(idx)} 
                        className="text-slate-400 hover:text-slate-700 text-[10px] font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 4: // Step 5: Dosage Management
        return (
          <motion.div key="g-step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 bg-[#3182f6]/10 text-[#3182f6] rounded-full flex items-center justify-center text-xs">5</span>
              약 복용 스케줄 등록
            </h4>
            <p className="text-xs text-slate-400 mt-1">환자분이 매일 드시는 정기 약물 정보를 입력하여 자동 약 먹기 독려 알림을 시작합니다.</p>

            <div className="space-y-3.5 mt-4">
              <div className="bg-[#FAFAFB] p-3 rounded-2xl border border-slate-100 text-xs text-slate-700">
                <span className="font-bold text-slate-800 block mb-1">등록된 약물 목록 ({medications.length})</span>
                <ul className="space-y-1 list-disc pl-4 text-slate-600">
                  {medications.map((m) => (
                    <li key={m.id}>
                      <strong>{m.name}</strong> - {m.time} ({m.memo})
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-[#FAFAFB] rounded-2xl border border-slate-100 space-y-2">
                <span className="text-[11px] font-bold text-slate-700 block">새 약물 간편 추가</span>
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text"
                    value={tempMed.name}
                    onChange={(e) => setTempMed({...tempMed, name: e.target.value})}
                    placeholder="약 이름"
                    className="px-2 py-1.5 bg-[#F2F4F6] border-0 rounded text-xs"
                  />
                  <input 
                    type="text"
                    value={tempMed.time}
                    onChange={(e) => setTempMed({...tempMed, time: e.target.value})}
                    placeholder="예) 오전 09:00"
                    className="px-2 py-1.5 bg-[#F2F4F6] border-0 rounded text-xs"
                  />
                </div>
                <input 
                  type="text"
                  value={tempMed.memo}
                  onChange={(e) => setTempMed({...tempMed, memo: e.target.value})}
                  placeholder="복약 상세 요령"
                  className="w-full px-2 py-1.5 bg-[#F2F4F6] border-0 rounded text-xs"
                />
                <button
                  type="button"
                  onClick={addMedication}
                  className="w-full py-1.5 bg-[#3182f6] hover:bg-[#1b64da] text-white font-bold rounded-lg text-[11px] transition"
                >
                  추가
                </button>
              </div>
            </div>
          </motion.div>
        );

      case 5: // Step 6: Family Contacts
        return (
          <motion.div key="g-step6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 bg-[#3182f6]/10 text-[#3182f6] rounded-full flex items-center justify-center text-xs">6</span>
              비상용 가족 연락망 등록
            </h4>
            <p className="text-xs text-slate-400 mt-1">환자분이 위급상황에 처하거나 기억 카드 학습 시 필요한 핵심 가족 연락처입니다.</p>

            <div className="space-y-3.5 mt-4 max-h-[460px] overflow-y-auto pr-1">
              <div className="bg-[#3182f6]/5 p-3 rounded-xl border border-[#3182f6]/10 text-xs">
                <h5 className="font-bold text-[#1b64da] block mb-1">등록된 가족 목록</h5>
                <div className="grid grid-cols-2 gap-2 mt-1.5">
                  {familyContacts.map((c) => (
                    <div key={c.id} className="bg-white p-2.5 rounded-lg border border-slate-100 flex flex-col">
                      <span className="font-bold text-slate-800">{c.name}</span>
                      <span className="text-[10px] text-slate-400">{c.relationship} • {c.phone}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-[#FAFAFB] rounded-2xl border border-slate-100 space-y-2">
                <span className="text-[11px] font-bold text-slate-700 block">새 가족 추가</span>
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text"
                    value={tempContact.name}
                    onChange={(e) => setTempContact({...tempContact, name: e.target.value})}
                    placeholder="이름"
                    className="px-2 py-1.5 bg-[#F2F4F6] border-0 rounded text-xs"
                  />
                  <input 
                    type="text"
                    value={tempContact.phone}
                    onChange={(e) => setTempContact({...tempContact, phone: e.target.value})}
                    placeholder="연락처"
                    className="px-2 py-1.5 bg-[#F2F4F6] border-0 rounded text-xs"
                  />
                </div>
                <input 
                  type="text"
                  value={tempContact.relationship}
                  onChange={(e) => setTempContact({...tempContact, relationship: e.target.value})}
                  placeholder="예) 아들, 배우자, 손녀"
                  className="w-full px-2 py-1.5 bg-[#F2F4F6] border-0 rounded text-xs"
                />
                
                <div className="flex gap-2 items-center text-xs text-slate-400 bg-[#F2F4F6] p-2 rounded-lg border border-transparent">
                  <Camera className="w-4 h-4 text-slate-400" />
                  <span>가족 얼굴 사진 등록 기능 활성 예정</span>
                </div>

                <button
                  type="button"
                  onClick={addContact}
                  className="w-full py-1.5 bg-[#3182f6] hover:bg-[#1b64da] text-white font-bold rounded-lg text-[11px] transition"
                >
                  가족 연락처 추가
                </button>
              </div>
            </div>
          </motion.div>
        );

      case 6: // Step 7: Final permissions list
        return (
          <motion.div key="g-step7" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 bg-[#3182f6]/10 text-[#3182f6] rounded-full flex items-center justify-center text-xs">7</span>
              알림 및 최종 권한 검토
            </h4>
            <p className="text-xs text-slate-400 mt-1">기억ON 대시보드를 안정적으로 가동하기 위해 모바일 중요 접근 권한 상태를 검수합니다.</p>

            <div className="space-y-3.5 mt-8 border border-slate-100 p-4 bg-[#FAFAFB] rounded-2xl">
              <div className="flex flex-col justify-center items-center text-center">
                <ShieldCheck className="w-12 h-12 text-[#3182f6] mb-2" />
                <h5 className="font-bold text-slate-800 text-sm">설정이 완료되었습니다!</h5>
                <p className="text-[11px] text-slate-400 mt-1">등록된 환자 정보가 실시간 서버 관리 대상과 연동됩니다.</p>
              </div>

              <div className="space-y-2 text-xs pt-4">
                {Object.entries(permissions).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-100">
                    <span className="font-semibold text-slate-600">
                      {key === "location" && "• 고성능 백그라운드 GPS 위치 권한 허가"}
                      {key === "notification" && "• 비상 상태 Push 알람 및 배지 발송"}
                      {key === "calling" && "• 환자용 원클릭 보호자 전화 직시 허용"}
                      {key === "camera" && "• 환자 앨범 관리 카메라 사용 승인"}
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-100 flex items-center gap-1">
                      <Check className="w-3 h-3" /> 허용됨
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  // -------------------------------------------------------------
  // PATIENT RENDER STEPS
  // -------------------------------------------------------------
  const renderPatientStep = () => {
    switch (step) {
      case 0: // Step 1: Connect to Guardian
        return (
          <motion.div key="p-step1" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="bg-[#3182f6]/5 border border-[#3182f6]/10 p-3 rounded-2xl mb-4 flex items-center gap-2">
              <Volume2 className="w-6 h-6 text-[#3182f6] flex-shrink-0 animate-bounce" />
              <p className="text-[13px] font-bold text-slate-700">
                보호자분의 전화기에 있는 '코드' 4글자를 아래에 넣어주세요.
              </p>
            </div>

            <h4 className="text-2xl font-black text-slate-800 text-center mb-6 mt-4">
              가장 먼저 보호자와 연결할게요
            </h4>

            <div className="space-y-4">
              <div className="flex flex-col items-center">
                <input 
                  type="text"
                  maxLength={10}
                  value={enteredLinkCode}
                  onChange={(e) => setEnteredLinkCode(e.target.value)}
                  placeholder="예) 7295 또는 ON-7295"
                  className="w-full text-center px-4 py-4 text-2xl font-black text-[#3182f6] border-2 border-slate-200 bg-white rounded-2xl focus:outline-none focus:border-[#3182f6] tracking-wider"
                />
                
                <p className="text-xs text-slate-400 mt-2">팁: `7295`를 입력하시고 아래 확인 단추를 눌러주세요</p>
                
                <button 
                  type="button"
                  onClick={handleLinkCodeSubmit}
                  className="w-full py-3.5 bg-[#3182f6] hover:bg-[#1b64da] font-bold text-white text-md rounded-2xl shadow-xs mt-3 transition flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5 stroke-[3]" /> 연결 확인하기
                </button>
              </div>

              {patientLinked && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-emerald-50 text-emerald-800 border-2 border-emerald-200 rounded-2xl text-center font-bold text-sm flex flex-col items-center gap-1"
                >
                  <ShieldCheck className="w-8 h-8 text-emerald-600" />
                  아들 '김태진'님과 완벽하게 연결되었습니다!
                </motion.div>
              )}
            </div>
          </motion.div>
        );

      case 1: // Step 2: Welcome message
        return (
          <motion.div key="p-step2" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4 py-4">
            <h4 className="text-xl font-bold text-slate-800 text-center">안내 메시지</h4>
            <div className="p-8 bg-[#FAFAFB] rounded-3xl border border-slate-100 flex flex-col items-center text-center leading-relaxed">
              <Heart className="w-16 h-16 text-[#3182f6] fill-[#3182f6]/10 mb-5 animate-pulse" />
              <p className="text-slate-800 text-xl font-extrabold mb-3">반갑습니다 어머님/아버님!</p>
              <p className="text-slate-600 text-sm font-medium">
                이 앱은 언제 어디서든 <span className="text-[#3182f6] font-bold">집으로 가는 편안한 길</span>을 안내해 드리고, 다급학 때 <span className="text-[#3182f6] font-bold">가족에게 터치 한 번으로 연락</span>하는 것을 돕는 착한 도우미입니다.
              </p>
            </div>
            <div className="bg-blue-50/40 rounded-2xl p-4 text-center border border-blue-50">
              <span className="text-slate-500 font-semibold text-xs">항상 안심하고 주머니에 휴대폰을 챙겨 다녀 주세요!</span>
            </div>
          </motion.div>
        );

      case 2: // Step 3: Grant permissions
        return (
          <motion.div key="p-step3" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="py-2">
            <h4 className="text-xl font-bold text-slate-800 text-center mb-1">앱 권한 승인</h4>
            <p className="text-xs text-slate-400 text-center mb-6">환자분 휴대전화의 3가지 핵심 동의를 눌러 안전장치를 켭니다</p>

            <div className="space-y-4">
              <div className="flex gap-4 items-center p-4 bg-[#FAFAFB] rounded-2xl border border-slate-100 shadow-xs text-left">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl font-black text-xl">
                  1
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">길 찾기용 내 위치 공유 (위치)</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">환자님이 계신 위치를 보호자가 확인합니다.</p>
                </div>
              </div>

              <div className="flex gap-4 items-center p-4 bg-[#FAFAFB] rounded-2xl border border-slate-100 shadow-xs text-left">
                <div className="p-3 bg-[#3182f6]/5 text-[#3182f6] rounded-xl font-black text-xl">
                  2
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">보호자에게 자동 전화걸기 (전화)</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">어렵게 번호를 찾지 않아도 즉각 통화가 연결됩니다.</p>
                </div>
              </div>

              <div className="flex gap-4 items-center p-4 bg-[#FAFAFB] rounded-2xl border border-slate-100 shadow-xs text-left">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl font-black text-xl">
                  3
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">돌봄 알림 소리 켜기 (푸시 알림)</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">약 드실 시간 등을 알려주는 예쁜 알림 소리입니다.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-3 bg-emerald-50 text-emerald-800 border border-emerald-100 text-center rounded-xl font-bold text-xs">
              ✓ 위 3개 필수 주요 보안 권한 모의 작동 허가 완료
            </div>
          </motion.div>
        );

      case 3: // Step 4: Practical Training Simulator
        return (
          <motion.div key="p-step4" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
            <div className="bg-[#FAFAFB] border border-slate-150 p-2.5 rounded-xl text-center text-slate-500 font-bold text-xs flex items-center justify-center gap-1.5">
              <HelpCircle className="w-4 h-4" />
              연습하기: 아래 3가지 버튼 중 하나를 클릭해 체험해 보세요!
            </div>

            <h4 className="text-lg font-bold text-slate-800 text-center">
              가장 위급할 때 쓰는 3가지 신속 단추
            </h4>

            {/* Simulated Patient 3-button layout */}
            <div className="space-y-3.5 py-2">
              <button
                type="button"
                onClick={() => alert("[실행 연습] '집으로 가기'를 클릭하셨습니다. 집 주소까지 가장 편안히 돌아가실 수 있는 버스노선과 도보 가이드가 큰 글씨 지도로 켜지게 됩니다.")}
                className="w-full py-4 text-center text-teal-800 font-bold text-lg bg-teal-50 hover:bg-teal-100/80 rounded-2xl border border-teal-100 block transition-all"
              >
                집으로 가는 안전한 길 찾기
              </button>

              <button
                type="button"
                onClick={() => alert("[실행 연습] '가족에게 전화'를 클릭하셨습니다. 첫 번째 긴급통화 연결망 '김태진(아들)'님과의 핫라인 전화 호출이 즉각 작동합니다.")}
                className="w-full py-4 text-center text-sky-800 font-bold text-lg bg-sky-50 hover:bg-sky-100/85 rounded-2xl border border-sky-100 block transition-all"
              >
                내 보호자(가족)에게 바로 전화
              </button>

              <button
                type="button"
                onClick={() => alert("[실행 연습] '도와주세요' 비상신호가 보호자 휴대폰 및 119 정밀 GPS 구조 알림 센터로 모의 즉시 긴급 전송됩니다.")}
                className="w-full py-4 text-center text-white font-bold text-lg bg-[#FF3B30] hover:bg-red-600 rounded-2xl border-0 block transition-all shadow-xs"
              >
                주위 도움 요청하기 (정밀 GPS 공유)
              </button>
            </div>
            
            <p className="text-[11px] text-slate-400 text-center px-4 leading-normal">
              연습이 끝났다면 아래 [가입 완료 및 가동하기]를 터치하시면 '기억ON' 정식 홈 대시보드가 준비됩니다.
            </p>
          </motion.div>
        );

      default:
        return null;
    }
  };

  // Progress metrics helpers
  const total = role === "GUARDIAN" ? 7 : 4;
  const progressPercent = Math.round(((step + 1) / total) * 100);

  return (
    <div className="w-full h-full md:max-w-md md:h-[90vh] md:max-h-[820px] md:my-auto md:rounded-3xl md:shadow-2xl md:border md:border-slate-200/50 bg-[#FAFAFB] flex flex-col justify-between overflow-hidden relative mx-auto font-sans">
      
      {/* Dynamic Header */}
      <div className="px-6 pt-5 bg-white flex-shrink-0 border-b border-slate-100/60 pb-3">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-[#3182f6] fill-[#3182f6]/10 animate-pulse" />
            <span className="text-xs font-black text-[#191F28]">기억ON 온보딩</span>
            <span className={`text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded ${
              role === "GUARDIAN" ? "bg-[#3182f6]/10 text-[#3182f6]" : "bg-amber-100 text-amber-800"
            }`}>
              {role === "GUARDIAN" ? "보호자 등록용" : "환자 본인용"}
            </span>
          </div>
          <span className="text-[11px] font-bold text-slate-400">
            {step + 1} / {total} 단계
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: "0%" }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ ease: "easeInOut" }}
            className={`h-full ${role === "GUARDIAN" ? "bg-[#3182f6]" : "bg-amber-500"}`}
          />
        </div>
      </div>

      {/* Onboarding Main Sliding Panel */}
      <div className="flex-1 px-7 py-4 overflow-y-auto bg-white">
        <AnimatePresence mode="wait">
          {role === "GUARDIAN" ? renderGuardianStep() : renderPatientStep()}
        </AnimatePresence>
      </div>

      {/* Dynamic Navigation Footer */}
      <div className="p-6 bg-slate-50 border-t border-slate-100/50 flex gap-3.5 flex-shrink-0">
        {step > 0 && (
          <button
            type="button"
            onClick={handleBack}
            className="flex-1 py-3.5 px-4 bg-white hover:bg-slate-100 text-slate-600 font-bold rounded-xl border border-slate-200 transition flex items-center justify-center gap-1.5 text-xs"
          >
            <ArrowLeft className="w-4 h-4" /> 이전
          </button>
        )}
        
        <button
          type="button"
          onClick={handleNext}
          disabled={role === "PATIENT" && step === 0 && !patientLinked}
          className={`py-3.5 font-bold rounded-xl shadow transition text-center text-xs flex items-center justify-center gap-1.5 ${
            step > 0 ? "flex-1" : "w-full"
          } ${
            role === "PATIENT" && step === 0 && !patientLinked
              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
              : role === "GUARDIAN" ? "bg-[#3182f6] hover:bg-[#1b64da] text-white" : "bg-amber-500 hover:bg-amber-600 text-white"
          }`}
        >
          {step === total - 1 ? (
            role === "GUARDIAN" ? "가입 완료 및 가동하기" : "가입 완료 및 가동하기"
          ) : (
            role === "PATIENT" && step === 0 && !patientLinked 
              ? "코드 연동 필요" 
              : "동의 및 다음 단계로 이동"
          )}
          {step < total - 1 && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>

    </div>
  );
}
