import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini Client safely
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn("Waring: GEMINI_API_KEY is not defined in the environment.");
}

// -------------------------------------------------------------
// SECURE GEMINI SERVER-SIDE API ROUTES
// -------------------------------------------------------------

// 1. AI Daily Summary ("AI 하루 요약")
app.post("/api/gemini/summary", async (req, res) => {
  try {
    if (!ai) {
      return res.status(500).json({ 
        error: "Gemini API client is not initialized. Please verify your GEMINI_API_KEY secret." 
      });
    }

    const { patientName, location, safeZoneStatus, lastMedication, checklistDone, customNote } = req.body;

    const prompt = `치매 환자 보호자를 위한 '인공지능 하루 요약(AI Daily Summary)'을 작성해 주세요. 
친절하고 따뜻하며, 전문적이고 안도감을 주는 요양 전문가의 어조(한국어)로 작성해 주세요.

환자 정보:
- 이름: ${patientName || "환자"}
- 현재 위치 및 상태: ${location || "정보 없음"} (안전구역 내 여부: ${safeZoneStatus ? "안전구역 내" : "이탈 여부 확인 필요"})
- 최근 약 복용 완료: ${lastMedication || "입력 없음"}
- 완료된 일과/돌봄 체크리스트: ${checklistDone ? checklistDone.join(", ") : "진행 안 됨"}
- 보호자 참고 메모: ${customNote || "없음"}

가상의 돌봄 일지 데이터를 바탕으로 다음 구조로 정갈한 마크다운 형태의 피드백을 주세요:
1) **오늘 환자 상태 총평** (한눈에 보는 따뜻한 진단 및 위로)
2) **안전 및 식사/복약 모니터링** (오늘 무사했던 부분과 복약 체크 상황에 대한 정리)
3) **보호자를 위한 전문 제안** (환자의 현재 인지/신체 컨디션을 고려해 보호자가 오늘 밤이나 내일 해주면 좋을 이야기 또는 놀이 제안)

마크다운 형식으로 자연스러운 문단 구성을 사용해 600자 이내로 간결히 답해 주세요.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini summary error:", error);
    res.status(500).json({ error: error.message || "AI 요약을 생성하는 중에 오류가 발생했습니다." });
  }
});

// 2. AI Recall Memory Cards ("AI 회상 설명 생성 및 음성 안내용 정형 가이드")
app.post("/api/gemini/recall", async (req, res) => {
  try {
    if (!ai) {
      return res.status(500).json({ 
        error: "Gemini API client is not initialized. Please configure your API key." 
      });
    }

    const { relation, personName, context, imageUrl } = req.body;

    const prompt = `치매 환자가 가족 사진 또는 과거 사진을 보면서 마음의 안정을 찾고 과거의 긍정적인 감정을 이끌어낼 수 있도록 돕는 따뜻한 'AI 추억 회상 안내 문구'를 작성해 주세요. 
이 문구는 환자가 스마트폰 스마트 스피커나 화면을 통해 듣게 될 '친근하고 다정한 나레이션'과 '보호자 맞춤 가이드'입니다.

보호자가 등록한 사진 정보:
- 사진 속 주인공 대표 인물: ${personName || "가족"}
- 환자와의 관계: ${relation || "가족"}
- 추억 설명: ${context || "다정하게 웃고 있는 모습"}

지침:
1. **나레이션 문구**: 치매 환자를 호칭할 때는 "어머님/아버님" 또는 부드럽게 "정겨운 호칭"을 사용하되 다정하고 천천히 타이르는 투여야 합니다. 
   - 예시: "기억나시나요? 지난 봄, 어여쁜 꽃밭에서 손을 꼭 쥐고 환하게 웃고 계시던 분... 바로 아버님의 든든한 아들 철수랍니다."
2. **보호자가 읽어줄 팁**: 보호자가 이 카드를 보여줄 때 어떤 질문을 던지고 어떤 대화를 유도해야 할지 간결하게 30자 팁을 하나 적어주세요.

응답 형식은 다음과 같은 JSON 형식이어야 합니다:
{
  "speechText": "나레이션 문구 (텍스트)",
  "promptTips": "보호자가 유도하기 좋은 대화형 질문 팁"
}

반드시 위 JSON 필드 형식을 지켜주시고, 마크다운 코드 블록(\`\`\`json ...) 없이 원시 JSON 문자열로만 응답해 주세요.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.8,
      }
    });

    const text = response.text || "{}";
    let jsonData = { speechText: "", promptTips: "" };
    try {
      jsonData = JSON.parse(text);
    } catch {
      jsonData = { 
        speechText: `기억나시나요? 당신 곁에서 항상 웃음이 끊이지 않는 당신의 사랑하는 가족 ${personName}(${relation})입니다. 봄날의 꽃처럼 아름다운 사진 속에서 여러분의 소중한 인연이 빛나고 있습니다.`,
        promptTips: `"${personName}와 함께 찍었을 때 날씨가 어땠는지 물어보며 기억 유도하기"`
      };
    }

    res.json(jsonData);
  } catch (error: any) {
    console.error("Gemini recall error:", error);
    res.status(500).json({ error: error.message || "AI 회상 문구를 생성하는 중에 오류가 발생했습니다." });
  }
});

// -------------------------------------------------------------
// VITE OR STATIC FILE SERVING
// -------------------------------------------------------------
async function initializeServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

initializeServer().catch((err) => {
  console.error("Failed to start server", err);
});
