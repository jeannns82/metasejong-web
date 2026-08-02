document.addEventListener('DOMContentLoaded', () => {
    highlightActiveNav();
    renderWorks();
    renderIP();
    renderPublication();
    initHistoryAnimations();
    initHeroTypingAnimation();
});

function highlightActiveNav() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        // Update active state with Tailwind classes
        // Check if href matches the end of the path
        if (currentPath.endsWith(href) || (href === 'index.html' && (currentPath === '/' || currentPath.endsWith('/')))) {
            link.classList.add('text-gray-800', 'font-semibold');
            link.classList.remove('text-gray-500');
        } else {
            link.classList.remove('text-gray-800', 'font-semibold');
            link.classList.add('text-gray-500');
        }
    });
}

function renderWorks() {
    const worksList = document.getElementById('works-list');
    if (!worksList) return;

    worksData.forEach(item => {
        const projectDiv = document.createElement('div');
        projectDiv.className = 'work-card-item';

        const isExternal = item.link && item.link.startsWith('http');
        const targetAttr = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
        const wrapperStart = item.link
            ? `<a href="${item.link}"${targetAttr} class="work-card group">`
            : `<div class="work-card group">`;
        const wrapperEnd = item.link ? `</a>` : `</div>`;

        const visualContent = item.externalService ? `
                    <svg class="work-card-visual-art" viewBox="0 0 720 420" preserveAspectRatio="xMidYMid slice" role="img" aria-label="한글의 소리와 구조가 색과 형태로 생성되는 추상 그래픽">
                        <rect width="720" height="420" fill="#e8eeeb"/>
                        <g opacity=".38" stroke="#9baea9" stroke-width="1">
                            <path d="M0 72h720M0 210h720M0 348h720"/><path d="M116 0v420M360 0v420M604 0v420"/>
                        </g>
                        <g fill="none" stroke="#164e4a" stroke-width="7">
                            <path d="M-22 332L112 198h128v-120"/>
                            <circle cx="328" cy="212" r="92"/>
                            <path d="M415 184h104v-92h126"/>
                            <path d="M434 318c58-78 127-91 226-22"/>
                            <path d="M86 64h82v82H86z"/>
                        </g>
                        <g fill="#164e4a"><circle cx="112" cy="198" r="11"/><circle cx="240" cy="78" r="11"/><circle cx="519" cy="92" r="11"/><circle cx="660" cy="296" r="11"/></g>
                        <g><rect x="542" y="30" width="48" height="48" rx="5" fill="#70b7c6"/><rect x="600" y="30" width="48" height="48" rx="5" fill="#df8755"/><rect x="658" y="30" width="48" height="48" rx="5" fill="#d8c66f"/></g>
                        <path d="M0 388h174m314-274h49m-249 98h-45" stroke="#738c87" stroke-width="3" stroke-dasharray="8 10"/>
                        <path d="M270 265l58-106 58 106z" fill="#e8eeeb" stroke="#164e4a" stroke-width="7"/>
                    </svg>
        ` : item.visualType === 'book' ? `
                    <div class="work-card-book-cover" role="img" aria-label="AI 훈민정음 책 표지를 활용한 편집형 북 커버">
                        <div class="work-card-book-lines" aria-hidden="true"></div>
                        <div class="work-card-book-dot work-card-book-dot-one" aria-hidden="true"></div>
                        <div class="work-card-book-dot work-card-book-dot-two" aria-hidden="true"></div>
                        <img src="${item.image}" alt="AI 훈민정음 책 표지" class="work-card-book-spine" aria-hidden="true">
                        <img src="${item.image}" alt="AI 훈민정음 책 표지" class="work-card-book-image">
                    </div>
        ` : `
                    <img src="${item.image}" alt="${item.title}" class="work-card-image${item.visualClass ? ` ${item.visualClass}` : ''}">
        `;

        const linkArrow = item.link ? `<span class="work-card-arrow" aria-hidden="true">↗</span>` : '';

        projectDiv.innerHTML = `
            ${wrapperStart}
                <div class="work-card-visual${item.externalService ? ' work-card-visual-kcode' : ''}">
                    ${visualContent}
                </div>
                <div class="work-card-info">
                    <div class="work-card-meta">
                        <span class="work-card-label">${item.type}</span>
                        ${linkArrow}
                    </div>
                    <h3 class="work-card-title">${item.title}</h3>
                    <p class="work-card-description work-card-description-ko">${item.description}</p>
                    <p class="work-card-description work-card-description-en" lang="en">${item.descriptionEn}</p>
                </div>
            ${wrapperEnd}
        `;

        worksList.appendChild(projectDiv);
    });
}

