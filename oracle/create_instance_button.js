// ==UserScript==
// @name         Oracle Auto-Click Create
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Clique sur "Create" toutes les 30s. S'arrête si le bouton n'est pas trouvé. Avec Start/Stop, compte à rebours et style visuel pour les boutons désactivés.
// @author       Hotman
// @match        https://cloud.oracle.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    // S'assurer que le script ne s'exécute que dans la fenêtre principale
    // et qu'une seule instance de la barre d'état est créée.
    if (window.top !== window.self || document.getElementById('autoCreateStatusBar')) {
        return;
    }

    const INTERVAL_SECONDS = 30;
    let running = false;
    let clickIntervalId = null;
    let countdownIntervalId = null;
    let countdown = INTERVAL_SECONDS;

    // --- MODIFICATION : Amélioration des styles CSS ---
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


    // --- Création de l'interface utilisateur (barre de statut) ---
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
    stopBtn.onclick = () => stop("🔴 Script arrêté manuellement par l'utilisateur.");

    controls.appendChild(startBtn);
    controls.appendChild(stopBtn);
    statusBar.appendChild(statusText);
    statusBar.appendChild(controls);
    document.body.appendChild(statusBar);


    // --- Fonctions de l'interface ---

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
        updateStatus("🟢 Script démarré. Tentative de clic initiale...", "#16a085");

        attemptClick();
        clickIntervalId = setInterval(attemptClick, INTERVAL_SECONDS * 1000);
        startCountdownTimer();
    }

    function stop(reason = "🔴 Script arrêté.") {
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

    // --- Logique principale du script ---

    function attemptClick() {
        if (!running) return;

        countdown = INTERVAL_SECONDS;
        const iframe = document.getElementById("sandbox-maui-preact-container");

        const iframeReady = iframe && iframe.contentWindow && iframe.contentWindow.document && iframe.contentWindow.document.readyState === "complete";

        if (!iframeReady) {
            updateStatus(`⏳ Iframe introuvable ou pas encore prête. Prochaine tentative dans ${INTERVAL_SECONDS}s.`, "#f39c12");
            return;
        }

        try {
            const doc = iframe.contentWindow.document;
            const createBtn = doc.querySelector('[aria-label="Create"]');

            if (createBtn) {
                if (createBtn.offsetParent !== null && !createBtn.disabled) {
                    createBtn.click();
                    updateStatus(`✅ Bouton 'Create' cliqué ! Prochaine tentative dans ${INTERVAL_SECONDS}s.`, "#27ae60");
                } else {
                    updateStatus(`⚠️ Bouton trouvé mais non visible/cliquable. Prochaine tentative dans ${INTERVAL_SECONDS}s.`, "#e67e22");
                }
            } else {
                stop("🔴 Bouton 'Create' non trouvé. Le script est arrêté.");
            }
        } catch (err) {
            stop(`❌ Erreur d'accès à l'iframe: ${err.message}. Le script est arrêté.`);
            console.error("[AutoCreate] 💥 Erreur :", err);
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

            if (statusText.textContent.includes("Prochaine tentative")) {
                 const baseMessage = statusText.textContent.split(" Prochaine tentative")[0];
                 statusText.textContent = `${baseMessage} Prochaine tentative dans ${countdown}s.`;
            }

            if (countdown > 0) {
                countdown--;
            }
        }, 1000);
    }

    updateStatus("🔲 En attente de démarrage.");

})();
