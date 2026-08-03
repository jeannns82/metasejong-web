(function initHeaderNavigation() {
    const APP_URL = 'https://hangulart.app';
    const header = document.querySelector('body > header');
    const desktopNav = header?.querySelector('nav');
    const navList = desktopNav?.querySelector('ul');
    const headerInner = header?.querySelector(':scope > div');

    if (!header || !desktopNav || !navList || !headerInner || header.querySelector('.mobile-menu-toggle')) return;

    desktopNav.classList.add('site-nav--desktop');

    const createAppLink = () => {
        const link = document.createElement('a');
        link.className = 'nav-app-button';
        link.href = APP_URL;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.setAttribute('aria-label', 'HangulArt App 열기');
        link.textContent = 'App';
        return link;
    };

    const appListItem = document.createElement('li');
    appListItem.className = 'nav-app-list-item';
    appListItem.append(createAppLink());
    navList.append(appListItem);

    const toggle = document.createElement('button');
    toggle.className = 'mobile-menu-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-label', '메뉴 열기');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'mobile-navigation');
    toggle.innerHTML = '<span aria-hidden="true"></span><span aria-hidden="true"></span>';

    const mobileNav = document.createElement('nav');
    mobileNav.id = 'mobile-navigation';
    mobileNav.className = 'mobile-navigation';
    mobileNav.setAttribute('aria-label', '모바일 메뉴');
    mobileNav.hidden = true;

    const mobileList = document.createElement('ul');
    [...navList.querySelectorAll('a')].forEach(sourceLink => {
        const item = document.createElement('li');
        const link = sourceLink.cloneNode(true);
        const isApp = sourceLink.classList.contains('nav-app-button');
        link.className = `mobile-navigation__link${isApp ? ' mobile-navigation__app' : ''}`;
        item.append(link);
        mobileList.append(item);
    });
    mobileNav.append(mobileList);

    headerInner.append(toggle);
    header.append(mobileNav);

    const setOpen = open => {
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
        mobileNav.hidden = !open;
    };

    toggle.addEventListener('click', () => {
        setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    mobileNav.addEventListener('click', event => {
        if (event.target.closest('a')) setOpen(false);
    });

    document.addEventListener('click', event => {
        if (toggle.getAttribute('aria-expanded') === 'true' && !header.contains(event.target)) setOpen(false);
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
            setOpen(false);
            toggle.focus();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth >= 769) setOpen(false);
    });
})();