function renderIP() {
    const ipList = document.getElementById('ip-list');
    if (!ipList) return;

    ipData.forEach(item => {
        const card = document.createElement('div');
        card.className = 'bg-gray-100 p-6 rounded-lg hover:-translate-y-1 transition duration-200';
        card.innerHTML = `
            <div class="card-content">
                <h3 class="font-bold text-lg mb-2">${item.title}</h3>
                <p class="text-sm text-gray-500">${item.description}</p>
            </div>
        `;
        ipList.appendChild(card);
    });
}

function renderPublication() {
    const pubList = document.getElementById('publication-list');
    if (!pubList) return;

    const priorityTitles = ['AI 훈민정음', '안녕, 낯선한글'];
    const publications = [...publicationData].sort((a, b) => {
        const aPriority = priorityTitles.indexOf(a.title);
        const bPriority = priorityTitles.indexOf(b.title);
        if (aPriority !== -1 || bPriority !== -1) {
            if (aPriority === -1) return 1;
            if (bPriority === -1) return -1;
            return aPriority - bPriority;
        }
        return publicationData.indexOf(a) - publicationData.indexOf(b);
    });

    publications.forEach((item, index) => {
        const entry = document.createElement('article');
        entry.className = `publication-entry${index % 2 === 1 ? ' is-reversed' : ''}`;

        const fullTitle = item.subtitle ? `${item.title} - ${item.subtitle}` : item.title;
        const cover = `<img src="${item.image}" alt="${fullTitle}" class="publication-cover" loading="lazy" decoding="async">`;
        const imageContent = item.link
            ? `<a href="${item.link}" target="_blank" rel="noopener noreferrer" class="publication-cover-link" aria-label="${fullTitle} 출판물 보기">${cover}</a>`
            : `<div class="publication-cover-link">${cover}</div>`;
        const linkContent = item.link
            ? `<a href="${item.link}" target="_blank" rel="noopener noreferrer" class="publication-link">View publication <span class="publication-link-arrow" aria-hidden="true">↗</span></a>`
            : '';
        const tags = item.tags.map(tag => `<span>${tag}</span>`).join('');
        const year = item.date ? item.date.slice(0, 4) : '';

        entry.innerHTML = `
            <div class="publication-visual">${imageContent}</div>
            <div class="publication-info">
                <p class="publication-book-label">BOOK${year ? ` · ${year}` : ''}</p>
                <div class="publication-title-group">
                    <h2 class="publication-title-main">${item.title}</h2>
                    ${item.subtitle ? `<p class="publication-title-sub">${item.subtitle}</p>` : ''}
                </div>
                <p class="publication-summary">${item.summary}</p>
                <dl class="publication-meta">
                    <div><dt>Author</dt><dd>${item.author}</dd></div>
                    <div><dt>Publisher</dt><dd>${item.publisher}</dd></div>
                    <div><dt>Published</dt><dd>${item.date}</dd></div>
                    <div><dt>Price</dt><dd>${item.price}</dd></div>
                </dl>
                <div class="publication-tags">${tags}</div>
                ${linkContent}
            </div>
        `;
        pubList.appendChild(entry);
    });
}

