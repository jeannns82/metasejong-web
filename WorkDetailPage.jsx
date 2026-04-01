import React, { useState, useEffect } from 'react';

// 상품 데이터 베이스 (실제 환경에서는 API를 통해 가져옵니다)
const worksData = [
    {
        id: 1,
        title: "세종, 우주를 품다",
        subtitle: "전통과 현대의 조화로운 미디어 아트",
        description: "훈민정음의 창제 원리와 동양의 우주관을 현대적인 미디어 아트로 재해석한 작품입니다. 빛과 소리의 상호작용을 통해 관람객에게 몰입감 있는 경험을 제공하며, 세종대왕의 애민 정신을 시각적으로 아름답게 풀어냈습니다.",
        images: [
            "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=800&h=800",
            "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800&h=800",
            "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?auto=format&fit=crop&q=80&w=800&h=800",
            "https://images.unsplash.com/photo-1550684848-70138c26bb94?auto=format&fit=crop&q=80&w=800&h=800"
        ],
        thumbnail: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=400&h=400"
    },
    {
        id: 2,
        title: "빛의 궤적",
        subtitle: "조선의 천문학, 디지털로 피어나다",
        description: "혼천의와 자격루에서 영감을 받아 시간의 흐름을 시각화한 제너레이티브 아트입니다. 정밀하게 계산된 모션 그래픽이 여백 위를 흐르며 과거와 현재가 교차하는 신비롭고 차분한 경험을 선사합니다.",
        images: [
            "https://images.unsplash.com/photo-1518640467707-6811f4a18018?auto=format&fit=crop&q=80&w=800&h=800",
            "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&q=80&w=800&h=800",
            "https://images.unsplash.com/photo-1506744626753-1fa28f6731e6?auto=format&fit=crop&q=80&w=800&h=800",
            "https://images.unsplash.com/photo-1518640467707-6811f4a18018?auto=format&fit=crop&q=80&w=800&h=800"
        ],
        thumbnail: "https://images.unsplash.com/photo-1518640467707-6811f4a18018?auto=format&fit=crop&q=80&w=400&h=400"
    },
    {
        id: 3,
        title: "먹의 숨결",
        subtitle: "디지털 캔버스에 퍼지는 수묵의 향연",
        description: "전통 수묵화의 번짐 효과를 디지털 알고리즘으로 구현했습니다. 흑과 백의 강렬한 대비 속에 청록색 포인트가 자연스럽게 어우러지며, 동양적인 여백의 미를 덜어냄의 미학으로 극대화한 작품입니다.",
        images: [
            "https://images.unsplash.com/photo-1615184697985-c9bde1b07da7?auto=format&fit=crop&q=80&w=800&h=800",
            "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=800&h=800",
            "https://images.unsplash.com/photo-1544256718-3b1df2eb2825?auto=format&fit=crop&q=80&w=800&h=800",
            "https://images.unsplash.com/photo-1615184697985-c9bde1b07da7?auto=format&fit=crop&q=80&w=800&h=800"
        ],
        thumbnail: "https://images.unsplash.com/photo-1615184697985-c9bde1b07da7?auto=format&fit=crop&q=80&w=400&h=400"
    },
    {
        id: 4,
        title: "시간의 결",
        subtitle: "자연이 빚어낸 영원한 순환",
        description: "사계절의 변화와 자연의 순환을 감각적인 영상 언어로 표현했습니다. 부드러운 페이드 효과와 함께 서서히 변하는 색채의 스펙트럼은 바쁜 현대인들에게 시각적인 휴식과 명상의 시간을 제공합니다.",
        images: [
            "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800&h=800",
            "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&q=80&w=800&h=800",
            "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=800&h=800",
            "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800&h=800"
        ],
        thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400&h=400"
    }
];

