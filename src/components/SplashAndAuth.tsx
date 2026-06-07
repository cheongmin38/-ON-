/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Heart, Shield, ArrowRight, Phone, User, CheckCircle2, 
  ChevronRight, Bell, Navigation, PhoneCall, Camera, Eye, EyeOff, Key 
} from "lucide-react";
import { UserRole } from "../types";

interface SplashAndAuthProps {
  onCompleteAuth: (role: UserRole, userInfo: { name: string; phone: string }) => void;
}

export default function SplashAndAuth({ onCompleteAuth }: SplashAndAuthProps) {
  const [screen, setScreen] = useState<"SPLASH" | "START" | "LOGIN" | "SIGNUP" | "FORGOT_PASSWORD" | "PERMISSIONS">("SPLASH");
  const [signUpRole, setSignUpRole] = useState<UserRole>("GUARDIAN");
  const [loginRole, setLoginRole] = useState<UserRole>("GUARDIAN");
  
  // Form States
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Forgot Password mock
  const [forgotPhone, setForgotPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [sentCode, setSentCode] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Auto transition from Splash to Start
  useEffect(() => {
    if (screen === "SPLASH") {
      const timer = setTimeout(() => {
        setScreen("START");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  // Handle Form Validations
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!name || !phone || !password || !confirmPassword) {
      setErrorMessage("모든 정보를 정확하게 입력해 주세요.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (password.length < 4) {
      setErrorMessage("비밀번호는 최소 4자리 이상이어야 합니다.");
      return;
    }

    setScreen("PERMISSIONS");
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!phone || !password) {
      setErrorMessage("휴대폰 번호와 비밀번호를 입력해 주세요.");
      return;
    }

    const userName = loginRole === "PATIENT" ? "이지원 (환자)" : "김태진 (보호자)";
    onCompleteAuth(loginRole, { name: userName, phone });
  };

  const handleSendCode = () => {
    if (!forgotPhone) {
      setErrorMessage("휴대폰 번호를 입력해 주세요.");
      return;
    }
    setSentCode(true);
    setErrorMessage("");
    alert("인증번호가 모의 발송되었습니다: [7295]");
  };

  const handleVerifyCode = () => {
    if (verificationCode === "7295") {
      setPasswordSuccess(true);
      setErrorMessage("");
    } else {
      setErrorMessage("인증번호 7295가 아닙니다. 다시 시도해 주세요.");
    }
  };

  const finishForgotPassword = () => {
    setScreen("LOGIN");
    setSentCode(false);
    setPasswordSuccess(false);
    setVerificationCode("");
    setNewPassword("");
  };

  const handlePermissionsCompleted = () => {
    onCompleteAuth(signUpRole, { name: name || "테스트 사용자", phone: phone || "010-1234-5678" });
  };

  return (
    <div className="w-full h-full md:max-w-md md:h-[90vh] md:max-h-[820px] md:my-auto md:rounded-3xl md:shadow-2xl md:border md:border-slate-200/50 bg-[#FAFAFB] flex flex-col justify-between overflow-hidden relative font-sans mx-auto">
      
      {/* 1. Splash Screen */}
      {screen === "SPLASH" && (
        <motion.div 
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-[#0F172A] flex flex-col items-center justify-center text-white z-50 p-6"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: [0.9, 1.02, 1], opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10"
          >
            <Heart className="w-10 h-10 text-[#3182f6] fill-[#3182f6]/25" />
          </motion.div>
          <motion.h1 
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl font-extrabold tracking-tight"
          >
            기억<span className="text-[#3182f6]">ON</span>
          </motion.h1>
          <motion.p 
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-slate-400 font-medium text-xs mt-3 tracking-widest text-center"
          >
            기억이 흐려져도, 안심은 선명하게
          </motion.p>
          <div className="absolute bottom-10 flex flex-col items-center gap-1 opacity-40">
            <Shield className="w-4 h-4 text-white animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest">Dementia Protection Service</span>
          </div>
        </motion.div>
      )}

      {/* 2. Start Screen */}
      {screen === "START" && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col p-8 justify-between bg-white"
        >
          <div className="flex-1 flex flex-col justify-center items-center text-center mt-8">
            <div className="w-16 h-16 bg-[#3182f6]/5 rounded-full flex items-center justify-center mb-6">
              <Heart className="w-8 h-8 text-[#3182f6]" />
            </div>
            <h2 className="text-3xl font-extrabold text-[#191F28] tracking-tight">기억ON</h2>
            <div className="h-1 w-6 bg-[#3182f6] rounded-full my-3"></div>
            <p className="text-[#4E5968] font-medium text-sm tracking-tight">
              기억이 흐려져도, 안심은 선명하게
            </p>
            <p className="text-xs text-slate-400 mt-2 px-6">
              실시간 치매 환자 안심 감지 및 인지 기억 통합 지원 케어
            </p>
          </div>

          <div className="space-y-3.5">
            <button 
              onClick={() => setScreen("LOGIN")}
              className="w-full py-4 px-6 bg-[#3182f6] hover:bg-[#1b64da] text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 text-sm shadow-xs"
            >
              로그인 <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => {
                setSignUpRole("GUARDIAN");
                setScreen("SIGNUP");
              }}
              className="w-full py-4 px-6 bg-[#F2F4F6] hover:bg-[#E5E8EB] text-[#4E5968] font-bold rounded-2xl transition-all text-sm text-center"
            >
              처음이신가요? 회원가입하기
            </button>
            <div className="text-center">
              <span className="text-[11px] text-slate-400">환자용 빠른 테스트: 아이디에 `0101`로 즉시 접속</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* 3. Login Screen */}
      {screen === "LOGIN" && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 flex flex-col p-8 justify-between bg-white"
        >
          <div>
            <div className="mt-4 mb-8">
              <h3 className="text-2xl font-extrabold text-[#191F28] tracking-tight">로그인</h3>
              <p className="text-xs text-slate-400 mt-1">기억ON 서비스를 시작합니다</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100">
                  {errorMessage}
                </div>
              )}

              {/* Login User Type Selector */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-500 block pl-1">로그인 대상</span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setLoginRole("GUARDIAN")}
                    className={`py-3 px-4 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all outline-none ${
                      loginRole === "GUARDIAN" 
                        ? "border-[#3182f6] bg-[#3182f6]/5 text-[#3182f6]" 
                        : "border-slate-100 bg-[#F2F4F6] text-slate-500 hover:bg-[#E5E8EB]"
                    }`}
                  >
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
                    보호자 로그인
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginRole("PATIENT")}
                    className={`py-3 px-4 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all outline-none ${
                      loginRole === "PATIENT"
                        ? "border-[#3182f6] bg-[#3182f6]/5 text-[#3182f6]"
                        : "border-slate-100 bg-[#F2F4F6] text-slate-500 hover:bg-[#E5E8EB]"
                    }`}
                  >
                    <User className="w-4 h-4 text-[#3182f6]" />
                    치매 환자 로그인
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 block pl-1">휴대폰 번호</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="tel"
                    placeholder="숫자만 입력해 주세요"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#F2F4F6] border-0 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#3182f6] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 block pl-1">비밀번호</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    placeholder="비밀번호(4자리 이상)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-[#F2F4F6] border-0 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#3182f6] transition-all"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button 
                  type="button"
                  onClick={() => setScreen("FORGOT_PASSWORD")}
                  className="text-xs text-[#3182f6] hover:underline font-semibold"
                >
                  비밀번호를 잊으셨나요?
                </button>
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-[#3182f6] hover:bg-[#1b64da] text-white font-bold rounded-xl transition-all mt-4 text-sm"
              >
                로그인 완료
              </button>
            </form>
          </div>

          <div className="border-t border-slate-100 pt-4 text-center">
            <span className="text-xs text-slate-400">아직 계정이 없으신가요? </span>
            <button 
              onClick={() => setScreen("SIGNUP")}
              className="text-xs text-[#3182f6] font-bold hover:underline pl-1"
            >
              회원가입하기
            </button>
          </div>
        </motion.div>
      )}

      {/* 4. SignUp Screen */}
      {screen === "SIGNUP" && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 flex flex-col p-8 justify-between overflow-y-auto bg-white"
        >
          <div>
            <div className="mt-2 mb-6">
              <h3 className="text-2xl font-extrabold text-[#191F28] tracking-tight">가입 양식</h3>
              <p className="text-xs text-slate-400 mt-1">안전을 지킬 준비를 시작합니다</p>
            </div>

            <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
              {errorMessage && (
                <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100">
                  {errorMessage}
                </div>
              )}

              {/* User Type Choice */}
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-600 block pl-1">사용자 가입 유형</span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSignUpRole("GUARDIAN")}
                    className={`py-3 px-4 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all ${
                      signUpRole === "GUARDIAN" 
                        ? "border-[#3182f6] bg-[#3182f6]/5 text-[#3182f6]" 
                        : "border-slate-100 bg-[#F2F4F6] text-slate-600"
                    }`}
                  >
                    <Heart className="w-4 h-4 text-rose-500" />
                    보호자 가입
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignUpRole("PATIENT")}
                    className={`py-3 px-4 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all ${
                      signUpRole === "PATIENT"
                        ? "border-[#3182f6] bg-[#3182f6]/5 text-[#3182f6]" 
                        : "border-slate-100 bg-[#F2F4F6] text-slate-600"
                    }`}
                  >
                    <User className="w-4 h-4 text-[#3182f6]" />
                    환자 본인 가입
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 block pl-1">이름</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text"
                    required
                    placeholder="실명을 입력해 주세요"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F2F4F6] border-0 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#3182f6] transform transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 block pl-1">휴대폰 번호</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="tel"
                    required
                    placeholder="숫자 기호 없이 입력 (아이디로 사용)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F2F4F6] border-0 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#3182f6] transform transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 block pl-1">비밀번호</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="password"
                    required
                    placeholder="4자리 이상 입력"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F2F4F6] border-0 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#3182f6] transform transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 block pl-1">비밀번호 확인</label>
                <div className="relative">
                  <CheckCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="password"
                    required
                    placeholder="비밀번호 확인"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F2F4F6] border-0 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#3182f6] transform transition-all"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-[#3182f6] hover:bg-[#1b64da] text-white font-bold rounded-xl transition-all text-sm shadow-xs mt-2"
              >
                회원가입 완료
              </button>
            </form>
          </div>

          <div className="text-center py-2">
            <button 
              onClick={() => setScreen("START")}
              className="text-xs text-slate-400 hover:underline"
            >
              처음 화면으로 돌아가기
            </button>
          </div>
        </motion.div>
      )}

      {/* 5. Password Find Screen */}
      {screen === "FORGOT_PASSWORD" && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col p-8 justify-between bg-white"
        >
          <div>
            <div className="mt-4 mb-8">
              <h3 className="text-2xl font-extrabold text-[#191F28] tracking-tight">비밀번호 찾기</h3>
              <p className="text-xs text-slate-400 mt-1">인증을 거쳐 비밀번호를 재설정합니다</p>
            </div>

            {!passwordSuccess ? (
              <div className="space-y-4">
                {errorMessage && (
                  <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100">
                    {errorMessage}
                  </div>
                )}

                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-600 block pl-1">등록된 휴대폰 번호</span>
                  <div className="flex gap-2">
                    <input 
                      type="tel"
                      placeholder="휴대폰 예) 01012345678"
                      value={forgotPhone}
                      onChange={(e) => setForgotPhone(e.target.value)}
                      className="flex-1 px-3 py-2.5 bg-[#F2F4F6] border-0 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#3182f6]"
                    />
                    <button 
                      onClick={handleSendCode}
                      className="px-4 py-2.5 bg-[#191F28] text-white text-xs font-bold rounded-xl hover:bg-slate-700 transition"
                    >
                      전송
                    </button>
                  </div>
                </div>

                {sentCode && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-1"
                  >
                    <span className="text-xs font-bold text-slate-600 block pl-1">인증번호 입력 (7295)</span>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        placeholder="4자리 숫자"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className="flex-1 px-3 py-2.5 bg-[#F2F4F6] border-0 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#3182f6]"
                      />
                      <button 
                        onClick={handleVerifyCode}
                        className="px-4 py-2.5 bg-[#3182f6] text-white text-xs font-bold rounded-xl hover:bg-[#1b64da] transition"
                      >
                        확인
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4 text-center py-6"
              >
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-800">새 비밀번호 입력</h4>
                <input 
                  type="password"
                  placeholder="새로운 비밀번호"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#F2F4F6] border-0 rounded-xl text-[#191F28] text-sm focus:outline-none"
                />
                <button 
                  onClick={finishForgotPassword}
                  className="w-full py-3.5 bg-[#3182f6] text-white text-sm font-bold rounded-xl hover:bg-[#1b64da] transition animate-pulse"
                >
                  변경하고 로그인하기
                </button>
              </motion.div>
            )}
          </div>

          <div className="text-center py-2">
            <button 
              onClick={() => setScreen("LOGIN")}
              className="text-xs text-slate-400 hover:underline"
            >
              로그인 화면으로 돌아가기
            </button>
          </div>
        </motion.div>
      )}

      {/* 6. System Permissions Approval Screen */}
      {screen === "PERMISSIONS" && (
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col p-8 justify-between bg-white"
        >
          <div>
            <div className="mt-2 mb-6">
              <span className="px-2.5 py-1 bg-[#3182f6]/10 text-[#3182f6] text-[11px] font-bold rounded-full">
                권한 안내
              </span>
              <h3 className="text-2xl font-extrabold text-[#191F28] tracking-tight mt-2">필수 권한 동의</h3>
              <p className="text-xs text-slate-400 mt-1">
                기억ON 서비스의 안전 감지와 긴급 전화를 지원하기 위해 다음 권한 설정이 필요합니다.
              </p>
            </div>

            <div className="space-y-4 text-slate-700 mt-4">
              <div className="flex gap-3.5 items-start p-3 bg-[#FAFAFB] rounded-xl border border-slate-100/60 shadow-xs">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg mt-0.5">
                  <Navigation className="w-4 h-4 fill-blue-500 text-blue-500" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">실시간 위치 권한 (필수)</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    안전구역 이탈 방지 감지 및 실시간 환자 위치 파악을 위해 필요합니다.
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5 items-start p-3 bg-[#FAFAFB] rounded-xl border border-slate-100/60 shadow-xs">
                <div className="p-2 bg-blue-50 text-[#3182f6] rounded-lg mt-0.5">
                  <Bell className="w-4 h-4 text-[#3182f6]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">푸시 알림 권한 (필수)</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    약 복용 알림, 비상상황 호출, 안전 영역 이탈 경보를 즉시 보호자에게 알립니다.
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5 items-start p-3 bg-[#FAFAFB] rounded-xl border border-slate-100/60 shadow-xs">
                <div className="p-2 bg-pink-50 text-pink-600 rounded-lg mt-0.5">
                  <PhoneCall className="w-4 h-4 text-pink-600" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">전화 걸기 권한 (필수)</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    환자의 비상상황 발생 시 지정된 보호자나 119에 자동으로 즉각 발신합니다.
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5 items-start p-3 bg-[#FAFAFB] rounded-xl border border-slate-100/60 shadow-xs">
                <div className="p-2 bg-violet-50 text-violet-600 rounded-lg mt-0.5">
                  <Camera className="w-4 h-4 text-violet-600" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">카메라 및 파일 업로드</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    환자 프로필 등록, 가족 사진 및 소중한 추억 사진의 기억 카드를 생성할 때 쓰입니다.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button 
            type="button"
            onClick={handlePermissionsCompleted}
            className="w-full py-4 bg-[#3182f6] hover:bg-[#1b64da] text-white font-bold rounded-2xl shadow-[#3182f6]/10 transition-all text-sm mb-2"
          >
            허용 및 시작하기
          </button>
        </motion.div>
      )}

    </div>
  );
}
