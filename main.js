
document.addEventListener('DOMContentLoaded', function() {
    const bootloader = document.getElementById('bootloader');
    const mainContent = document.getElementById('main-content');
    const bootLog = document.getElementById('boot-log');

    const bootMessages = [
        { text: 'INITIALIZING N.O.D.E. PROTOCOL...', delay: 100 },
        { text: 'QUANTUM-LINK ESTABLISHED.', delay: 150 },
        { text: 'DECRYPTING GENESIS BLOCK...', delay: 100 },
        { text: 'ACCESSING CORE_PROTOCOLS.DLL...', delay: 200 },
        { text: '...', delay: 150 },
        { text: 'SYSTEM READY.', delay: 100 },
        { text: 'LOADING VISUAL INTERFACE...', delay: 250 }
    ];

    let messageIndex = 0;

    function showBootMessage() {
        if (messageIndex < bootMessages.length) {
            const p = document.createElement('p');
            p.textContent = `> ${bootMessages[messageIndex].text}`;
            bootLog.appendChild(p);
            bootLog.scrollTop = bootLog.scrollHeight; // Auto-scroll
            setTimeout(showBootMessage, bootMessages[messageIndex].delay);
            messageIndex++;
        } else {
            setTimeout(() => {
                bootloader.style.display = 'none';
                mainContent.style.visibility = 'visible';
                mainContent.style.opacity = '1';
                setupScrollAnimation();
            }, 500);
        }
    }

    function typeWriter(element, text, n) {
        if (n < (text.length)) {
            element.innerHTML = text.substring(0, n + 1) + '<span class="blinking-cursor">█</span>';
            setTimeout(function() {
                typeWriter(element, text, n + 1);
            }, 30); // Typing speed
        } else {
            element.innerHTML = text; // Remove cursor when done
        }
    }

    function setupScrollAnimation() {
        const elementsToType = document.querySelectorAll('[data-type-effect]');
        
        // Store original text and then hide the elements
        elementsToType.forEach(el => {
            el.setAttribute('data-original-text', el.innerHTML.trim());
            el.innerHTML = '';
            el.style.visibility = 'hidden';
        });

        function isElementInViewport(el) {
            const rect = el.getBoundingClientRect();
            // A buffer of 50px to trigger the animation a bit before it's fully in view
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

        // Add a small delay before the first check to ensure layout is stable
        setTimeout(() => {
            checkElements();
            window.addEventListener('scroll', checkElements);
        }, 200);
    }

    // Hide main content initially
    mainContent.style.opacity = '0';
    mainContent.style.visibility = 'hidden';

    showBootMessage();
});