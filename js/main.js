// Incolla qui il codice JS COMPLETO della mia risposta precedente
// (quello che inizia con document.addEventListener('DOMContentLoaded', () => { ... })
// e include loadStateFromLocalStorage, saveStateToLocalStorage, etc.
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
    const navLinks = document.querySelectorAll('.nav-link'); // Seleziona i link di navigazione

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
            // Optional: Focus su primo input visibile
             const firstInput = modal.querySelector('input:not([type=hidden]):not([disabled])');
             if (firstInput) setTimeout(() => firstInput.focus(), 50); // Timeout per transizione
        } else {
            console.error(`Modal with id ${modalId} not found.`);
        }
    }

    function closeModal(modalId) {
         const modal = document.getElementById(modalId);
         if (modal) modal.style.display = "none";
    }
    function switchModalUI(fromModalId, toModalId) {
         closeModal(fromModalId);
         openModal(toModalId);
    }

    // --- Login/Signup/Logout Functions (Simulated & with LocalStorage) ---
    function handleLogin(event) {
        event.preventDefault();
        const enteredUsername = document.getElementById('login-username')?.value.trim();
        if (!enteredUsername) { showNotification("Inserisci un username.", 'error'); return; }
        // In un sistema reale: verifica le credenziali
        username = enteredUsername;
        isLoggedIn = true;
        // Carica i dati SPECIFICI di questo utente (se avessimo un DB)
        // Per ora, localStorage è globale, quindi carichiamo quello che c'è.
        // Se l'username cambia, potremmo voler resettare token/achievements?
        // Per semplicità, ora non lo facciamo.
        saveStateToLocalStorage();
        updateLoginStateUI();
        closeModal('loginModal');
        showNotification(`Bentornato, ${username}!`, 'success');
        console.log("User logged in:", username);
    }

    function handleSignup(event) {
        event.preventDefault();
         const enteredUsername = document.getElementById('signup-username')?.value.trim();
         if (!enteredUsername || enteredUsername.length < 3) { showNotification("Username non valido (minimo 3 caratteri).", 'error'); return; }
         // In un sistema reale: verifica se username esiste, poi crea utente
         username = enteredUsername;
         isLoggedIn = true;
         // Reset token/achievements per nuovo utente SIMULATO
         currentTokens = 0;
         userAchievements = [];
         walletConnected = false;
         walletAddress = '';
         saveStateToLocalStorage(); // Salva il nuovo stato pulito
         updateLoginStateUI();
         closeModal('signupModal');
         showNotification(`Registrazione completata! Benvenuto, ${username}!`, 'success');
         console.log("User signed up and logged in:", username);
    }

    function handleLogout() {
        isLoggedIn = false;
        // Non resettiamo localStorage qui, così un utente può fare login
        // di nuovo con lo stesso username e ritrovare il suo stato.
        // Resettiamo solo lo stato attivo della sessione.
        const loggedOutUsername = username; // Conserva per messaggio
        username = '';
        localStorage.setItem(LS_KEYS.LOGGED_IN, 'false');
        localStorage.removeItem(LS_KEYS.USERNAME); // Rimuovi solo username attivo

        updateLoginStateUI();
        updateTokenDisplayUI();
        // Non serve aggiornare il modal wallet qui, verrà fatto se l'utente lo apre
        showNotification(`Logout effettuato da ${loggedOutUsername}.`, 'info');
        console.log("User logged out");
    }

    // --- Wallet Functions (Simulated & with LocalStorage) ---
    function connectWallet() {
        console.log("Connecting wallet (simulated)...");
        walletConnected = true;
        if (!walletAddress) { // Genera e salva indirizzo solo se non esiste
             walletAddress = '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
        }

        const achievementId = 'wallet-connect';
        const reward = 5;
        const achievementName = 'Wallet Collegato';

        if (!userAchievements.some(ach => ach.id === achievementId)) {
            currentTokens += reward;
            userAchievements.push({ id: achievementId, name: achievementName, tokens: reward });
            showNotification(`Wallet collegato! +${reward} TRAD.`, 'success');
        } else {
            showNotification(`Wallet collegato.`, 'info');
        }

        saveStateToLocalStorage();
        updateWalletModalUI();
        updateTokenDisplayUI();
    }

    function disconnectWallet() {
        console.log("Disconnecting wallet (simulated)...");
        walletConnected = false;
        walletAddress = ''; // Rimuovi indirizzo dallo stato attivo
        // Manteniamo i token e gli achievement, ma salviamo lo stato disconnesso
        localStorage.setItem(LS_KEYS.WALLET_CONNECTED, 'false');
        localStorage.removeItem(LS_KEYS.WALLET_ADDRESS);

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
         // Qui apriremo i modal interattivi nel prossimo step
         // Per ora, simuliamo ancora il completamento diretto
         showNotification(`Simulazione completamento sfida "${challengeId.replace(/-/g,' ')}"...`, 'info');
         setTimeout(() => {
             completeChallenge(challengeId, reward);
         }, 1500); // Riduciamo il timeout per test più rapidi
     }

    function completeChallenge(challengeId, tokenReward) {
        if (userAchievements.some(ach => ach.id === challengeId)) { console.warn(`Challenge already completed: ${challengeId}`); return; }

        console.log(`Challenge completed: ${challengeId}`);
        currentTokens += tokenReward;
        let achievementName = challengeId.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase());
        const nameMap = {
             'self-assessment': 'Auto-Valutazione Completata',
             'truth-assimilation': 'Assimilazione Verità Fondamentali',
             '20-trade-series': 'Serie 20 Trade Eseguita',
             'psych-journal': 'Diario Psicologico Compilato',
             'wallet-connect': 'Wallet Collegato' // Aggiunto per coerenza
         };
        achievementName = nameMap[challengeId] || achievementName;

        userAchievements.push({ id: challengeId, name: achievementName, tokens: tokenReward });
        saveStateToLocalStorage(); // Salva TUTTO lo stato aggiornato
        updateTokenDisplayUI();
        showNotification(`Sfida "${achievementName}" completata! +${tokenReward} TRAD.`, 'success');
        if(walletModalEl.style.display === 'block') updateWalletModalUI();
    }

    // --- Notification Function ---
    function showNotification(message, type = 'success') { /* ... codice come prima ... */ }

    // --- UI Update Functions ---
    function updateLoginStateUI() { /* ... codice come prima ... */ }
    function updateTokenDisplayUI() { /* ... codice come prima ... */ }
    function updateWalletModalUI() { /* ... codice come prima ... */ }
    function highlightActiveNavLink() { /* ... codice come prima ... */ }

    // --- Event Listeners ---
    loginBtn?.addEventListener('click', () => openModal('loginModal'));
    signupBtn?.addEventListener('click', () => openModal('signupModal'));
    walletBtn?.addEventListener('click', () => openModal('walletModal'));
    logoutBtn?.addEventListener('click', handleLogout);
    connectWalletBtn?.addEventListener('click', connectWallet);
    disconnectWalletBtn?.addEventListener('click', disconnectWallet);

    document.getElementById('login-form')?.addEventListener('submit', handleLogin);
    document.getElementById('signup-form')?.addEventListener('submit', handleSignup);

    closeModals.forEach(btn => { btn.addEventListener('click', () => closeModal(btn.dataset.modalId)); });
    switchModals.forEach(link => { link.addEventListener('click', (e) => { e.preventDefault(); switchModalUI(link.dataset.from, link.dataset.to); }); });
    challengeLinks.forEach(link => { link.addEventListener('click', handleChallengeClick); });
    window.addEventListener('scroll', highlightActiveNavLink);
    window.addEventListener('keydown', (event) => { if (event.key === 'Escape') { ['loginModal', 'signupModal', 'walletModal'].forEach(closeModal); } });

    // --- Initialization ---
    loadStateFromLocalStorage(); // CARICA STATO ALL'AVVIO!
    updateLoginStateUI();
    updateWalletModalUI(); // Aggiorna UI modal wallet basato su stato caricato
    updateTokenDisplayUI(); // Aggiorna UI token display basato su stato caricato
    highlightActiveNavLink();

    console.log("Trading Mindset App Initialized with LocalStorage Persistence");

}); // End DOMContentLoaded