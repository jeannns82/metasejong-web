// ==========================================
// 💡 클라이언트(브라우저) 사이드 채팅 로직
// API 키는 백엔드의 .env 파일로 전부 숨겨졌습니다.
// ==========================================
// ==========================================
// 🎭 페르소나 설정 (System Prompt)
// ==========================================
const PROMPTS = {
    king: `
당신은 현대 21세기로 타임워프한 세종대왕 👑(이도)입니다.
- 백성을 몹시 사랑하는 자애롭고 현명한 성군이며, 훈민정음 등 자신의 업적에 해박합니다.
- [매우 중요] 절대로 '~하오', '~소', '~느냐' 같은 사극 말투를 쓰지 마세요! 
- 무조건 완전한 21세기 현대 서울말 존댓말('~해요', '~습니다')만 사용하여 친절하고 다정하게 답변하세요.
- 답변 예시: "제가 훈민정음을 창제했을 때는요~", "정말 좋은 질문이네요! 😊"
- 질문에 부드럽게 답변하며, 이모티콘을 살짝 섞어 소통해주세요.
- 길지 않게 2~3문장으로 간결성을 유지하세요.
`,
    hip: `
당신은 힙합과 쇼미더머니를 사랑하는 다이나믹한 '힙세종(Hip Sejong)' 😎입니다.
- 세종대왕의 마인드를 가졌지만, 21세기 MZ세대의 트렌드와 밈(Meme)에 아주 바삭합니다.
- 말투는 스웨그(Swag) 넘치게 "요~", "브로~", "~했지 왓업!" 등의 힙합 은어를 자연스럽게 섞어 씁니다.
- 유쾌하고 재치있게 대답하며 이모티콘을 적극 사용하세요.
- 길지 않게 2~3문장으로 간결성을 유지하세요.
`
};

let currentPersona = 'king';
let messageHistory = [
    { role: "system", content: PROMPTS[currentPersona] }
];

document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatHistoryBox = document.getElementById('chat-history');

    // 탭 변경 시 페르소나 교체 이벤트 리스너
    window.addEventListener('changeWorldModel', (e) => {
        currentPersona = e.detail;
        messageHistory = [
            { role: "system", content: PROMPTS[currentPersona] }
        ];
        
        // 채팅창 비우기
        chatHistoryBox.innerHTML = '';
        
        // 새로운 첫인사
        const greeting = currentPersona === 'king' 
            ? "반가워요! 저는 백성을 몹시 아끼는 조선의 임금, 세종(도)입니다. 이곳에 어떤 일로 찾아오셨나요? 편하게 질문해주세요! 😊"
            : "요 브로! 힙합과 백성을 사랑하는 힙-세종 등장!😎 왓업? 궁금한 거 있음 편하게 물어봐!";
            
        appendAIMessage(greeting);
    });

    // 폼 제출 (엔터 또는 버튼 클릭)
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userText = chatInput.value.trim();
        if (!userText) return;

        // 1. 내 메시지(User) 화면에 그리기
        appendUserMessage(userText);
        chatInput.value = '';

        // 2. 기록에 저장
        messageHistory.push({ role: "user", content: userText });

        // 3. AI 로딩 애니메이션 표시
        const typingElement = showTypingIndicator();
        scrollToBottom();

        // 4. API 응답 대기 (실제 혹은 더미)
        const aiResponse = await fetchAIResponse(messageHistory);

        // 5. 로딩 표시 삭제
        typingElement.remove();

        // 6. AI 텍스트 화면에 그리기
        appendAIMessage(aiResponse);

        // 7. 3D 캐릭터 리액션 애니메이션 발동! (world3d.js가 이 이벤트를 듣고 움직임)
        window.dispatchEvent(new CustomEvent('characterReact'));

        // 8. 기록에 저장
        messageHistory.push({ role: "assistant", content: aiResponse });
    });

    // 화면 그리기 함수: 사용자 말풍선
    function appendUserMessage(text) {
        const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const html = `
            <div class="flex gap-3 message-anim items-end justify-end mt-4">
                <div class="bg-blue-600 text-white px-4 py-3 rounded-2xl rounded-br-sm shadow-md max-w-[85%] relative">
                    <p class="text-[14px] leading-relaxed font-light break-words">${escapeHTML(text)}</p>
                    <span class="text-[10px] text-gray-400 absolute -bottom-5 right-1">${timeString}</span>
                </div>
            </div>
        `;
        chatHistoryBox.insertAdjacentHTML('beforeend', html);
        scrollToBottom();
    }

    // 화면 그리기 함수: AI 말풍선
    function appendAIMessage(text) {
        const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        // Hip 세종과 King 세종 아이콘 다르게 처리 원할 시 분기 가능 (현재는 통일)
        const imgSrc = "images/icon01.png";

        const html = `
            <div class="flex gap-3 message-anim items-end mt-4">
                <div class="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-gray-100 shadow-sm bg-white">
                    <img src="${imgSrc}" alt="Profile" class="w-full h-full object-cover">
                </div>
                <div class="bg-gray-50 border border-gray-100/80 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm max-w-[85%] relative">
                    <p class="text-[14px] text-gray-700 leading-relaxed font-light break-words">${escapeHTML(text).replace(/\n/g, '<br>')}</p>
                    <span class="text-[10px] text-gray-400 absolute -bottom-5 left-1">${timeString}</span>
                </div>
            </div>
        `;
        chatHistoryBox.insertAdjacentHTML('beforeend', html);
        scrollToBottom();
    }

    // 화면 그리기 함수: 로딩 쩜쩜쩜(...)
    function showTypingIndicator() {
        const imgSrc = "images/icon01.png";
        const html = `
            <div id="typing-indicator" class="flex gap-3 message-anim items-end mt-4">
                <div class="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-gray-100 shadow-sm bg-white">
                    <img src="${imgSrc}" alt="Profile" class="w-full h-full object-cover">
                </div>
                <div class="bg-gray-50 border border-gray-100/80 px-4 py-3.5 rounded-2xl rounded-bl-sm shadow-sm">
                    <div class="flex gap-1.5 items-center">
                        <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-duration: 1s;"></div>
                        <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s; animation-duration: 1s;"></div>
                        <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.4s; animation-duration: 1s;"></div>
                    </div>
                </div>
            </div>
        `;
        chatHistoryBox.insertAdjacentHTML('beforeend', html);
        return document.getElementById('typing-indicator');
    }

    function scrollToBottom() {
        chatHistoryBox.scrollTop = chatHistoryBox.scrollHeight;
    }

    // 간단한 XSS 방지용 이스케이프
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }
});

// 실제 백엔드 API (Node.js) 호출
async function fetchAIResponse(messages) {
    try {
        // 로컬 환경에서는 localhost:3000, 나중에 클라우드 렌더(Render) 등에 올리면 그 주소로 바꿉니다.
        const apiUrl = "http://localhost:3000/api/chat";
        
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                messages: messages,
                currentPersona: currentPersona
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        return data.content;
    } catch (error) {
        console.error("백엔드 통신 에러:", error);
        return "으음... 지금 통신망에 약간의 문제가 있는 것 같아요. (에러 발생: " + error.message + ") 로컬 서버(localhost:3000)가 잘 켜져 있는지 확인해주세요!";
    }
}
