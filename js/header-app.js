(function initHeaderAppButton() {
    const APP_URL = 'https://hangulart.app';
    const header = document.querySelector('body > header');
    const nav = header?.querySelector('nav');
    const navList = nav?.querySelector('ul');
    const headerInner = header?.querySelector(':scope > div');

    if (!header || !nav || !navList || !headerInner || nav.querySelector('.nav-app-button')) return;

    const createAppLink = (extraClass = '') => {
        const link = document.createElement('a');
        link.className = `nav-app-button ${extraClass}`.trim();
        link.href = APP_URL;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.setAttribute('aria-label', 'HangulArt App 열기');
        link.textContent = 'App';
        return link;
    };

    const listItem = document.createElement('li');
    listItem.className = 'nav-app-list-item';
    listItem.append(createAppLink());
    navList.append(listItem);

    headerInner.append(createAppLink('nav-app-button--mobile'));
})();
