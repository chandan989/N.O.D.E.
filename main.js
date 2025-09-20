document.addEventListener('DOMContentLoaded', function() {
    const bootloader = document.getElementById('bootloader');
    const mainContent = document.getElementById('main-content');
    const bootLog = document.getElementById('boot-log');
    const loaderContainer = document.getElementById('loader-container');
    
    // Adjust loader width based on screen size
    let loaderWidth;
    if (window.innerWidth < 480) {
        loaderWidth = 15;
    } else if (window.innerWidth < 768) {
        loaderWidth = 25;
    } else {
        loaderWidth = 40;
    }

    const bootMessages = [
        { text: 'INITIATING N.O.D.E. PROTOCOL...', delay: 150 },
        { text: 'ESTABLISHING SECURE CONNECTION TO HEDERA NETWORK...', delay: 250 },
        { text: 'CONNECTION SECURE. <span class="text-glow">[OK]</span>', delay: 200 },
        { text: 'LOADING CORE DAEMONS...', delay: 100 },
        { text: '  &gt; GHOST_PAYMENTS.DLL... <span style="color: var(--secondary-color);">LOADED</span>', delay: 150 },
        { text: '  &gt; COLLECTIVE_ASSETS.SYS... <span style="color: var(--secondary-color);">LOADED</span>', delay: 150 },
        { text: '  &gt; AUTONOMOUS_VAULT.BAT... <span style="color: var(--secondary-color);">LOADED</span>', delay: 150 },
        { text: 'ALL SYSTEMS NOMINAL.', delay: 200 },
        { text: 'WELCOME, OPERATOR.', delay: 350 }
    ];

    let messageIndex = 0;

    function showBootMessage() {
        if (messageIndex < bootMessages.length) {
            const p = document.createElement('p');
            p.innerHTML = `&gt; ${bootMessages[messageIndex].text}`;
            bootLog.appendChild(p);
            bootLog.scrollTop = bootLog.scrollHeight; // Auto-scroll

            // Update loader
            const progress = Math.round(((messageIndex + 1) / bootMessages.length) * loaderWidth);
            const bar = '[' + '#'.repeat(progress) + ' '.repeat(loaderWidth - progress) + ']';
            loaderContainer.textContent = `LOADING... ${bar} ${Math.round(((messageIndex + 1) / bootMessages.length) * 100)}%`;

            setTimeout(showBootMessage, bootMessages[messageIndex].delay);
            messageIndex++;
        } else {
             // Final loader update to 100%
            const bar = '[' + '#'.repeat(loaderWidth) + ']';
            loaderContainer.textContent = `LOAD COMPLETE. ${bar} 100%`;
            setTimeout(() => {
                // Fade out bootloader
                bootloader.style.opacity = '0';
                bootloader.addEventListener('transitionend', () => {
                    bootloader.style.display = 'none';
                });

                // Fade in main content
                mainContent.style.visibility = 'visible';
                mainContent.style.opacity = '1';
                setupScrollAnimation();
            }, 500);
        }
    }

    function typeWriter(element, text, n) {
        if (n < (text.length)) {
            element.innerHTML = text.substring(0, n + 1) + '<span class="blinking-cursor">█</span>';
            const typingSpeed = 20 + Math.random() * 20; // More natural typing speed
            setTimeout(function() {
                typeWriter(element, text, n + 1);
            }, typingSpeed);
        } else {
            element.innerHTML = text; // Remove cursor when done
        }
    }

    function setupScrollAnimation() {
        const elementsToType = document.querySelectorAll('[data-type-effect]');
        
        elementsToType.forEach(el => {
            const originalText = el.innerHTML.trim();
            el.setAttribute('data-original-text', originalText);
            el.innerHTML = '';
            el.style.visibility = 'hidden';
        });

        function isElementInViewport(el) {
            const rect = el.getBoundingClientRect();
            return rect.top <= (window.innerHeight || document.documentElement.clientHeight) - 50;
        }

        function checkElements() {
            elementsToType.forEach(el => {
                if (isElementInViewport(el) && !el.hasAttribute('data-typed')) {
                    el.setAttribute('data-typed', 'true');
                    el.style.visibility = 'visible';
                    const text = el.getAttribute('data-original-text');
                    typeWriter(el, text, 0);
                }
            });
        }

        setTimeout(() => {
            checkElements();
            window.addEventListener('scroll', checkElements);
        }, 200);
    }

    // Initial setup
    mainContent.style.opacity = '0';
    mainContent.style.visibility = 'hidden';
    bootloader.style.transition = 'opacity 0.5s ease-out';

    showBootMessage();
});
