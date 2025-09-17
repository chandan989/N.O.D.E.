document.addEventListener('DOMContentLoaded', function() {
    const bootloader = document.getElementById('bootloader');
    const mainContent = document.getElementById('main-content');
    const bootLog = document.getElementById('boot-log');
    const loaderContainer = document.getElementById('loader-container');
    const loaderWidth = 40;

    const bootMessages = [
        { text: 'INITIATING N.O.D.E. KERNEL...', delay: 100 },
        { text: 'ESTABLISHING QUANTUM-ENTANGLED LINK...', delay: 200 },
        { text: 'LINK CONFIRMED. PEER-TO-PEER HANDSHAKE COMPLETE.', delay: 150 },
        { text: 'ACCESSING HEDERA CONSENSUS SERVICE... STATUS: OK.', delay: 250 },
        { text: 'DECRYPTING GENESIS BLOCK: 0x0.0.1...', delay: 150 },
        { text: 'HCS TOPIC ID LOCATED. VALIDATING SIGNATURES...', delay: 200 },
        { text: 'LOADING CORE PROTOCOL DAEMONS...', delay: 100 },
        { text: '  &gt; PAYMENTS.DLL... LOADED.', delay: 120 },
        { text: '  &gt; ASSETS.SYS... LOADED.', delay: 120 },
        { text: '  &gt; VAULT.BAT... LOADED.', delay: 120 },
        { text: 'ALL SYSTEMS NOMINAL. BOOT SEQUENCE COMPLETE.', delay: 200 },
        { text: 'LAUNCHING NEURAL-OPTICAL DISPLAY ENVIRONMENT...', delay: 300 }
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
