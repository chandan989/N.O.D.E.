document.addEventListener('DOMContentLoaded', function() {
    const bootloader = document.getElementById('bootloader');
    const mainContent = document.getElementById('main-content');
    const bootLog = document.getElementById('boot-log');
    const loaderContainer = document.getElementById('loader-container');

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
            // Start the loading animation after boot messages
            runLoadingAnimation(() => {
                setTimeout(() => {
                    bootloader.style.display = 'none';
                    mainContent.style.visibility = 'visible';
                    mainContent.style.opacity = '1';
                    setupScrollAnimation();
                }, 500);
            });
        }
    }

    function runLoadingAnimation(callback) {
        let percent = 0;
        const totalWidth = 30; // Width of the progress bar in characters

        const interval = setInterval(() => {
            percent++;
            const filledWidth = Math.round(totalWidth * (percent / 100));
            const emptyWidth = totalWidth - filledWidth;
            const progressBar = '█'.repeat(filledWidth) + '░'.repeat(emptyWidth);
            
            loaderContainer.innerHTML = `> Loading... [${progressBar}] ${percent}% <span class="blinking-cursor">█</span>`;

            if (percent >= 100) {
                clearInterval(interval);
                // Add a small delay after loading is complete
                setTimeout(callback, 300);
            }
        }, 20); // Speed of the loading bar
    }

    function typeWriter(element, text, callback, n = 0) {
        if (n < text.length) {
            element.innerHTML = text.substring(0, n + 1) + '<span class="blinking-cursor">█</span>';
            setTimeout(() => {
                typeWriter(element, text, callback, n + 1);
            }, 30); // Typing speed
        } else {
            element.innerHTML = text; // Remove cursor when done
            if (callback) {
                callback(); // Signal completion
            }
        }
    }

    function setupScrollAnimation() {
        const elementsToType = Array.from(document.querySelectorAll('[data-type-effect]'));
        let isTyping = false;
        let currentElementIndex = 0;

        // Prepare elements by storing their text and hiding them
        elementsToType.forEach(el => {
            el.setAttribute('data-original-text', el.innerHTML.trim());
            el.innerHTML = '';
            el.style.visibility = 'hidden';
        });

        function isElementInViewport(el) {
            const rect = el.getBoundingClientRect();
            // Trigger animation when the top of the element is 100px above the bottom of the viewport
            return rect.top <= (window.innerHeight || document.documentElement.clientHeight) - 100;
        }

        function processQueue() {
            if (isTyping || currentElementIndex >= elementsToType.length) {
                if (currentElementIndex >= elementsToType.length) {
                    window.removeEventListener('scroll', checkAndProcess);
                }
                return;
            }

            const el = elementsToType[currentElementIndex];
            if (isElementInViewport(el)) {
                isTyping = true;
                el.style.visibility = 'visible';
                const text = el.getAttribute('data-original-text');

                typeWriter(el, text, () => {
                    // Callback function executed after typing is complete
                    isTyping = false;
                    currentElementIndex++;
                    // A small delay before processing the next item gives a more natural feel
                    setTimeout(processQueue, 200);
                });
            }
        }
        
        const checkAndProcess = () => processQueue();

        // Add a small delay before the first check to ensure layout is stable
        setTimeout(() => {
            checkAndProcess();
            window.addEventListener('scroll', checkAndProcess);
        }, 200);
    }

    // Hide main content initially
    mainContent.style.opacity = '0';
    mainContent.style.visibility = 'hidden';

    showBootMessage();
});
