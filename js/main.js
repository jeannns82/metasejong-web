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
        projectDiv.className = 'flex flex-col gap-6 group cursor-default';

        // 링크가 외부 주소인지 확인하여 target="_blank" 여부 결정
        const isExternal = item.link && item.link.startsWith('http');
        const targetAttr = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';

        const wrapperStart = item.link ? `<a href="${item.link}"${targetAttr} class="block border-none">` : `<div class="block">`;
        const wrapperEnd = item.link ? `</a>` : `</div>`;

        projectDiv.className = 'flex flex-col group cursor-pointer';

        projectDiv.innerHTML = `
            ${wrapperStart}
                <div class="w-full bg-transparent overflow-hidden relative tilt-container group-hover:shadow-[0_10px_40px_rgba(0,0,0,0.15)] transition-shadow duration-700" style="perspective: 1000px;">
                    <!-- Foreground Transparent Thumbnail -->
                    <img src="${item.image}" alt="${item.title}" class="w-full aspect-video object-cover relative z-10 tilt-img" style="transform: scale(1.02) rotateX(0deg) rotateY(0deg); transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);">
                    <!-- Gradient Overlay (Fade in on hover) -->
                    <div class="absolute inset-0 z-20 opacity-0 bg-gradient-to-tr from-[#22d3ee] via-[#c084fc] to-[#60a5fa] tilt-overlay pointer-events-none mix-blend-color" style="transform: scale(1.02) rotateX(0deg) rotateY(0deg); transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.6s ease-in-out;"></div>
                    <!-- Pixel Art Character (Animated on hover) -->
                    <img src="images/pixel_sejong.png" alt="Pixel Sejong" class="pixel-character">
                </div>
                <div class="text-center mt-6 px-4">
                    <h3 class="text-sm font-bold tracking-[0.15em] text-gray-900 uppercase mb-2 group-hover:text-gray-600 transition-colors">${item.title}</h3>
                    <p class="text-[13px] text-gray-500 font-light leading-relaxed line-clamp-2">${item.description}</p>
                </div>
            ${wrapperEnd}
        `;

        const containerElement = projectDiv.querySelector('.tilt-container');
        const imgElement = projectDiv.querySelector('.tilt-img');
        const overlayElement = projectDiv.querySelector('.tilt-overlay');

        if (containerElement && imgElement && overlayElement) {
            containerElement.addEventListener('mousemove', (e) => {
                const rect = containerElement.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                // Max rotation: 3 degrees
                const rotateX = ((y - centerY) / centerY) * -3;
                const rotateY = ((x - centerX) / centerX) * 3;

                // Adjust tilt
                const transformValue = `scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                imgElement.style.transform = transformValue;
                imgElement.style.transition = 'transform 0.1s ease-out';

                overlayElement.style.transform = transformValue;
                overlayElement.style.transition = 'transform 0.1s ease-out';
            });

            containerElement.addEventListener('mouseleave', () => {
                // Return to origin and clear overlay
                const transformValue = `scale(1.02) rotateX(0deg) rotateY(0deg)`;

                imgElement.style.transform = transformValue;
                imgElement.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

                overlayElement.style.transform = transformValue;
                overlayElement.style.opacity = '0';
                overlayElement.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.6s ease-in-out';
            });

            containerElement.addEventListener('mouseenter', () => {
                // Fade in gradient overlay
                overlayElement.style.opacity = '1';
                overlayElement.style.transition = 'transform 0.3s ease-out, opacity 0.6s ease-in-out';
                imgElement.style.transition = 'transform 0.3s ease-out';
            });
        }

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

    publicationData.forEach((item, index) => {
        const card = document.createElement('div');
        // Layout: Vertical on mobile, Horizontal on desktop
        // Using a card UI with background, padding, squared corners, and shadow.
        // Added entrance animation (animate-fade-in-up) and lift effect (-translate-y-2) on hover
        card.className = 'flex flex-col md:flex-row gap-6 md:gap-10 p-6 md:p-8 mb-8 bg-white border border-gray-100 rounded-none shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1.5 group opacity-0 translate-y-4';

        // Add animation delay style for staggered effect
        card.style.animation = `fadeInUp 0.8s ease-out forwards ${index * 0.15}s`;

        // Tags Generation
        const tagsHtml = item.tags.map(tag =>
            `<span class="inline-block px-3 py-1 rounded-full border border-gray-300 text-xs text-gray-500 font-medium">${tag}</span>`
        ).join('');

        const imageContent = item.link
            ? `<a href="${item.link}" target="_blank" rel="noopener noreferrer" class="block w-full h-full"><img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500"></a>`
            : `<img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500">`;

        const titleContent = item.link
            ? `<a href="${item.link}" target="_blank" rel="noopener noreferrer" class="hover:underline">${item.title}</a>`
            : item.title;

        card.innerHTML = `
            <!-- Image Area: Fixed width on desktop, full on mobile. Aspect ratio 3/4 -->
            <div class="w-full md:w-[240px] flex-shrink-0">
                <div class="aspect-[3/4] w-full h-full overflow-hidden rounded-none shadow-sm bg-gray-100 relative">
                    ${imageContent}
                </div>
            </div>

            <!-- Content Area -->
            <div class="flex-1 flex flex-col pt-1 md:pt-2">
                <!-- Top Line: Title & Price -->
                <div class="flex flex-col md:flex-row md:justify-between md:items-start mb-2 gap-1">
                    <h3 class="text-2xl font-bold text-gray-900 tracking-tight leading-tight">${titleContent}</h3>
                    <span class="text-lg font-bold text-gray-800 md:text-right flex-shrink-0">${item.price}</span>
                </div>

                <!-- Meta Info -->
                <div class="text-sm text-gray-500 mb-5 font-medium">
                    <span>${item.author} · ${item.publisher}</span>
                    <span class="mx-2 text-gray-300">|</span>
                    <span>${item.date}</span>
                </div>

                <!-- Tags -->
                <div class="flex flex-wrap gap-2 mb-5">
                    ${tagsHtml}
                </div>

                <!-- Summary -->
                <div class="text-gray-700 leading-[1.6] text-[15px] md:text-base font-light text-justify break-keep">
                    ${item.summary}
                </div>
            </div>
        `;
        pubList.appendChild(card);
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
