document.addEventListener('DOMContentLoaded', () => {
    // --- State Variables ---
    let isLoggedIn = false;
    let walletConnected = false;
    let currentTokens = 0;
    let userAchievements = []; // Array di ID o oggetti {id, name, reward}
    let username = '';
    let walletAddress = ''; // Indirizzo fittizio

    // --- LocalStorage Keys ---
    const LS_KEYS = {
        LOGGED_IN: 'tradingMindset_isLoggedIn',
        USERNAME: 'tradingMindset_username',
        WALLET_CONNECTED: 'tradingMindset_walletConnected',
        WALLET_ADDRESS: 'tradingMindset_walletAddress', // Salveremo quello fittizio generato
        TOKENS: 'tradingMindset_tokens',
        ACHIEVEMENTS: 'tradingMindset_achievements' // Salveremo come stringa JSON
    };

    // --- Element Selectors ---
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const walletBtn = document.getElementById('wallet-button');
    const loginModalEl = document.getElementById('loginModal');
    const signupModalEl = document.getElementById('signupModal');
    const walletModalEl = document.getElementById('walletModal');
    const closeModals = document.querySelectorAll('.close-modal');
    const switchModals = document.querySelectorAll('.switch-modal');
    const tokenBalanceEl = document.getElementById('token-balance');
    const tokenCountEl = document.getElementById('token-count');
    const userInfoEl = document.getElementById('user-info');
    const usernameDisplayEl = document.getElementById('username-display');
    const logoutBtn = document.getElementById('logout-btn');
    const notificationArea = document.getElementById('notification-area');
    const challengeLinks = document.querySelectorAll('.challenge-link');
    const navLinks = document.querySelectorAll('.nav-link');

    // Wallet Modal Elements
    const walletConnectedContent = document.getElementById('wallet-connected-content');
    const walletConnectContent = document.getElementById('wallet-connect-content');
    const walletTokenCountEl = document.getElementById('wallet-token-count');
    const walletAddressEl = document.getElementById('wallet-address');
    const achievementsListEl = document.getElementById('achievements-list');
    const connectWalletBtn = document.getElementById('connect-wallet-btn');
    const disconnectWalletBtn = document.getElementById('disconnect-wallet-btn');

    // --- Core Functions ---

    function loadStateFromLocalStorage() {
        console.log("Loading state from localStorage...");
        isLoggedIn = localStorage.getItem(LS_KEYS.LOGGED_IN) === 'true';
        username = localStorage.getItem(LS_KEYS.USERNAME) || '';
        walletConnected = localStorage.getItem(LS_KEYS.WALLET_CONNECTED) === 'true';
        walletAddress = localStorage.getItem(LS_KEYS.WALLET_ADDRESS) || ''; // Carica indirizzo salvato
        currentTokens = parseInt(localStorage.getItem(LS_KEYS.TOKENS) || '0', 10);
        try {
            // Assicurati che gli achievements siano sempre un array
            const achievementsData = localStorage.getItem(LS_KEYS.ACHIEVEMENTS);
            userAchievements = achievementsData ? JSON.parse(achievementsData) : [];
            if (!Array.isArray(userAchievements)) userAchievements = [];
        } catch (e) {
            console.error("Error parsing achievements from localStorage:", e);
            userAchievements = []; // Resetta in caso di errore
            localStorage.removeItem(LS_KEYS.ACHIEVEMENTS); // Rimuovi dati corrotti
        }
        console.log("State loaded:", { isLoggedIn, username, walletConnected, walletAddress, currentTokens, userAchievements });
    }

    function saveStateToLocalStorage() {
        console.log("Saving state to localStorage...");
        localStorage.setItem(LS_KEYS.LOGGED_IN, isLoggedIn);
        localStorage.setItem(LS_KEYS.USERNAME, username);
        localStorage.setItem(LS_KEYS.WALLET_CONNECTED, walletConnected);
        localStorage.setItem(LS_KEYS.WALLET_ADDRESS, walletAddress);
        localStorage.setItem(LS_KEYS.TOKENS, currentTokens);
        try {
            localStorage.setItem(LS_KEYS.ACHIEVEMENTS, JSON.stringify(userAchievements));
        } catch (e) {
            console.error("Error saving achievements to localStorage:", e);
        }
         console.log("State saved:", { isLoggedIn, username, walletConnected, walletAddress, currentTokens, userAchievements });
    }

    // --- Modal Functions ---
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            if (modalId === 'walletModal') updateWalletModalUI();
            modal.style.display = "block";
            // Optional: Focus su primo input
             const firstInput = modal.querySelector('input');
             if (firstInput) firstInput.focus();
        } else {
            console.error(`Modal with id ${modalId} not found.`);
        }
    }

    function closeModal(modalId) { /* ... come prima ... */ }
    function switchModalUI(fromModalId, toModalId) { /* ... come prima ... */ }

    // --- Login/Signup/Logout Functions (Simulated & with LocalStorage) ---
    function handleLogin(event) {
        event.preventDefault();
        const enteredUsername = document.getElementById('login-username')?.value.trim();
        // Qui in una app reale ci sarebbe una chiamata API per verificare le credenziali
        if (!enteredUsername) {
             showNotification("Inserisci un username.", 'error');
             return;
        }
        username = enteredUsername; // Usa l'username inserito
        isLoggedIn = true;
        saveStateToLocalStorage(); // Salva il nuovo stato
        updateLoginStateUI();
        closeModal('loginModal');
        showNotification(`Bentornato, ${username}!`, 'success');
        console.log("User logged in:", username);
    }

    function handleSignup(event) {
        event.preventDefault();
         const enteredUsername = document.getElementById('signup-username')?.value.trim();
          if (!enteredUsername || enteredUsername.length < 3) {
             showNotification("Username non valido (minimo 3 caratteri).", 'error');
             return;
         }
        // Qui in una app reale ci sarebbe una chiamata API per registrare l'utente
        username = enteredUsername;
        isLoggedIn = true;
        // Reset token/achievements per nuovo utente (o potremmo caricarli da un DB)
        currentTokens = 0;
        userAchievements = [];
        walletConnected = false; // Nuovo utente non ha wallet connesso di default
        walletAddress = '';
        saveStateToLocalStorage(); // Salva il nuovo stato
        updateLoginStateUI();
        closeModal('signupModal');
        showNotification(`Registrazione completata! Benvenuto, ${username}!`, 'success');
        console.log("User signed up and logged in:", username);
    }

    function handleLogout() {
        isLoggedIn = false;
        username = '';
        // Manteniamo token/achievements nel localStorage? O li resettiamo?
        // Dipende se vogliamo che un utente possa "recuperare" il suo stato
        // semplicemente facendo login con lo stesso username.
        // Per ora, li manteniamo, ma resettiamo lo stato UI.
        localStorage.setItem(LS_KEYS.LOGGED_IN, 'false'); // Aggiorna solo lo stato login
        localStorage.removeItem(LS_KEYS.USERNAME); // Rimuovi username

        updateLoginStateUI();
        updateTokenDisplayUI();
        updateWalletModalUI();
        showNotification("Logout effettuato.", 'info');
        console.log("User logged out");
    }

    // --- Wallet Functions (Simulated & with LocalStorage) ---
    function connectWallet() {
        console.log("Connecting wallet (simulated)...");
        walletConnected = true;
        // Genera un indirizzo fittizio se non ne esiste uno salvato
        if (!walletAddress) {
             walletAddress = '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
        }

        const achievementId = 'wallet-connect';
        const reward = 5;
        const achievementName = 'Wallet Collegato';

        if (!userAchievements.some(ach => ach.id === achievementId)) {
            currentTokens += reward;
            userAchievements.push({ id: achievementId, name: achievementName, tokens: reward });
            showNotification(`Wallet collegato! Hai ricevuto ${reward} TRAD.`, 'success');
        } else {
            showNotification(`Wallet collegato.`, 'info'); // Non dare più token
        }

        saveStateToLocalStorage(); // Salva il nuovo stato wallet e token/achievement
        updateWalletModalUI();
        updateTokenDisplayUI();
    }

    function disconnectWallet() {
        console.log("Disconnecting wallet (simulated)...");
        walletConnected = false;
        walletAddress = ''; // Rimuovi indirizzo
        // Decidi se rimuovere l'achievement o mantenere i token
        // userAchievements = userAchievements.filter(ach => ach.id !== 'wallet-connect');
        saveStateToLocalStorage(); // Salva lo stato disconnesso
        updateWalletModalUI();
        updateTokenDisplayUI();
        showNotification("Wallet disconnesso.", 'info');
    }

    // --- Challenge Functions (Simulated & with LocalStorage) ---
    function handleChallengeClick(event) {
         event.preventDefault();
         const link = event.currentTarget;
         const challengeId = link.dataset.challengeId;
         const reward = parseInt(link.dataset.reward, 10);

         if (!isLoggedIn) { showNotification("Devi accedere per le sfide.", 'error'); openModal('loginModal'); return; }
         if (!walletConnected) { showNotification("Devi collegare il wallet per guadagnare token.", 'error'); openModal('walletModal'); return; }
         if (userAchievements.some(ach => ach.id === challengeId)) { showNotification("Hai già completato questa sfida!", 'info'); return; }

         console.log(`Starting challenge: ${challengeId}, Reward: ${reward} TRAD`);
         showNotification(`Inizio sfida "${challengeId.replace(/-/g,' ')}"...`, 'info');

         // SIMULAZIONE COMPLETAMENTO (In futuro qui si aprirebbe il modal interattivo)
         setTimeout(() => {
             completeChallenge(challengeId, reward);
         }, 2000);
     }

    function completeChallenge(challengeId, tokenReward) {
        // Controllo ridondante
        if (userAchievements.some(ach => ach.id === challengeId)) {
             console.warn(`Attempted to complete already completed challenge: ${challengeId}`);
             return;
        }

        console.log(`Challenge completed: ${challengeId}`);
        currentTokens += tokenReward;

        let achievementName = challengeId.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase());
         const nameMap = { /* ... come prima ... */
             'self-assessment': 'Auto-Valutazione Completata',
             'truth-assimilation': 'Assimilazione Verità Fondamentali',
             '20-trade-series': 'Serie 20 Trade Eseguita',
             'psych-journal': 'Diario Psicologico Compilato',
         };
         achievementName = nameMap[challengeId] || achievementName;

        userAchievements.push({ id: challengeId, name: achievementName, tokens: tokenReward });

        saveStateToLocalStorage(); // Salva token e achievement aggiornati
        updateTokenDisplayUI();
        showNotification(`Sfida "${achievementName}" completata! +${tokenReward} TRAD.`, 'success');
        if(walletModalEl.style.display === 'block') {
            updateWalletModalUI(); // Aggiorna il modal se aperto
        }
    }

    // --- Notification Function ---
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.classList.add('notification');
        notification.classList.add(type); // Aggiunge classe success, error, o info

        let iconClass = 'fa-check-circle';
        if (type === 'error') iconClass = 'fa-times-circle';
        else if (type === 'info') iconClass = 'fa-info-circle';

        notification.innerHTML = `<i class="fas ${iconClass}"></i> ${message}`;
        notificationArea.appendChild(notification);

        // Forza reflow
        void notification.offsetWidth;

        // Mostra
        notification.classList.add('show');

        // Nascondi e rimuovi
        setTimeout(() => {
            notification.classList.remove('show');
            notification.addEventListener('transitionend', () => notification.remove());
        }, 4000);
    }

    // --- UI Update Functions ---
    function updateLoginStateUI() {
        if (isLoggedIn) {
            loginBtn.style.display = 'none';
            signupBtn.style.display = 'none';
            userInfoEl.style.display = 'flex';
            usernameDisplayEl.textContent = `Ciao, ${username}`;
            logoutBtn.style.display = 'inline-block';
        } else {
            loginBtn.style.display = 'inline-block';
            signupBtn.style.display = 'inline-block';
            userInfoEl.style.display = 'none';
            usernameDisplayEl.textContent = '';
            logoutBtn.style.display = 'none';
        }
    }

    function updateTokenDisplayUI() {
        tokenCountEl.textContent = currentTokens;
        tokenBalanceEl.style.display = (isLoggedIn && walletConnected) ? 'flex' : 'none';
    }

    function updateWalletModalUI() {
        if (walletConnected) {
            walletConnectedContent.style.display = 'block';
            walletConnectContent.style.display = 'none';
            walletTokenCountEl.textContent = currentTokens;
            walletAddressEl.textContent = walletAddress || 'Indirizzo non disponibile'; // Mostra indirizzo salvato

            achievementsListEl.innerHTML = ''; // Pulisce
            if (userAchievements.length > 0) {
                 userAchievements.sort((a,b) => a.name.localeCompare(b.name));
                 userAchievements.forEach(ach => { /* ... come prima ... */
                     const div = document.createElement('div');
                     div.classList.add('achievement');
                     let iconClass = 'fa-trophy'; // Default
                     if (ach.id.includes('quiz') || ach.id.includes('assessment')) iconClass = 'fa-question-circle';
                     if (ach.id.includes('series') || ach.id.includes('exercise')) iconClass = 'fa-dumbbell';
                     if (ach.id.includes('journal')) iconClass = 'fa-book-open';
                     if (ach.id.includes('truth')) iconClass = 'fa-check-double';
                     if (ach.id === 'wallet-connect') iconClass = 'fa-link';

                     div.innerHTML = `<div class="achievement-name"><i class="fas ${iconClass}" style="color: var(--secondary-color);"></i> ${ach.name}</div> <div class="achievement-tokens"><i class="fas fa-coins"></i> ${ach.tokens} TRAD</div>`;
                     achievementsListEl.appendChild(div);
                 });
            } else {
                 achievementsListEl.innerHTML = '<div class="no-achievements">Nessun achievement sbloccato.</div>';
            }

        } else {
            walletConnectedContent.style.display = 'none';
            walletConnectContent.style.display = 'block';
        }
    }

    function highlightActiveNavLink() { /* ... come prima ... */ }

    // --- Event Listeners ---
    loginBtn?.addEventListener('click', () => openModal('loginModal'));
    signupBtn?.addEventListener('click', () => openModal('signupModal'));
    walletBtn?.addEventListener('click', () => openModal('walletModal'));
    logoutBtn?.addEventListener('click', handleLogout);
    connectWalletBtn?.addEventListener('click', connectWallet);
    disconnectWalletBtn?.addEventListener('click', disconnectWallet);

    document.getElementById('login-form')?.addEventListener('submit', handleLogin);
    document.getElementById('signup-form')?.addEventListener('submit', handleSignup);

    closeModals.forEach(btn => {
        btn.addEventListener('click', () => closeModal(btn.dataset.modalId));
    });

    switchModals.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchModalUI(link.dataset.from, link.dataset.to);
        });
    });

     challengeLinks.forEach(link => {
        link.addEventListener('click', handleChallengeClick);
     });

    window.addEventListener('scroll', highlightActiveNavLink);
    // Chiudi modal con Escape
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeModal('loginModal');
            closeModal('signupModal');
            closeModal('walletModal');
            // Aggiungi altri modal se necessario
        }
    });

    // --- Initialization ---
    loadStateFromLocalStorage(); // Carica stato all'avvio
    updateLoginStateUI();
    updateWalletModalUI();
    updateTokenDisplayUI();
    highlightActiveNavLink();

    console.log("Trading Mindset App Initialized with LocalStorage Persistence");

}); // End DOMContentLoaded