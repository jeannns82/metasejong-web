const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { OpenAI } = require('openai');

const app = express();
const port = process.env.PORT || 3000;

// 미들웨어 등록
// 프론트엔드(localhost:8080 및 metasejong.kr)에서 들어오는 요청을 허용하기 위한 설정
app.use(cors()); 
app.use(express.json()); // JSON 데이터를 편하게 파싱

// OpenAI 객체 생성 (.env 파일에서 자동으로 OPENAI_API_KEY를 가져옵니다)
const openai = new OpenAI(); 

// 클라이언트 쪽에서 호출할 챗봇 API 엔드포인트
app.post('/api/chat', async (req, res) => {
    try {
        const { messages, currentPersona } = req.body;
        
        // 예외 처리 1: API 키를 아직 입력하지 않은 경우 (가짜 응답 안전망)
        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "여기에_비밀키를_입력하세요") {
            const dummyMsg = currentPersona === 'king' 
                ? "허허, 서버는 세팅되었지만 아직 `.env` 파일에 비밀키(OPENAI_API_KEY)가 비어있구려!" 
                : "요 맥썹노이즈! 서버는 켜졌는데 \`.env\` 파일에 API 키가 텅 비어있어 브로!";
            return res.status(200).json({ content: dummyMsg });
        }

        // 실제 OpenAI 호츌
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: messages, // 시스템 프롬프트 + 유저 대화 히스토리
            temperature: 0.7,
            max_tokens: 300,
        });

        // 프론트엔드로 대답 넘겨주기
        res.json({ content: completion.choices[0].message.content });
        
    } catch (error) {
        console.error("OpenAI 서버 통신 에러:", error);
        res.status(500).json({ error: error.message, content: "통신 중 문제가 발생했어요. 관리자에게 문의해주세요." });
    }
});

app.listen(port, () => {
    console.log(`🚀 메타세종 백엔드 서버가 기동되었습니다! http://localhost:${port}`);
    console.log(`🤖 OpenAI API 키 상태: ${process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== '여기에_비밀키를_입력하세요' ? '연결 가능 🟢' : '미연결 🔴'}`);
});
