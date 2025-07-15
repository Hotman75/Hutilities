// ==UserScript==
// @name         Oracle Auto-Click Create
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Clique sur le bouton "Create" dans une iframe Oracle toutes les 30s, avec Start/Stop, exécution immédiate et compte à rebours visuel.
// @author       Hotman (corrigé par Gemini)
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
    startBtn.style.cursor = "pointer";
    startBtn.onclick = start;

    const stopBtn = document.createElement("button");
    stopBtn.textContent = "⏹️ Stop";
    stopBtn.disabled = true;
    stopBtn.style.cursor = "pointer";
    stopBtn.onclick = stop;

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

        // Logique principale :
        // 1. Tenter de cliquer immédiatement.
        // 2. Puis, lancer un intervalle pour les clics suivants.
        attemptClick();
        clickIntervalId = setInterval(attemptClick, INTERVAL_SECONDS * 1000);

        // Lancer le minuteur pour le compte à rebours visuel
        startCountdownTimer();
    }

    function stop() {
        if (!running) return;
        running = false;

        // Arrêter les deux intervalles
        clearInterval(clickIntervalId);
        clearInterval(countdownIntervalId);
        clickIntervalId = null;
        countdownIntervalId = null;

        startBtn.disabled = false;
        stopBtn.disabled = true;
        updateStatus("🔴 Script arrêté.", "#c0392b");
    }

    // --- Logique principale du script ---

    /**
     * Tente de trouver l'iframe et de cliquer sur le bouton "Create".
     * Cette fonction est appelée immédiatement au démarrage, puis toutes les 30 secondes.
     */
    function attemptClick() {
        if (!running) return;

        // Réinitialiser le compte à rebours visuel à chaque tentative
        countdown = INTERVAL_SECONDS;

        const iframe = document.getElementById("sandbox-maui-preact-container");

        const iframeReady = iframe &&
                            iframe.contentWindow &&
                            iframe.contentWindow.document &&
                            iframe.contentWindow.document.readyState === "complete";

        if (!iframeReady) {
            updateStatus(`⏳ Iframe introuvable ou pas encore prête. Prochaine tentative dans ${INTERVAL_SECONDS}s.`, "#f39c12");
            return;
        }

        try {
            const doc = iframe.contentWindow.document;
            const createBtn = doc.querySelector('[aria-label="Create"]');

            if (createBtn) {
                // Vérifier si le bouton est visible et cliquable pour éviter les erreurs
                if (createBtn.offsetParent !== null && !createBtn.disabled) {
                    createBtn.click();
                    updateStatus(`✅ Bouton 'Create' cliqué ! Prochaine tentative dans ${INTERVAL_SECONDS}s.`, "#27ae60");
                } else {
                    updateStatus(`⚠️ Bouton trouvé mais non visible/cliquable. Prochaine tentative dans ${INTERVAL_SECONDS}s.`, "#e67e22");
                }
            } else {
                updateStatus(`⚠️ Bouton 'Create' non trouvé. Prochaine tentative dans ${INTERVAL_SECONDS}s.`, "#e67e22");
            }
        } catch (err) {
            // Gérer les erreurs de sécurité cross-origin qui peuvent survenir
            updateStatus(`❌ Erreur d'accès à l'iframe: ${err.message}`, "#c0392b");
            console.error("[AutoCreate] 💥 Erreur :", err);
        }
    }

    /**
     * Gère le compte à rebours visuel mis à jour chaque seconde.
     */
    function startCountdownTimer() {
        // S'assurer qu'un seul minuteur de compte à rebours tourne à la fois
        if (countdownIntervalId) {
            clearInterval(countdownIntervalId);
        }

        countdownIntervalId = setInterval(() => {
            if (!running) {
                clearInterval(countdownIntervalId);
                return;
            }

            // Mettre à jour le texte du statut avec le compte à rebours,
            // mais seulement si le statut actuel n'est pas un message d'erreur ou de succès important.
            if (statusText.textContent.includes("Prochaine tentative")) {
                 const baseMessage = statusText.textContent.split(" Prochaine tentative")[0];
                 statusText.textContent = `${baseMessage} Prochaine tentative dans ${countdown}s.`;
            }

            countdown--;
        }, 1000);
    }

    // Initialiser le statut au chargement de la page
    updateStatus("🔲 En attente de démarrage.");

})();