export default function WorkDetailPage() {
    const [selectedItem, setSelectedItem] = useState(worksData[0]);
    const [isFading, setIsFading] = useState(false);

    // 썸네일 클릭 시 상세 아이템을 부드럽게 교체하는 핸들러
    const handleSelectItem = (item) => {
        if (item.id === selectedItem.id) return;

        setIsFading(true);

        // Tailwind의 transition-opacity duration (300ms)에 맞춤
        setTimeout(() => {
            setSelectedItem(item);
            setIsFading(false);
        }, 300);
    };

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-teal-600 selection:text-white pb-24 md:pb-32">
            {/* 
        Tailwind CSS에 Pretendard 폰트를 설정해야 합니다.
        tailwind.config.js 예시: theme.fontFamily.sans = ['Pretendard', 'sans-serif']
      */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-10">

                {/* =========================================
            상단 상세 섹션 (Top Detail Section)
        ========================================= */}
                <section
                    className={`transition-opacity duration-300 ease-in-out ${isFading ? 'opacity-0' : 'opacity-100'
                        }`}
                >
                    {/* 모바일 1열 / 데스크탑 2열 레이아웃 */}
                    <div className="flex flex-col md:flex-row gap-12 lg:gap-24">

                        {/* 좌측 텍스트 영역 */}
                        <div className="w-full md:w-[45%] lg:w-[40%] flex flex-col justify-center">
                            <div className="mb-4">
                                <span className="inline-block px-3 py-1 bg-gray-50 text-teal-600 text-xs font-semibold tracking-widest uppercase rounded-full border border-gray-100">
                                    Selected Work
                                </span>
                            </div>

                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-gray-900 mb-4 leading-snug break-keep">
                                {selectedItem.title}
                            </h2>

                            <p className="text-lg md:text-xl text-teal-700 font-medium mb-8 break-keep">
                                {selectedItem.subtitle}
                            </p>

                            <div className="w-12 h-px bg-gray-200 mb-8"></div>

                            <p className="text-gray-500 font-light leading-[1.8] text-base md:text-lg break-keep">
                                {selectedItem.description}
                            </p>
                        </div>

                        {/* 우측 2x2 이미지 그리드 */}
                        <div className="w-full md:w-[55%] lg:w-[60%]">
                            <div className="grid grid-cols-2 gap-3 md:gap-5">
                                {selectedItem.images.map((image, index) => (
                                    <div
                                        key={`${selectedItem.id}-img-${index}`}
                                        className="relative aspect-square overflow-hidden bg-gray-100 rounded-lg group"
                                    >
                                        <img
                                            src={image}
                                            alt={`${selectedItem.title} 상세 이미지 ${index + 1}`}
                                            className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] hover:scale-105"
                                            loading="lazy"
                                        />
                                        {/* 이미지 오버레이 (옵션: 선택적으로 우아한 느낌을 더해줌) */}
                                        <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 mix-blend-multiply pointer-events-none"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </section>

                {/* =========================================
            하단 카드 리스트 섹션 (Bottom List Section)
        ========================================= */}
                <section className="mt-28 md:mt-40">
                    <div className="mb-8 flex items-center justify-between border-b border-gray-100 pb-4">
                        <h3 className="text-sm font-semibold tracking-[0.2em] text-gray-400 uppercase">
                            Explore More
                        </h3>
                    </div>

                    {/* 가로 스크롤 영역 (스크롤바 숨김 처리 포함) */}
                    <div className="flex gap-6 overflow-x-auto pb-10 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {worksData.map((item) => {
                            const isSelected = selectedItem.id === item.id;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleSelectItem(item)}
                                    className="group flex-none w-64 md:w-72 lg:w-80 text-left snap-start outline-none"
                                    aria-pressed={isSelected}
                                >
                                    <div
                                        className={`aspect-[4/3] w-full mb-5 overflow-hidden rounded-xl transition-all duration-300 ease-out ${isSelected
                                                ? 'ring-2 ring-teal-600 ring-offset-4 ring-offset-white'
                                                : 'ring-1 ring-gray-200 hover:ring-gray-300'
                                            }`}
                                    >
                                        <img
                                            src={item.thumbnail}
                                            alt={item.title}
                                            className={`w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${isSelected ? 'scale-100' : 'group-hover:scale-105'
                                                }`}
                                        />
                                    </div>

                                    <h4 className={`text-xl transition-colors duration-300 mb-1.5 ${isSelected ? 'text-teal-600 font-semibold' : 'text-gray-900 font-medium group-hover:text-teal-600'
                                        }`}
                                    >
                                        {item.title}
                                    </h4>
                                    <p className="text-sm text-gray-500 font-light truncate">
                                        {item.subtitle}
                                    </p>
                                </button>
                            );
                        })}
                    </div>
                </section>

            </div>
        </div>
    );
}
