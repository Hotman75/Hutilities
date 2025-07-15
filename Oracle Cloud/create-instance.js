// ==UserScript==
// @name         Oracle Cloud Create Instance Auto-Click
// @namespace    https://github.com/Hotman75/Tampermonkey/
// @version      1.0
// @description  Buttons to start or stop clicking the “Create” button every 30s. Stops if the button is not found.
// @author       Hotman
// @match        https://cloud.oracle.com/compute/instances/create/*
// @grant        none
// @run-at       document-idle
// @updateURL    https://raw.githubusercontent.com/Hotman75/Tampermonkey/main/Oracle%20Cloud/create-instance.js
// @downloadURL  https://raw.githubusercontent.com/Hotman75/Tampermonkey/main/Oracle%20Cloud/create-instance.js
// @homepageURL  https://github.com/Hotman75/Tampermonkey
// @supportURL   https://github.com/Hotman75/Tampermonkey/issues
// ==/UserScript==

(function () {
    'use strict';

    // Ensure the script runs only in the main window
    // and that only one instance of the status bar is created.
    if (window.top !== window.self || document.getElementById('autoCreateStatusBar')) {
        return;
    }

    const INTERVAL_SECONDS = 30;
    let running = false;
    let clickIntervalId = null;
    let countdownIntervalId = null;
    let countdown = INTERVAL_SECONDS;

    // Improve CSS styles
    const style = document.createElement('style');
    style.textContent = `
        #autoCreateStatusBar button {
            cursor: pointer;
            transition: opacity 0.2s ease-in-out;
        }
        #autoCreateStatusBar button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
    `;
    document.head.appendChild(style);

    // Create the user interface (status bar)
    const statusBar = document.createElement("div");
    statusBar.id = 'autoCreateStatusBar';
    statusBar.setAttribute("style", `
        z-index: 999999999;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        background: #333;
        color: white;
        font-size: 1.1rem;
        text-align: center;
        padding: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-family: 'Helvetica Neue', sans-serif;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    `);

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

    // UI Functions

    function updateStatus(text, color = "#333") {
        statusBar.style.backgroundColor = color;
        statusText.textContent = text;
        console.log(`[AutoCreate] ${new Date().toLocaleTimeString()} - ${text}`);
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

    // Main script logic

    function attemptClick() {
        if (!running) return;

        countdown = INTERVAL_SECONDS;
        const iframe = document.getElementById("sandbox-maui-preact-container");

        const iframeReady = iframe && iframe.contentWindow && iframe.contentWindow.document && iframe.contentWindow.document.readyState === "complete";

        if (!iframeReady) {
            updateStatus(`⏳ Iframe not found or not ready. Retrying in ${INTERVAL_SECONDS}s.`, "#f39c12");
            return;
        }

        try {
            const doc = iframe.contentWindow.document;
            const createBtn = doc.querySelector('[aria-label="Create"]');

            if (createBtn) {
                if (createBtn.offsetParent !== null && !createBtn.disabled) {
                    createBtn.click();
                    updateStatus(`✅ 'Create' button clicked! Next attempt in ${INTERVAL_SECONDS}s.`, "#27ae60");
                } else {
                    updateStatus(`⚠️ Button found but not visible/clickable. Next attempt in ${INTERVAL_SECONDS}s.`, "#e67e22");
                }
            } else {
                stop("🔴 'Create' button not found. Script stopped.");
            }
        } catch (err) {
            stop(`❌ Error accessing iframe: ${err.message}. Script stopped.`);
            console.error("[AutoCreate] 💥 Error:", err);
        }
    }

    function startCountdownTimer() {
        if (countdownIntervalId) {
            clearInterval(countdownIntervalId);
        }

        countdownIntervalId = setInterval(() => {
            if (!running) {
                clearInterval(countdownIntervalId);
                return;
            }

            if (statusText.textContent.includes("Next attempt")) {
                const baseMessage = statusText.textContent.split(" Next attempt")[0];
                statusText.textContent = `${baseMessage} Next attempt in ${countdown}s.`;
            }

            if (countdown > 0) {
                countdown--;
            }
        }, 1000);
    }

    updateStatus("🔲 Waiting to start.");

})();
