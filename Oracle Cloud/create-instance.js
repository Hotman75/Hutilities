// ==UserScript==
// @name         Oracle Cloud Create Instance Auto-Click
// @namespace    https://github.com/Hotman75/Tampermonkey
// @version      1.0
// @description  Click the “Create” button every 30s.
// @author       Hotman
// @match        https://cloud.oracle.com/*
// @run-at       document-idle
// @updateURL    https://raw.githubusercontent.com/Hotman75/Tampermonkey/main/Oracle%20Cloud/create-instance.js
// @downloadURL  https://raw.githubusercontent.com/Hotman75/Tampermonkey/main/Oracle%20Cloud/create-instance.js
// @homepageURL  https://github.com/Hotman75/Tampermonkey
// @supportURL   https://github.com/Hotman75/Tampermonkey/issues
// ==/UserScript==

(function () {
    'use strict';
    console.log('[Auto-Click Loader] Script loaded and watching for navigation.');

    const targetPath = "/compute/instances/create";

    function initializeScript() {
        if (window.top !== window.self || document.getElementById('Auto-ClickStatusBar')) return;

        const INTERVAL_SECONDS = 30;
        let running = false;
        let clickIntervalId = null;
        let countdownIntervalId = null;
        let countdown = INTERVAL_SECONDS;

        const style = document.createElement('style');
        style.textContent = `
            #Auto-ClickStatusBar button { cursor: pointer; transition: opacity 0.2s ease-in-out; }
            #Auto-ClickStatusBar button:disabled { opacity: 0.5; cursor: not-allowed; }
        `;
        document.head.appendChild(style);

        const statusBar = document.createElement("div");
        statusBar.id = 'Auto-ClickStatusBar';
        statusBar.setAttribute("style", `z-index: 999999999; position: fixed; top: 0; left: 0; width: 100%; background: #333; color: white; font-size: 1.1rem; text-align: center; padding: 8px; display: flex; justify-content: space-between; align-items: center; font-family: 'Helvetica Neue', sans-serif; box-shadow: 0 2px 5px rgba(0,0,0,0.2);`);

        const statusText = document.createElement("span");
        statusText.style.flexGrow = "1";
        statusText.style.textAlign = "left";
        statusText.style.paddingLeft = "15px";

        const controls = document.createElement("div");
        controls.style.paddingRight = "15px";

        const startBtn = document.createElement("button");
        startBtn.textContent = "▶️ Start";
        startBtn.style.marginRight = "10px";
        startBtn.onclick = start;

        const stopBtn = document.createElement("button");
        stopBtn.textContent = "⏹️ Stop";
        stopBtn.disabled = true;
        stopBtn.onclick = () => stop("🔴 Script manually stopped by the user.");

        controls.appendChild(startBtn);
        controls.appendChild(stopBtn);
        statusBar.appendChild(statusText);
        statusBar.appendChild(controls);
        document.body.appendChild(statusBar);

        function updateStatus(text, color = "#333") {
            statusBar.style.backgroundColor = color;
            statusText.textContent = text;
            console.log(`[Auto-Click] ${new Date().toLocaleTimeString()} - ${text}`);
        }

        function start() {
            if (running) return;
            running = true;
            startBtn.disabled = true;
            stopBtn.disabled = false;
            updateStatus("🟢 Script started. Trying first click...", "#16a085");
            attemptClick();
            clickIntervalId = setInterval(attemptClick, INTERVAL_SECONDS * 1000);
            startCountdownTimer();
        }

        function stop(reason = "🔴 Script stopped.") {
            if (!running) return;
            running = false;
            clearInterval(clickIntervalId);
            clearInterval(countdownIntervalId);
            clickIntervalId = null;
            countdownIntervalId = null;
            startBtn.disabled = false;
            stopBtn.disabled = true;
            updateStatus(reason, "#c0392b");
        }

        function attemptClick() {
            if (!running) return;
            countdown = INTERVAL_SECONDS;
            let clickedSomething = false;
            const sections = Array.from(document.getElementsByTagName("section"));
            for (const section of sections) {
                try {
                    if (section.offsetParent === null) continue;
                    const continueBtn = section.querySelector('[aria-label="Continue working"]');
                    if (continueBtn && !continueBtn.disabled && continueBtn.offsetParent !== null) {
                        continueBtn.click();
                        updateStatus("🔄 Clicked 'Continue working' in section to keep session alive.", "#2980b9");
                        clickedSomething = true;
                        break;
                    }
                } catch (err) { console.warn("[Auto-Click] ⚠️ Error accessing section:", err.message); }
            }
            const iframes = Array.from(document.getElementsByTagName("iframe"));
            for (const iframe of iframes) {
                try {
                    const doc = iframe.contentWindow?.document;
                    if (!doc || doc.readyState !== "complete") continue;
                    const createBtn = doc.querySelector('[aria-label="Create"]');
                    if (createBtn && createBtn.offsetParent !== null && !createBtn.disabled) {
                        createBtn.click();
                        updateStatus(`✅ 'Create' button clicked! Next attempt in ${INTERVAL_SECONDS}s.`, "#27ae60");
                        clickedSomething = true;
                        break;
                    }
                } catch (err) { console.warn("[Auto-Click] ⚠️ Error accessing iframe:", err.message); }
            }
            if (!clickedSomething) {
            }
        }

        function startCountdownTimer() {
            if (countdownIntervalId) clearInterval(countdownIntervalId);
            countdownIntervalId = setInterval(() => {
                if (!running) return clearInterval(countdownIntervalId);
                if (statusText.textContent.includes("Next attempt")) {
                    const base = statusText.textContent.split(" Next attempt")[0];
                    statusText.textContent = `${base} Next attempt in ${countdown}s.`;
                }
                if (countdown > 0) countdown--;
            }, 1000);
        }

        updateStatus("🔲 Waiting to start.");
    }

    function checkAndRun() {
        if (window.location.pathname.startsWith(targetPath) && !document.getElementById('Auto-ClickStatusBar')) {
            console.log('[Auto-Click Loader] Target URL detected. Waiting for iframe...');

            let retries = 0;
            const maxRetries = 100;
            const retryInterval = 200;

            const intervalId = setInterval(() => {
                const iframe = document.querySelector("iframe");
                if (iframe) {
                    console.log("[Auto-Click Loader] iFrame detected (via retry). Launching main script.");
                    clearInterval(intervalId);
                    initializeScript();
                } else if (++retries > maxRetries) {
                    console.warn("[Auto-Click Loader] iFrame not found after timeout.");
                    clearInterval(intervalId);
                }
            }, retryInterval);
        }
    }

    function hookSPAChanges() {
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        function onUrlChange() {
            console.log('[Auto-Click Loader] Detected URL change to:', location.href);
            setTimeout(checkAndRun, 500);
        }

        history.pushState = function (...args) {
            originalPushState.apply(this, args);
            onUrlChange();
        };
        history.replaceState = function (...args) {
            originalReplaceState.apply(this, args);
            onUrlChange();
        };

        window.addEventListener('popstate', onUrlChange);
    }

    hookSPAChanges();
    checkAndRun();

})();