function initHistoryAnimations() {
    const historyItems = document.querySelectorAll('.history-item');
    const progressLine = document.getElementById('history-progress-line');

    if (historyItems.length === 0) return;

    // 1. Scroll Reveal Logic for Items
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px', // Trigger slightly before the item hits the bottom
        threshold: 0.1
    };

    const itemObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add classes to animate in
                entry.target.classList.remove('opacity-0', 'translate-y-8');
                entry.target.classList.add('opacity-100', 'translate-y-0');

                // Once animated, stop observing this item
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    historyItems.forEach(item => {
        itemObserver.observe(item);
    });

    // 2. Progress Line Logic based on scroll position within the history section
    if (progressLine) {
        const historySection = document.getElementById('history');
        if (!historySection) return;

        window.addEventListener('scroll', () => {
            const sectionRect = historySection.getBoundingClientRect();
            // Start filling when the top of the section comes into view (plus offset)
            const sectionTop = sectionRect.top;
            const sectionHeight = sectionRect.height;
            const windowHeight = window.innerHeight;

            // Calculate progress 0 to 1
            // Start when section top is at 80% of window height
            // End when section bottom is at 50% of window height
            const startPoint = windowHeight * 0.8;
            const endPoint = windowHeight * 0.5;

            let progress = 0;
            const scrolledPastStart = startPoint - sectionTop;
            const totalScrollable = sectionHeight - (startPoint - endPoint);

            if (scrolledPastStart > 0) {
                progress = Math.min(1, Math.max(0, scrolledPastStart / totalScrollable));
            }

            // Update line height percentage
            progressLine.style.height = `${(progress * 100)}%`;

            // Optional: light up the dots as the line reaches them
            historyItems.forEach((item) => {
                const dot = item.querySelector('.dot-indicator');
                const card = item.querySelector('.ml-16');
                if (!dot || !card) return;

                const textSpan = card.querySelector('span:last-child');

                const dotRect = dot.getBoundingClientRect();
                const lineRect = progressLine.getBoundingClientRect();

                if (lineRect.bottom >= dotRect.top + (dotRect.height / 2)) {
                    // Activate dot
                    dot.classList.add('bg-[#f472b6]', 'scale-125');
                    dot.classList.remove('bg-gray-300');
                } else {
                    // Deactivate dot
                    dot.classList.remove('bg-[#f472b6]', 'scale-125');
                    dot.classList.add('bg-gray-300');
                }
            });
        });
    }
}

function initHeroTypingAnimation() {
    const textElement = document.getElementById('hero-typing-text');
    const cursorElement = document.getElementById('hero-cursor');
    const statementContainer = document.getElementById('hero-statement');
    const stampIcon = document.getElementById('hero-icon');
    const interactiveImage = document.getElementById('interactive-hero-image');

    if (!textElement || !cursorElement) return;

    const textToType = '한글, 일상을 예술로 만들다';
    let charIndex = 0;

    // Clear text initially
    textElement.textContent = '';

    function typeChar() {
        if (charIndex < textToType.length) {
            textElement.textContent += textToType.charAt(charIndex);
            charIndex++;
            const typingDelay = Math.random() * 50 + 100;
            setTimeout(typeChar, typingDelay);
        } else {
            // Finished typing, keep cursor for a moment
            setTimeout(() => {
                cursorElement.style.display = 'none';

                // Fade out text and collapse container to slide image up
                setTimeout(() => {
                    const mainSection = document.getElementById('main');
                    if (mainSection) {
                        mainSection.classList.remove('pt-[40px]', 'md:pt-[140px]');
                        mainSection.classList.add('pt-[20px]', 'md:pt-[86px]');
                    }
                    if (statementContainer) {
                        statementContainer.style.opacity = '0';
                        statementContainer.style.maxHeight = '0px';
                        statementContainer.style.marginBottom = '0px';
                        statementContainer.style.paddingTop = '0px';
                        statementContainer.style.paddingBottom = '0px';
                        statementContainer.classList.remove('min-h-[60px]', '-mb-7', 'md:mb-[36px]');
                    }

                    // Trigger stamp icon animation after the text disappears and image starts sliding up
                    if (stampIcon) {
                        setTimeout(() => {
                            stampIcon.style.animation = 'stamp 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';
                        }, 500); // Trigger mid-slide
                    }

                }, 1500); // 1.5 seconds after typing finishes, text disappears

            }, 800);
        }
    }

    // Start typing after a short delay
    setTimeout(typeChar, 800);

    // Interactive Hover Effect on Main Image
    if (interactiveImage) {
        const imageWrapper = interactiveImage.parentElement;

        imageWrapper.addEventListener('mousemove', (e) => {
            const rect = imageWrapper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate rotation (max 2 degrees)
            const xOffset = ((x / rect.width) - 0.5) * 4;
            const yOffset = ((y / rect.height) - 0.5) * -4;

            interactiveImage.style.transform = `perspective(1000px) rotateY(${xOffset}deg) rotateX(${yOffset}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        imageWrapper.addEventListener('mouseleave', () => {
            interactiveImage.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)`;
        });
    }
}
