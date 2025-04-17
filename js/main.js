document.addEventListener('DOMContentLoaded', () => {
    // --- State Variables (aggiunte per il simulatore) ---
    // ... (variabili precedenti: isLoggedIn, walletConnected, etc.) ...
    let simTradeNumber = 1;
    let simWins = 0;
    let simLosses = 0;
    let simTotalPnl = 0;
    let simCurrentPrice = 0;
    let simEntryPrice = 0;
    let simStopLossPrice = 0;
    let simTakeProfitPrice = 0;
    let simDirection = null; // 'Long' o 'Short'
    let simIntervalId = null; // Per l'animazione del prezzo
    let isSimulating = false; // Blocca interazioni durante l'animazione

    // --- Configurazioni Simulatore ---
    const SIM_CONFIG = {
        TOTAL_TRADES: 20,
        STOP_LOSS_POINTS: 5,  // Punti di stop loss
        TAKE_PROFIT_POINTS: 10, // Punti di take profit (R:R 1:2)
        EDGE_PROBABILITY: 0.60, // 60% probabilità che il *primo* movimento sia a favore
        TICK_SIZE: 1,         // Movimento minimo del prezzo per step
        TICK_INTERVAL: 150,   // Millisecondi tra gli step di prezzo (velocità simulazione)
        MAX_PRICE_MOVE_PER_TICK: 2, // Massimo movimento casuale per tick
        BAR_MIN_POS: 0, // Posizione % minima barra prezzo
        BAR_MAX_POS: 100 // Posizione % massima barra prezzo
    };

    // --- Element Selectors (aggiunti per il simulatore) ---
    // ... (selettori precedenti) ...
    const tradeSimulatorModalEl = document.getElementById('tradeSimulatorModal');
    const simulatorUiEl = document.getElementById('simulator-ui');
    const currentTradeNumberEl = document.getElementById('current-trade-number');
    const totalPnlEl = document.getElementById('total-pnl');
    const winRateEl = document.getElementById('win-rate');
    const signalAreaEl = document.getElementById('signal-area');
    const signalDetailsEl = document.getElementById('signal-details');
    const signalTradeNumberEl = document.getElementById('signal-trade-number');
    const enterTradeBtn = document.getElementById('enter-trade-btn');
    const executionAreaEl = document.getElementById('execution-area');
    const executionTradeNumberEl = document.getElementById('execution-trade-number');
    const executionDirectionEl = document.getElementById('execution-direction');
    const stopLossPointsEl = document.getElementById('stop-loss-points');
    const takeProfitPointsEl = document.getElementById('take-profit-points');
    const currentPriceEl = document.getElementById('current-price');
    const priceBarContainer = document.querySelector('.price-bar-container');
    const priceBarEl = document.getElementById('price-bar');
    const tradeStatusEl = document.getElementById('trade-status');
    const nextTradeBtn = document.getElementById('next-trade-btn');
    const finalResultsAreaEl = document.getElementById('final-results-area');
    const finalTotalPnlEl = document.getElementById('final-total-pnl');
    const finalWinRateEl = document.getElementById('final-win-rate');
    const claimRewardBtn = document.getElementById('claim-reward-btn');
    const resetSimulationBtn = document.getElementById('reset-simulation-btn');


    // --- Core Functions (load/save state - aggiorna per includere stato simulatore se vuoi persistenza) ---
    // ... (loadStateFromLocalStorage, saveDataToLocalStorage - potresti aggiungere variabili sim*) ...


    // --- Modal Functions ---
    // ... (openModal, closeModal, switchModalUI come prima) ...


    // --- Login/Signup/Logout Functions ---
    // ... (come prima, assicurati che chiamino saveDataToLocalStorage) ...


    // --- Wallet Functions ---
    // ... (connectWallet, disconnectWallet, updateWalletModalUI, updateTokenDisplayUI come prima, assicurati che chiamino saveDataToLocalStorage) ...


    // --- Challenge Functions ---
    function handleChallengeClick(event) {
        event.preventDefault();
        const link = event.currentTarget;
        const challengeId = link.dataset.challengeId;
        const reward = parseInt(link.dataset.reward, 10);
        const modalTargetId = link.dataset.modalTarget;

        // Controlli preliminari (login, wallet, già completato)
        if (!isLoggedIn) { showNotification("Devi accedere.", 'error'); openModal('loginModal'); return; }
        if (!walletConnected) { showNotification("Devi collegare il wallet.", 'error'); openModal('walletModal'); return; }
        if (userAchievements.some(ach => ach.id === challengeId)) { showNotification("Sfida già completata!", 'info'); return; }

        currentChallengeData = { id: challengeId, reward: reward };

        // Apri il modal corretto e prepara il contenuto
        if (modalTargetId === 'quizModal') {
            displayQuiz(challengeId); openModal(modalTargetId);
        } else if (modalTargetId === 'reflectionModal') {
            displayReflection(challengeId); openModal(modalTargetId);
        } else if (modalTargetId === 'tradeSimulatorModal') { // <-- MODIFICA QUI
            resetSimulation(); // Prepara il simulatore
            openModal(modalTargetId);
        } else {
            // Gestione precedente per simulationModal come conferma semplice (ora obsoleto)
             // displaySimulationConfirmation(challengeId); openModal(modalTargetId);
             console.error("Target modal non gestito per la sfida:", challengeId);
             showNotification("Tipo di sfida non ancora implementato.", 'error');
        }
    }

    function completeChallenge(challengeId, tokenReward) {
        // ... (Logica come prima per aggiungere token e achievement, salva in localStorage) ...
        if (userAchievements.some(ach => ach.id === challengeId)) return;
        console.log(`Challenge completed: ${challengeId}`);
        currentTokens += tokenReward;
        let achievementName = getAchievementName(challengeId);
        userAchievements.push({ id: challengeId, name: achievementName, tokens: tokenReward });
        saveDataToLocalStorage();
        updateTokenDisplayUI();
        showNotification(`Sfida "${achievementName}" completata! +${tokenReward} TRAD.`, 'success');
        if(walletModalEl.style.display === 'block') updateWalletModalUI();
        currentChallengeData = null;
    }

    function getAchievementName(challengeId) { /* ... come prima ... */ }

    // --- Quiz Logic ---
    function displayQuiz(challengeId) { /* ... come prima ... */ }
    function handleSubmitQuiz(event) { /* ... come prima ... */ }

    // --- Reflection Logic ---
    function displayReflection(challengeId) { /* ... come prima ... */ }
    function handleSubmitReflection(event) { /* ... come prima ... */ }

    // --- Trade Simulator Logic ---

    function resetSimulation() {
        console.log("Resetting simulation...");
        simTradeNumber = 1;
        simWins = 0;
        simLosses = 0;
        simTotalPnl = 0;
        simCurrentPrice = 0; // Prezzo di partenza fittizio
        simEntryPrice = 0;
        isSimulating = false;
        if (simIntervalId) clearInterval(simIntervalId);
        simIntervalId = null;

        // Resetta UI
        updateSimulatorStatusUI();
        signalAreaEl.style.display = 'block';
        executionAreaEl.style.display = 'none';
        finalResultsAreaEl.style.display = 'none';
        tradeStatusEl.textContent = '';
        tradeStatusEl.className = ''; // Rimuovi classi win/loss
        enterTradeBtn.disabled = true; // Disabilitato finché non c'è segnale
        resetSimulationBtn.style.display = 'block'; // Mostra reset
        nextTradeBtn.style.display = 'none';
        currentPriceEl.textContent = '0';
        priceBarEl.style.left = '50%'; // Resetta barra prezzo

        // Genera il primo segnale
        generateSignal();
    }

    function updateSimulatorStatusUI() {
        currentTradeNumberEl.textContent = `${simTradeNumber} / ${SIM_CONFIG.TOTAL_TRADES}`;
        totalPnlEl.textContent = simTotalPnl;
        const totalTradesSoFar = simWins + simLosses;
        const winRate = totalTradesSoFar > 0 ? ((simWins / totalTradesSoFar) * 100).toFixed(1) + '%' : 'N/A';
        winRateEl.textContent = winRate;
    }

    function generateSignal() {
        if (simTradeNumber > SIM_CONFIG.TOTAL_TRADES) {
            showFinalResults();
            return;
        }
        console.log(`Generating signal for trade ${simTradeNumber}`);
        signalTradeNumberEl.textContent = simTradeNumber;
        simDirection = Math.random() < 0.5 ? 'Long' : 'Short'; // Segnale casuale Long/Short
        signalDetailsEl.innerHTML = `
            Segnale: <strong class="signal-${simDirection.toLowerCase()}">${simDirection}</strong><br>
            SL: ${SIM_CONFIG.STOP_LOSS_POINTS} Punti / TP: ${SIM_CONFIG.TAKE_PROFIT_POINTS} Punti
        `;
        enterTradeBtn.disabled = false; // Abilita il bottone per entrare
        tradeStatusEl.textContent = ''; // Pulisci stato precedente
        tradeStatusEl.className = '';
    }

    function enterTrade() {
        if (isSimulating || !simDirection) return; // Non entrare se sta già simulando o non c'è segnale

        console.log(`Entering Trade ${simTradeNumber}: ${simDirection}`);
        isSimulating = true;
        enterTradeBtn.disabled = true; // Disabilita durante il trade
        signalAreaEl.style.display = 'none'; // Nascondi area segnale
        executionAreaEl.style.display = 'block'; // Mostra area esecuzione
        resetSimulationBtn.style.display = 'none'; // Nascondi reset durante il trade
        nextTradeBtn.style.display = 'none'; // Nascondi bottone next

        executionTradeNumberEl.textContent = simTradeNumber;
        executionDirectionEl.textContent = simDirection;
        stopLossPointsEl.textContent = SIM_CONFIG.STOP_LOSS_POINTS;
        takeProfitPointsEl.textContent = SIM_CONFIG.TAKE_PROFIT_POINTS;

        // Imposta prezzi entrata/SL/TP
        simEntryPrice = 0; // Partiamo sempre da 0 per semplicità visiva
        simCurrentPrice = simEntryPrice;
        currentPriceEl.textContent = simCurrentPrice;
        priceBarEl.style.left = '50%'; // Posiziona al centro (0)

        if (simDirection === 'Long') {
            simStopLossPrice = simEntryPrice - SIM_CONFIG.STOP_LOSS_POINTS;
            simTakeProfitPrice = simEntryPrice + SIM_CONFIG.TAKE_PROFIT_POINTS;
        } else { // Short
            simStopLossPrice = simEntryPrice + SIM_CONFIG.STOP_LOSS_POINTS;
            simTakeProfitPrice = simEntryPrice - SIM_CONFIG.TAKE_PROFIT_POINTS;
        }

        // Calcola posizioni % barra per SL e TP
        // Spread totale = TP + SL
        const totalSpread = SIM_CONFIG.TAKE_PROFIT_POINTS + SIM_CONFIG.STOP_LOSS_POINTS;
        const slPositionPercent = (SIM_CONFIG.STOP_LOSS_POINTS / totalSpread) * 50; // % rispetto al centro (50%)
        const tpPositionPercent = (SIM_CONFIG.TAKE_PROFIT_POINTS / totalSpread) * 50; // % rispetto al centro (50%)

        // Aggiorna posizione visiva SL/TP sulla barra
        const slBarPos = simDirection === 'Long' ? (50 - slPositionPercent) : (50 + slPositionPercent);
        const tpBarPos = simDirection === 'Long' ? (50 + tpPositionPercent) : (50 - tpPositionPercent);
        priceBarContainer.style.setProperty('--sl-pos', `${slBarPos}%`);
        priceBarContainer.style.setProperty('--tp-pos', `${tpBarPos}%`);


        // Avvia simulazione movimento prezzo
        simIntervalId = setInterval(simulatePriceMovement, SIM_CONFIG.TICK_INTERVAL);
    }

    function simulatePriceMovement() {
        // Movimento base con probabilità dell'edge
        let baseMove = 0;
        if (Math.random() < SIM_CONFIG.EDGE_PROBABILITY) {
            baseMove = simDirection === 'Long' ? SIM_CONFIG.TICK_SIZE : -SIM_CONFIG.TICK_SIZE;
        } else {
            baseMove = simDirection === 'Long' ? -SIM_CONFIG.TICK_SIZE : SIM_CONFIG.TICK_SIZE;
        }

        // Aggiungi movimento casuale
        const randomMove = (Math.random() * (SIM_CONFIG.MAX_PRICE_MOVE_PER_TICK * 2)) - SIM_CONFIG.MAX_PRICE_MOVE_PER_TICK;
        simCurrentPrice += baseMove + randomMove;
        simCurrentPrice = parseFloat(simCurrentPrice.toFixed(1)); // Arrotonda per evitare numeri troppo lunghi

        currentPriceEl.textContent = simCurrentPrice.toFixed(1);

        // Aggiorna posizione barra prezzo (mappatura prezzo -> %)
        const totalSpread = SIM_CONFIG.TAKE_PROFIT_POINTS + SIM_CONFIG.STOP_LOSS_POINTS;
        // Mappa il prezzo attuale (che va da ~ -SL a ~ +TP) a una percentuale 0-100
        // Il centro (prezzo 0) è 50%
        let pricePercent = 50;
         if (simDirection === 'Long') {
             // Se Long, SL è negativo, TP è positivo
             pricePercent = 50 + (simCurrentPrice / SIM_CONFIG.TAKE_PROFIT_POINTS) * 50; // Scala su metà barra
             if(simCurrentPrice < 0) {
                 pricePercent = 50 - (Math.abs(simCurrentPrice) / SIM_CONFIG.STOP_LOSS_POINTS) * 50;
             }
         } else { // Short
             // Se Short, SL è positivo, TP è negativo
              pricePercent = 50 - (Math.abs(simCurrentPrice) / SIM_CONFIG.TAKE_PROFIT_POINTS) * 50; // Scala su metà barra
              if(simCurrentPrice > 0) {
                 pricePercent = 50 + (simCurrentPrice / SIM_CONFIG.STOP_LOSS_POINTS) * 50;
             }
         }

         // Limita tra 0 e 100
        pricePercent = Math.max(SIM_CONFIG.BAR_MIN_POS, Math.min(SIM_CONFIG.BAR_MAX_POS, pricePercent));
        priceBarEl.style.left = `${pricePercent}%`;


        // Controlla se SL o TP sono stati colpiti
        let tradeEnded = false;
        let pnl = 0;
        if (simDirection === 'Long') {
            if (simCurrentPrice <= simStopLossPrice) {
                tradeEnded = true;
                pnl = -SIM_CONFIG.STOP_LOSS_POINTS;
                simLosses++;
                tradeStatusEl.textContent = `Stop Loss Colpito! (${pnl} Punti)`;
                tradeStatusEl.className = 'loss';
            } else if (simCurrentPrice >= simTakeProfitPrice) {
                tradeEnded = true;
                pnl = SIM_CONFIG.TAKE_PROFIT_POINTS;
                simWins++;
                tradeStatusEl.textContent = `Take Profit Raggiunto! (+${pnl} Punti)`;
                tradeStatusEl.className = 'win';
            }
        } else { // Short
            if (simCurrentPrice >= simStopLossPrice) {
                tradeEnded = true;
                pnl = -SIM_CONFIG.STOP_LOSS_POINTS; // Lo stop su short è sempre una perdita
                simLosses++;
                tradeStatusEl.textContent = `Stop Loss Colpito! (${pnl} Punti)`;
                tradeStatusEl.className = 'loss';
            } else if (simCurrentPrice <= simTakeProfitPrice) {
                tradeEnded = true;
                pnl = SIM_CONFIG.TAKE_PROFIT_POINTS; // Il TP su short è un guadagno (differenza positiva)
                simWins++;
                tradeStatusEl.textContent = `Take Profit Raggiunto! (+${pnl} Punti)`;
                tradeStatusEl.className = 'win';
            }
        }

        if (tradeEnded) {
            console.log(`Trade ${simTradeNumber} ended. PNL: ${pnl}`);
            clearInterval(simIntervalId);
            simIntervalId = null;
            simTotalPnl += pnl;
            simTradeNumber++;
            isSimulating = false;
            updateSimulatorStatusUI();
            nextTradeBtn.style.display = 'inline-block'; // Mostra bottone per prossimo trade
             resetSimulationBtn.style.display = 'inline-block'; // Mostra reset
        }
    }

     function handleNextTrade() {
         // Prepara per il prossimo trade
          executionAreaEl.style.display = 'none'; // Nascondi esecuzione
          signalAreaEl.style.display = 'block'; // Mostra area segnale
          generateSignal(); // Genera nuovo segnale
     }

     function showFinalResults() {
         console.log("Simulation finished.");
         signalAreaEl.style.display = 'none';
         executionAreaEl.style.display = 'none';
         finalResultsAreaEl.style.display = 'block';
         resetSimulationBtn.style.display = 'inline-block'; // Mostra reset

         finalTotalPnlEl.textContent = simTotalPnl;
          const totalTradesCompleted = simWins + simLosses;
          const finalWinRate = totalTradesCompleted > 0 ? ((simWins / totalTradesCompleted) * 100).toFixed(1) + '%' : 'N/A';
         finalWinRateEl.textContent = finalWinRate;
     }

     function handleClaimReward() {
          if (!currentChallengeData || currentChallengeData.id !== '20-trade-series') {
               console.error("Dati sfida mancanti o non corretti per riscuotere ricompensa.");
               return;
          }
          completeChallenge(currentChallengeData.id, currentChallengeData.reward);
          closeModal('tradeSimulatorModal'); // Chiudi il modal dopo aver riscosso
     }


    // --- Notification Function ---
    function showNotification(message, type = 'success') { /* ... come prima ... */ }

    // --- UI Update Functions ---
    function updateLoginStateUI() { /* ... come prima ... */ }
    function updateWalletModalUI() { /* ... come prima ... */ }
    function updateTokenDisplayUI() { /* ... come prima ... */ }

    // --- Navigation Highlight ---
    function highlightActiveNavLink() { /* ... come prima ... */ }

    // --- Event Listeners Setup ---
    function setupEventListeners() {
        // ... (Listeners per login, signup, wallet, logout, close modal, switch modal come prima) ...
        loginBtn?.addEventListener('click', () => openModal('loginModal'));
        signupBtn?.addEventListener('click', () => openModal('signupModal'));
        walletBtn?.addEventListener('click', () => openModal('walletModal'));
        logoutBtn?.addEventListener('click', handleLogout);
        connectWalletBtn?.addEventListener('click', connectWallet);
        disconnectWalletBtn?.addEventListener('click', disconnectWallet);
        document.getElementById('login-form')?.addEventListener('submit', handleLogin);
        document.getElementById('signup-form')?.addEventListener('submit', handleSignup);
        closeModalsBtns.forEach(btn => btn.addEventListener('click', () => closeModal(btn.dataset.modalId)));
        switchModalsLinks.forEach(link => link.addEventListener('click', (e) => { e.preventDefault(); switchModalUI(link.dataset.from, link.dataset.to);}));
        window.addEventListener('click', (event) => { modals.forEach(modal => { if (event.target == modal) closeModal(modal.id); }); });

        // Listener Sfide Generico
        challengeLinks.forEach(link => link.addEventListener('click', handleChallengeClick));

        // Listener Form Sfide Specifici
        quizForm?.addEventListener('submit', handleSubmitQuiz);
        reflectionForm?.addEventListener('submit', handleSubmitReflection);
        // Simulatore
        enterTradeBtn?.addEventListener('click', enterTrade);
        nextTradeBtn?.addEventListener('click', handleNextTrade);
        claimRewardBtn?.addEventListener('click', handleClaimReward);
         resetSimulationBtn?.addEventListener('click', resetSimulation); // Listener per reset


        // Nav Link Highlight on scroll
        window.addEventListener('scroll', highlightActiveNavLink);
    }

    // --- Initialization ---
    function initializeApp() {
        loadStateFromLocalStorage(); // Carica stato salvato
        updateLoginStateUI();
        updateWalletModalUI();
        updateTokenDisplayUI();
        highlightActiveNavLink();
        setupEventListeners(); // Imposta tutti i listener
        console.log("Trading Mindset App Initialized with Trade Simulator.");
    }

    initializeApp(); // Avvia

}); // End DOMContentLoaded