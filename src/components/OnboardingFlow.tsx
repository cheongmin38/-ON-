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
  
  // Guardian onboarding state index: 0 ~ 6 (total 7 steps)
  // Patient onboarding state index: 0 ~ 3 (total 4 steps)
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

  // 3. Patient Link Code (Mock)
  const [linkCode] = useState("ON-7295");
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

  // 7. System permissions selection (state triggers visual checkboxes)
  const [permissions, setPermissions] = useState({
    location: true,
    notification: true,
    calling: true,
    camera: true
  });

  // Patient Link Input Handler
  const handleLinkCodeSubmit = () => {
    if (enteredLinkCode.replace(/\s/g, "").toUpperCase() === "ON-7295" || enteredLinkCode === "7295") {
      setPatientLinked(true);
    } else {
      alert("올바르지 않은 코드입니다. 동기화를 위해 '7295' 또는 'ON-7295'를 입력해 주세요.");
    }
  };

  // Helper additions
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
      // Completed, trigger parent callback
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
  // GUARDIAN ONBOARDING RENDER STEPS
  // -------------------------------------------------------------
  const renderGuardianStep = () => {
    switch (step) {
      case 0: // Step 1: Guardian Info
        return (
          <motion.div key="g-step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center text-xs">1</span>
              보호자 기본 정보 입력
            </h4>
            <p className="text-xs text-slate-500 mt-1">치매 환자를 직접 감독/보호하시는 보호자 한 분의 정보입니다.</p>
            
            <div className="space-y-4 mt-6">
              <div>
                <label className="text-xs font-bold text-slate-600 block pl-1">보호자 성함</label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text"
                    value={guardianInfo.name}
                    onChange={(e) => setGuardianInfo({...guardianInfo, name: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="성함을 입력해 주세요"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block pl-1">환자와의 관계</label>
                <div className="grid grid-cols-4 gap-2 mt-1.5">
                  {["아들", "딸", "배우자", "기타"].map((rel) => (
                    <button
                      key={rel}
                      type="button"
                      onClick={() => setGuardianInfo({...guardianInfo, relationship: rel})}
                      className={`py-2 px-1 text-xs font-bold rounded-lg border transition ${
                        guardianInfo.relationship === rel 
                          ? "bg-teal-50 border-teal-500 text-teal-700" 
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {rel}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block pl-1">긴급 연락처 (보호자 번호)</label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="tel"
                    value={guardianInfo.phone}
                    onChange={(e) => setGuardianInfo({...guardianInfo, phone: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
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
              <span className="w-5 h-5 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center text-xs">2</span>
              관리 대상 환자 등록
            </h4>
            <p className="text-xs text-slate-500 mt-1">집중 관리 및 보호 대상이 될 어머님 혹은 아버님의 정보입니다.</p>

            <div className="space-y-3.5 mt-5 max-h-[460px] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-600 block pl-1">환자 존함</label>
                  <input 
                    type="text"
                    value={patientInfo.name}
                    onChange={(e) => setPatientInfo({...patientInfo, name: e.target.value})}
                    className="w-full mt-1 px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="성함"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block pl-1">성별</label>
                  <div className="grid grid-cols-2 gap-1.5 mt-1">
                    {["여성", "남성"].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setPatientInfo({...patientInfo, gender: g})}
                        className={`py-2 text-xs font-extrabold rounded-lg border text-center ${
                          patientInfo.gender === g
                            ? "bg-teal-50 border-teal-500 text-teal-700"
                            : "bg-white border-slate-200 text-slate-600"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block pl-1">생년월일</label>
                <div className="relative mt-1">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="date"
                    value={patientInfo.birthdate}
                    onChange={(e) => setPatientInfo({...patientInfo, birthdate: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block pl-1">환자 거주지 주소</label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text"
                    value={patientInfo.address}
                    onChange={(e) => setPatientInfo({...patientInfo, address: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="안전영역 주소 기준점이 됩니다"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block pl-1">주요 인지 질환 설명 및 특이사항 메모</label>
                <textarea 
                  rows={3}
                  value={patientInfo.diseaseNotes}
                  onChange={(e) => setPatientInfo({...patientInfo, diseaseNotes: e.target.value})}
                  className="w-full mt-1 p-3 bg-white border border-slate-200 rounded-xl text-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  placeholder="치매 등급, 조심해야 할 합병증, 복약 알림 가이드, 신체 특성 등을 적어주세요."
                />
              </div>
            </div>
          </motion.div>
        );

      case 2: // Step 3: Connect
        return (
          <motion.div key="g-step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center text-xs">3</span>
              환자 모바일 연결 설정
            </h4>
            <p className="text-xs text-slate-500 mt-1">환자분의 스마트폰에 설치한 기억ON 앱을 보호자용 대시보드와 연동합니다.</p>

            <div className="mt-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-40 h-40 bg-white border-2 border-slate-200 rounded-3xl shadow-sm flex flex-col items-center justify-center p-3 relative group">
                <QrCode className="w-24 h-24 text-slate-800 group-hover:scale-105 transition" />
                <span className="text-[10px] bg-teal-700 text-white rounded px-2 py-0.5 mt-2 font-bold animate-pulse">Scan Me</span>
              </div>

              <div className="bg-slate-100 px-6 py-4 rounded-2xl w-full border border-slate-200">
                <span className="text-slate-400 text-[10px] block font-bold uppercase tracking-wider">초대 코드 8자리</span>
                <span className="text-2xl font-extrabold text-teal-700 tracking-widest">{linkCode}</span>
                <p className="text-[10px] text-slate-500 mt-2">
                  이 코드를 환자 이름으로 가입한 스마트폰 앱의 첫 화면(초대코드 입력란)에 그대로 채워 넣으시면 완벽히 동기화됩니다.
                </p>
              </div>

              <div className="flex gap-2 text-left justify-center bg-teal-50 border border-teal-100 p-3 rounded-xl w-full">
                <ShieldCheck className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-[11px] font-bold text-teal-800">동기화 시 활성화되는 기능</h5>
                  <p className="text-[10px] text-teal-600 mt-0.5">환자의 배터리 잔량, 비상 SOS 알림, 실시간 GPS, 걸음 수 추적이 활성화됩니다.</p>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 3: // Step 4: Safe Zone Settings
        return (
          <motion.div key="g-step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center text-xs">4</span>
              안심 안전구역 지정
            </h4>
            <p className="text-xs text-slate-500 mt-1">환자분이 거주하며 활동하는 반경을 설정합니다. 범위를 이탈할 시 알림이 발송됩니다.</p>

            <div className="space-y-4 mt-5">
              <div>
                <label className="text-xs font-bold text-slate-600 block pl-1">안심 구역 중심지 주소</label>
                <input 
                  type="text"
                  value={safeZone.address}
                  onChange={(e) => setSafeZone({...safeZone, address: e.target.value})}
                  className="w-full mt-1 px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="예) 아파트 주소"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block pl-1">안심 반경 한계 거리</label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {[300, 500, 1000].map((radius) => (
                    <button
                      key={radius}
                      type="button"
                      onClick={() => setSafeZone({...safeZone, radius: radius})}
                      className={`py-2 px-1 text-xs font-bold rounded-lg border text-center transition ${
                        safeZone.radius === radius 
                          ? "bg-teal-50 border-teal-500 text-teal-700 shadow-sm" 
                          : "bg-white border-slate-200 text-slate-600"
                      }`}
                    >
                      {radius < 1000 ? `${radius}m` : "1km"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-3">
                <label className="text-xs font-bold text-slate-600 block pl-1">자주 가는 안전 장소 등록</label>
                <div className="flex gap-2 mt-1.5">
                  <input 
                    type="text"
                    value={newFrequentPlace}
                    onChange={(e) => setNewFrequentPlace(e.target.value)}
                    className="flex-1 px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="복지관, 주간보호센터 등 추가"
                  />
                  <button 
                    type="button"
                    onClick={addPlace}
                    className="px-3.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition"
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
              <span className="w-5 h-5 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center text-xs">5</span>
              약물 약 복용 스케줄 등록
            </h4>
            <p className="text-xs text-slate-500 mt-1">환자분이 매일 드시는 정기 약물 정보를 입력하여 자동 약 먹기 독려 알림을 시작합니다.</p>

            <div className="space-y-3.5 mt-4">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs text-slate-700">
                <span className="font-bold text-slate-800 block mb-1">등록된 약물 목록 ({medications.length})</span>
                <ul className="space-y-1 list-disc pl-4 text-slate-600">
                  {medications.map((m) => (
                    <li key={m.id}>
                      <strong>{m.name}</strong> - {m.time} ({m.memo})
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold text-slate-700 block">새 약물 간편 추가</span>
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text"
                    value={tempMed.name}
                    onChange={(e) => setTempMed({...tempMed, name: e.target.value})}
                    placeholder="약 이름"
                    className="px-2 py-1.5 bg-slate-50 border border-slate-100 rounded text-xs"
                  />
                  <input 
                    type="text"
                    value={tempMed.time}
                    onChange={(e) => setTempMed({...tempMed, time: e.target.value})}
                    placeholder="예) 오전 09:00"
                    className="px-2 py-1.5 bg-slate-50 border border-slate-100 rounded text-xs"
                  />
                </div>
                <input 
                  type="text"
                  value={tempMed.memo}
                  onChange={(e) => setTempMed({...tempMed, memo: e.target.value})}
                  placeholder="복약 상세 요령"
                  className="w-full px-2 py-1.5 bg-slate-50 border border-slate-100 rounded text-xs"
                />
                <button
                  type="button"
                  onClick={addMedication}
                  className="w-full py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-[11px] transition shadow-xs"
                >
                  위 추가
                </button>
              </div>
            </div>
          </motion.div>
        );

      case 5: // Step 6: Family Contacts
        return (
          <motion.div key="g-step6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center text-xs">6</span>
              비상용 가족 연락망 등록
            </h4>
            <p className="text-xs text-slate-500 mt-1">환자분이 위급상황에 처하거나 기억 카드 학습 시 필요한 핵심 가족 연락처입니다.</p>

            <div className="space-y-3.5 mt-4 max-h-[460px] overflow-y-auto pr-1">
              <div className="bg-teal-50 p-3 rounded-xl border border-teal-100 text-xs">
                <h5 className="font-bold text-teal-900 block mb-1">등록된 가족 목록</h5>
                <div className="grid grid-cols-2 gap-2 mt-1.5">
                  {familyContacts.map((c) => (
                    <div key={c.id} className="bg-white p-2.5 rounded-lg border border-teal-200 flex flex-col">
                      <span className="font-bold text-slate-800">{c.name}</span>
                      <span className="text-[10px] text-slate-400">{c.relationship} • {c.phone}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold text-slate-700 block">새 가족 추가</span>
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text"
                    value={tempContact.name}
                    onChange={(e) => setTempContact({...tempContact, name: e.target.value})}
                    placeholder="이름"
                    className="px-2 py-1.5 bg-slate-50 border border-slate-100 rounded text-xs"
                  />
                  <input 
                    type="text"
                    value={tempContact.phone}
                    onChange={(e) => setTempContact({...tempContact, phone: e.target.value})}
                    placeholder="연락처 (예: 010-...)"
                    className="px-2 py-1.5 bg-slate-50 border border-slate-100 rounded text-xs"
                  />
                </div>
                <input 
                  type="text"
                  value={tempContact.relationship}
                  onChange={(e) => setTempContact({...tempContact, relationship: e.target.value})}
                  placeholder="예) 아들, 배우자, 손녀"
                  className="w-full px-2 py-1.5 bg-slate-50 border border-slate-100 rounded text-xs"
                />
                
                <div className="flex gap-2 items-center text-xs text-slate-500 bg-slate-50 p-2 rounded-lg border border-dotted border-slate-200">
                  <Camera className="w-4 h-4 text-slate-400" />
                  <span>가족 얼굴 사진 등록 기능 활성 예정</span>
                </div>

                <button
                  type="button"
                  onClick={addContact}
                  className="w-full py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-[11px] transition"
                >
                  위 가족 연락처 추가
                </button>
              </div>
            </div>
          </motion.div>
        );

      case 6: // Step 7: System Permission Confirmation
        return (
          <motion.div key="g-step7" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center text-xs">7</span>
              알림 및 최종 권한 검토
            </h4>
            <p className="text-xs text-slate-500 mt-1">기억ON 대시보드를 안정적으로 가동하기 위해 모바일 중요 접근 권한 상태를 검수합니다.</p>

            <div className="space-y-3.5 mt-8">
              <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 flex flex-col justify-center items-center text-center">
                <ShieldCheck className="w-12 h-12 text-teal-600 mb-2" />
                <h5 className="font-bold text-slate-800 text-sm">설정이 완료되었습니다!</h5>
                <p className="text-[11px] text-slate-500 mt-1">등록된 환자 정보가 실시간 서버 관리 대상과 연동됩니다.</p>
              </div>

              <div className="space-y-2 text-xs">
                {Object.entries(permissions).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="font-semibold text-slate-700">
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
  // PATIENT ONBOARDING RENDER STEPS
  // -------------------------------------------------------------
  const renderPatientStep = () => {
    switch (step) {
      case 0: // Step 1: Connect to Guardian
        return (
          <motion.div key="p-step1" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="bg-teal-50 border border-teal-100 p-3 rounded-2xl mb-4 flex items-center gap-2">
              <Volume2 className="w-6 h-6 text-teal-600 flex-shrink-0 animate-bounce" />
              <p className="text-[13px] font-bold text-teal-800">
                보호자분의 전화기에 있는 '코드' 4글자를 아래에 넣어주세요.
              </p>
            </div>

            <h4 className="text-2xl font-black text-slate-800 text-center mb-6">
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
                  className="w-full text-center px-4 py-4 text-2xl font-black text-teal-700 border-2 border-slate-300 bg-white rounded-2xl focus:outline-none focus:border-teal-500 tracking-wider"
                />
                
                <p className="text-xs text-slate-400 mt-2">팁: `7295`를 입력하시고 아래 주황색 확인 단추를 눌러주세요</p>
                
                <button 
                  type="button"
                  onClick={handleLinkCodeSubmit}
                  className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 font-bold text-white text-md rounded-2xl shadow mt-3 transition flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5 stroke-[3]" /> 연결 확인하기
                </button>
              </div>

              {patientLinked && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-teal-50 text-teal-800 border-2 border-teal-200 rounded-2xl text-center font-bold text-sm flex flex-col items-center gap-1"
                >
                  <ShieldCheck className="w-8 h-8 text-teal-600" />
                  아들 '김태진'님과 완벽하게 연결되었습니다!
                </motion.div>
              )}
            </div>
          </motion.div>
        );

      case 1: // Step 2: Welcome Text Guide
        return (
          <motion.div key="p-step2" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4 py-6">
            <h4 className="text-2xl font-extrabold text-slate-800 text-center">안내 메시지</h4>
            <div className="p-8 bg-teal-50 rounded-3xl border border-teal-100 flex flex-col items-center text-center leading-relaxed">
              <Heart className="w-16 h-16 text-teal-600 fill-teal-100 mb-5 animate-pulse" />
              <p className="text-slate-800 text-2xl font-black mb-3">반갑습니다 어머님/아버님!</p>
              <p className="text-slate-700 text-lg font-bold">
                이 앱은 언제 어디서든 <span className="text-teal-700 bg-teal-100/60 px-1 py-0.5 rounded">집으로 가는 편안한 길</span>을 안내해 드리고, 다급할 때 <span className="text-teal-700 bg-teal-100/60 px-1 py-0.5 rounded">가족에게 터치 한 번으로 연락</span>하는 것을 돕는 착한 도우미입니다.
              </p>
            </div>
            <div className="bg-amber-50 rounded-2xl p-4 text-center border border-amber-100">
              <span className="text-amber-800 font-bold text-sm">항상 안심하고 주머니에 휴대폰을 챙겨 다녀 주세요!</span>
            </div>
          </motion.div>
        );

      case 2: // Step 3: Grant Permissions
        return (
          <motion.div key="p-step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-2">
            <h4 className="text-2xl font-extrabold text-slate-800 text-center mb-1">앱 권한 승인</h4>
            <p className="text-sm text-slate-400 text-center mb-6">환자분 휴대전화의 3가지 핵심 동의를 눌러 안전장치를 켭니다</p>

            <div className="space-y-4">
              <div className="flex gap-4 items-center p-4 bg-white rounded-2xl border-2 border-slate-100 shadow-sm text-left">
                <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2l font-black text-xl">
                  1
                </div>
                <div>
                  <h4 className="text-md font-extrabold text-slate-800">길 찾기용 내 위치 공유 (위치)</h4>
                  <p className="text-xs text-slate-400 mt-0.5">환자님이 계신 위치를 보호자가 확인합니다.</p>
                </div>
              </div>

              <div className="flex gap-4 items-center p-4 bg-white rounded-2xl border-2 border-slate-100 shadow-sm text-left">
                <div className="p-3.5 bg-teal-50 text-teal-600 rounded-2l font-black text-xl">
                  2
                </div>
                <div>
                  <h4 className="text-md font-extrabold text-slate-800">보호자에게 자동 전화걸기 (전화)</h4>
                  <p className="text-xs text-slate-400 mt-0.5">어렵게 번호를 찾지 않아도 즉각 통화가 연결됩니다.</p>
                </div>
              </div>

              <div className="flex gap-4 items-center p-4 bg-white rounded-2xl border-2 border-slate-100 shadow-sm text-left">
                <div className="p-3.5 bg-amber-50 text-amber-600 rounded-2l font-black text-xl">
                  3
                </div>
                <div>
                  <h4 className="text-md font-extrabold text-slate-800">돌봄 알림 소리 켜기 (푸시 알림)</h4>
                  <p className="text-xs text-slate-400 mt-0.5">약 드실 시간 등을 알려주는 예쁜 알림 소리입니다.</p>
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
          <motion.div key="p-step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-center text-amber-800 font-bold text-xs flex items-center justify-center gap-1.5">
              <HelpCircle className="w-4 h-4 animate-bounce" />
              연습하기: 아래 3가지 버튼 중 하나를 클릭해 체험해 보세요!
            </div>

            <h4 className="text-xl font-bold text-slate-800 text-center">
              가장 위급할 때 쓰는 3가지 신속 단추
            </h4>

            {/* Simulated Patient 3-button layout */}
            <div className="space-y-3.5 py-2">
              <button
                type="button"
                onClick={() => alert("[실행 연습] '집으로 가기'를 클릭하셨습니다. 집 주소까지 가장 편안히 돌아가실 수 있는 버스노선과 도보 가이드가 큰 글씨 지도로 켜지게 됩니다.")}
                className="w-full py-4 text-center text-teal-800 font-black text-xl bg-teal-100 hover:bg-teal-200 rounded-2xl shadow-sm border border-teal-200 block transition-all"
              >
                🏠 집으로 가는 안전한 길 찾기
              </button>

              <button
                type="button"
                onClick={() => alert("[실행 연습] '가족에게 전화'를 클릭하셨습니다. 첫 번째 긴급통화 연결망 '김태진(아들)'님과의 핫라인 전화 호출이 즉각 작동합니다.")}
                className="w-full py-4 text-center text-sky-800 font-black text-xl bg-sky-100 hover:bg-sky-200 rounded-2xl shadow-sm border border-sky-200 block transition-all"
              >
                📞 내 보호자(가족)에게 바로 전화
              </button>

              <button
                type="button"
                onClick={() => alert("[실행 연습] '도와주세요' 비상신호가 보호자 휴대폰 및 119 정밀 GPS 구조 알림 센터로 모의 즉시 긴급 전송됩니다.")}
                className="w-full py-4 text-center text-white font-black text-xl bg-gradient-to-r from-red-500 to-amber-600 hover:brightness-110 rounded-2xl shadow-md border-2 border-red-400 block transition-all animate-pulse"
              >
                🚨 주위 도움 요청하기 (정밀 GPS 공유)
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
    <div className="w-full max-w-md mx-auto h-[780px] bg-white flex flex-col justify-between overflow-hidden relative shadow-2xl rounded-3xl border border-slate-100">
      
      {/* Dynamic Header */}
      <div className="px-6 pt-5 bg-gradient-to-b from-teal-50 to-white flex-shrink-0">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-1.5">
            <Heart className="w-4.5 h-4.5 text-teal-600 fill-teal-100" />
            <span className="text-xs font-black text-slate-800">기억ON 온보딩</span>
            <span className={`text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded ${
              role === "GUARDIAN" ? "bg-teal-100 text-teal-800" : "bg-amber-100 text-amber-800"
            }`}>
              {role === "GUARDIAN" ? "보호자 등록용" : "환자 본인용"}
            </span>
          </div>
          <span className="text-[11px] font-bold text-slate-400">
            {step + 1} / {total} 단계
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-2">
          <motion.div 
            initial={{ width: "0%" }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ ease: "easeInOut" }}
            className={`h-full ${role === "GUARDIAN" ? "bg-teal-500" : "bg-amber-500"}`}
          />
        </div>
      </div>

      {/* Onboarding Main Sliding Panel */}
      <div className="flex-1 px-7 py-4 overflow-y-auto">
        <AnimatePresence mode="wait">
          {role === "GUARDIAN" ? renderGuardianStep() : renderPatientStep()}
        </AnimatePresence>
      </div>

      {/* Dynamic Navigation Footer */}
      <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3.5 flex-shrink-0">
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
              : role === "GUARDIAN" ? "bg-teal-600 hover:bg-teal-700 text-white" : "bg-amber-500 hover:bg-amber-600 text-white"
          }`}
        >
          {step === total - 1 ? (
            role === "GUARDIAN" ? "가입 완료 및 가동하기 🎉" : "가입 완료 및 가동하기 🥳"
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
