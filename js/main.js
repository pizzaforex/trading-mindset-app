document.addEventListener('DOMContentLoaded', () => {
    // --- State Variables ---
    let isLoggedIn = false;
    let walletConnected = false;
    let currentTokens = 0;
    let userAchievements = [];
    let username = '';
    let walletAddress = '';
    let currentChallengeData = null; // Per tenere traccia della sfida attiva nel modal

    // --- LocalStorage Keys ---
    const LS_KEYS = { /* ... come prima ... */ };

    // --- Element Selectors ---
    // ... (Selettori precedenti per toolbar, modal base, user info etc.) ...
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const walletBtn = document.getElementById('wallet-button');
    const logoutBtn = document.getElementById('logout-btn');
    const notificationArea = document.getElementById('notification-area');
    const challengeLinks = document.querySelectorAll('.challenge-link');
    const navLinks = document.querySelectorAll('.nav-link');
    const tokenBalanceEl = document.getElementById('token-balance');
    const tokenCountEl = document.getElementById('token-count');
    const userInfoEl = document.getElementById('user-info');
    const usernameDisplayEl = document.getElementById('username-display');

    // Modal Generici
    const modals = document.querySelectorAll('.modal');
    const closeModalsBtns = document.querySelectorAll('.close-modal');
    const switchModalsLinks = document.querySelectorAll('.switch-modal');

    // Modal Sfide
    const quizModalEl = document.getElementById('quizModal');
    const reflectionModalEl = document.getElementById('reflectionModal');
    const simulationModalEl = document.getElementById('simulationModal');
    const quizForm = document.getElementById('quiz-form');
    const reflectionForm = document.getElementById('reflection-form');
    const simulationForm = document.getElementById('simulation-form');
    const quizQuestionsDiv = document.getElementById('quiz-questions');
    const quizTitleEl = document.getElementById('quiz-title');
    const quizErrorEl = document.getElementById('quiz-error');
    const reflectionTitleEl = document.getElementById('reflection-title');
    const reflectionLabelEl = document.getElementById('reflection-label');
    const reflectionTextEl = document.getElementById('reflection-text');
    const reflectionErrorEl = document.getElementById('reflection-error');
    const simulationTitleEl = document.getElementById('simulation-title');
    const simulationDescriptionEl = document.getElementById('simulation-description');

    // Wallet Modal Elements
    // ... (Selettori wallet come prima) ...
    const walletConnectedContent = document.getElementById('wallet-connected-content');
    const walletConnectContent = document.getElementById('wallet-connect-content');
    const walletTokenCountEl = document.getElementById('wallet-token-count');
    const walletAddressEl = document.getElementById('wallet-address');
    const achievementsListEl = document.getElementById('achievements-list');
    const connectWalletBtn = document.getElementById('connect-wallet-btn');
    const disconnectWalletBtn = document.getElementById('disconnect-wallet-btn');

    // --- Data Management (LocalStorage) ---
    function saveDataToLocalStorage() {
        localStorage.setItem(LS_KEYS.LOGGED_IN, isLoggedIn);
        localStorage.setItem(LS_KEYS.USERNAME, username);
        localStorage.setItem(LS_KEYS.WALLET_CONNECTED, walletConnected);
        localStorage.setItem(LS_KEYS.WALLET_ADDRESS, walletAddress);
        localStorage.setItem(LS_KEYS.TOKENS, currentTokens);
        localStorage.setItem(LS_KEYS.ACHIEVEMENTS, JSON.stringify(userAchievements));
        console.log("State saved to localStorage");
    }

    function loadStateFromLocalStorage() {
        console.log("Loading state from localStorage...");
        isLoggedIn = localStorage.getItem(LS_KEYS.LOGGED_IN) === 'true';
        username = localStorage.getItem(LS_KEYS.USERNAME) || '';
        walletConnected = localStorage.getItem(LS_KEYS.WALLET_CONNECTED) === 'true';
        walletAddress = localStorage.getItem(LS_KEYS.WALLET_ADDRESS) || '';
        currentTokens = parseInt(localStorage.getItem(LS_KEYS.TOKENS) || '0', 10);
        try {
            const achievementsData = localStorage.getItem(LS_KEYS.ACHIEVEMENTS);
            userAchievements = achievementsData ? JSON.parse(achievementsData) : [];
            if (!Array.isArray(userAchievements)) userAchievements = [];
        } catch (e) {
            console.error("Error parsing achievements from localStorage:", e);
            userAchievements = [];
        }
    }

    // --- Modal Functions ---
    function openModal(modalId) { /* ... come prima ... */ }
    function closeModal(modalId) { /* ... come prima ... */ }
    function switchModalUI(fromModalId, toModalId) { /* ... come prima ... */ }

    // --- Login/Signup/Logout Functions (Simulated) ---
    function handleLogin(event) { /* ... come prima, ma chiama saveDataToLocalStorage() ... */
        event.preventDefault();
        username = document.getElementById('login-email').value.split('@')[0] || 'Utente';
        isLoggedIn = true;
        saveDataToLocalStorage(); // Salva stato
        updateLoginStateUI();
        closeModal('loginModal');
        showNotification(`Bentornato, ${username}!`, 'info');
        console.log("User logged in:", username);
    }
    function handleSignup(event) { /* ... come prima, ma chiama saveDataToLocalStorage() ... */
        event.preventDefault();
        username = document.getElementById('signup-name').value || 'NuovoUtente';
        isLoggedIn = true;
        saveDataToLocalStorage(); // Salva stato
        updateLoginStateUI();
        closeModal('signupModal');
        showNotification(`Registrazione completata! Benvenuto, ${username}!`, 'success');
        console.log("User signed up and logged in:", username);
    }
    function handleLogout() { /* ... come prima, ma chiama saveDataToLocalStorage() ... */
        isLoggedIn = false;
        username = '';
        saveDataToLocalStorage(); // Salva stato
        updateLoginStateUI();
        updateTokenDisplayUI();
        updateWalletModalUI();
        showNotification("Logout effettuato.", 'info');
        console.log("User logged out");
    }

    // --- Wallet Functions (Simulated) ---
    function connectWallet() { /* ... come prima, ma chiama saveDataToLocalStorage() alla fine ... */
        console.log("Connecting wallet...");
        walletConnected = true;
        walletAddress = '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''); // Genera nuovo indirizzo fittizio
        const achievementId = 'wallet-connect';
        const reward = 5;
        const achievementName = 'Wallet Collegato';

        if (!userAchievements.some(ach => ach.id === achievementId)) {
            currentTokens += reward;
            userAchievements.push({ id: achievementId, name: achievementName, tokens: reward });
            showNotification(`Wallet collegato! Hai ricevuto ${reward} TRAD.`, 'success');
        } else {
            showNotification(`Wallet già collegato.`, 'info');
        }
        saveDataToLocalStorage(); // Salva stato
        updateWalletModalUI();
        updateTokenDisplayUI();
    }

    function disconnectWallet() { /* ... come prima, ma chiama saveDataToLocalStorage() alla fine ... */
        console.log("Disconnecting wallet...");
        walletConnected = false;
        walletAddress = '';
        // Potremmo decidere se rimuovere l'achievement o meno
        // userAchievements = userAchievements.filter(ach => ach.id !== 'wallet-connect');
        saveDataToLocalStorage(); // Salva stato
        updateWalletModalUI();
        updateTokenDisplayUI();
        showNotification("Wallet disconnesso.", 'info');
    }

    // --- Challenge Functions ---
    function handleChallengeClick(event) {
        event.preventDefault();
        const link = event.currentTarget;
        const challengeId = link.dataset.challengeId;
        const reward = parseInt(link.dataset.reward, 10);
        const modalTargetId = link.dataset.modalTarget; // ID del modal da aprire

        if (!isLoggedIn) { showNotification("Devi accedere.", 'error'); openModal('loginModal'); return; }
        if (!walletConnected) { showNotification("Devi collegare il wallet.", 'error'); openModal('walletModal'); return; }
        if (userAchievements.some(ach => ach.id === challengeId)) { showNotification("Sfida già completata!", 'info'); return; }

        // Salva i dati della sfida corrente per l'handler del modal
        currentChallengeData = { id: challengeId, reward: reward };

        // Apri il modal corretto e prepara il contenuto
        if (modalTargetId === 'quizModal') {
            displayQuiz(challengeId);
            openModal(modalTargetId);
        } else if (modalTargetId === 'reflectionModal') {
            displayReflection(challengeId);
            openModal(modalTargetId);
        } else if (modalTargetId === 'simulationModal') {
            displaySimulationConfirmation(challengeId);
             openModal(modalTargetId);
        } else {
            console.error("Target modal non specificato o sconosciuto per la sfida:", challengeId);
            showNotification("Errore nell'aprire la sfida.", 'error');
        }
    }

    function completeChallenge(challengeId, tokenReward) {
        // Controllo ridondante
        if (userAchievements.some(ach => ach.id === challengeId)) {
             console.warn("Tentativo di completare una sfida già completata:", challengeId);
             return;
        }

        console.log(`Challenge completed: ${challengeId}`);
        currentTokens += tokenReward;

        // Mappa nomi (mantieni o espandi la tua mappa qui)
        let achievementName = getAchievementName(challengeId);

        userAchievements.push({ id: challengeId, name: achievementName, tokens: tokenReward });
        saveDataToLocalStorage(); // Salva il nuovo stato
        updateTokenDisplayUI();
        showNotification(`Sfida "${achievementName}" completata! +${tokenReward} TRAD.`, 'success');
        if(walletModalEl.style.display === 'block') {
            updateWalletModalUI(); // Aggiorna il modal wallet se è aperto
        }
        currentChallengeData = null; // Resetta sfida corrente
    }

    function getAchievementName(challengeId) {
        // Funzione helper per ottenere nomi leggibili
        const nameMap = {
             'self-assessment': 'Auto-Valutazione',
             'truth-assimilation': 'Assimilazione Verità',
             '20-trade-series': 'Serie 20 Trade',
             'psych-journal': 'Diario Psicologico',
             // Aggiungi altre mappature
         };
         return nameMap[challengeId] || challengeId.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase());
    }

    // --- Quiz Logic ---
    function displayQuiz(challengeId) {
        quizTitleEl.textContent = `Quiz: ${getAchievementName(challengeId)}`;
        quizErrorEl.style.display = 'none'; // Nascondi errori precedenti
        quizQuestionsDiv.innerHTML = ''; // Pulisci domande precedenti

        // Dati dei quiz (esempio - dovresti averne di più e specifici per ID)
        const quizzes = {
            'self-assessment': [
                { q: "Qual è la causa principale degli errori nel trading secondo 'Trading in the Zone'?", o: ["Analisi sbagliata", "Psicologia/Mentalità", "Mancanza di capitale", "Sfortuna"], a: 1 }, // Indice risposta corretta (0-based)
                { q: "Cosa significa 'accettare il rischio'?", o: ["Piazzare uno stop loss", "Rischiare molto per guadagnare molto", "Essere in pace con un esito incerto", "Non fare trading"], a: 2 },
                { q: "Il mercato genera informazioni:", o: ["Positive o Negative", "Sempre Negative", "Sempre Positive", "Neutre"], a: 3 }
            ],
            // Aggiungi qui altri quiz per altri challengeId
             'default-quiz': [ { q: "Domanda Placeholder?", o: ["Opzione 1", "Opzione 2"], a: 0}]
        };

        const questions = quizzes[challengeId] || quizzes['default-quiz'];

        questions.forEach((item, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.classList.add('quiz-question');
            let optionsHTML = '<div class="quiz-options">';
            item.o.forEach((option, optionIndex) => {
                optionsHTML += `
                    <label>
                        <input type="radio" name="q${index}" value="${optionIndex}" required>
                        ${option}
                    </label>
                `;
            });
            optionsHTML += '</div>';
            questionDiv.innerHTML = `<p>${index + 1}. ${item.q}</p>${optionsHTML}`;
            quizQuestionsDiv.appendChild(questionDiv);
        });

         // Salva le risposte corrette nel form per un facile accesso
         quizForm.dataset.correctAnswers = JSON.stringify(questions.map(item => item.a));
    }

    function handleSubmitQuiz(event) {
        event.preventDefault();
        if (!currentChallengeData) return; // Non dovrebbe succedere

        const correctAnswers = JSON.parse(quizForm.dataset.correctAnswers || '[]');
        const formData = new FormData(quizForm);
        let score = 0;
        let totalQuestions = correctAnswers.length;

        for (let i = 0; i < totalQuestions; i++) {
            const userAnswer = formData.get(`q${i}`);
            if (userAnswer !== null && parseInt(userAnswer, 10) === correctAnswers[i]) {
                score++;
            }
        }

        const scorePercentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;
        console.log(`Quiz score: ${score}/${totalQuestions} (${scorePercentage.toFixed(0)}%)`);

        // **Modifica qui la soglia se necessario**
        const passingThreshold = 80;

        if (scorePercentage >= passingThreshold) {
            completeChallenge(currentChallengeData.id, currentChallengeData.reward);
            closeModal('quizModal');
        } else {
            quizErrorEl.textContent = `Punteggio non sufficiente (${scorePercentage.toFixed(0)}%). Riprova!`;
            quizErrorEl.style.display = 'block';
        }
    }

    // --- Reflection Logic ---
    function displayReflection(challengeId) {
        reflectionTitleEl.textContent = `Riflessione: ${getAchievementName(challengeId)}`;
        reflectionErrorEl.style.display = 'none';
        reflectionTextEl.value = ''; // Pulisci textarea
        // Potresti personalizzare il label qui se necessario
        reflectionLabelEl.textContent = challengeId === 'psych-journal'
            ? "Conferma di aver tenuto il diario e inserisci una breve sintesi/osservazione chiave:"
            : "Inserisci la tua riflessione sulla sfida:";
    }

    function handleSubmitReflection(event) {
        event.preventDefault();
        if (!currentChallengeData) return;

        const reflectionText = reflectionTextEl.value.trim();

        if (reflectionText.length > 10) { // Controllo base sulla lunghezza
            completeChallenge(currentChallengeData.id, currentChallengeData.reward);
            closeModal('reflectionModal');
        } else {
             reflectionErrorEl.textContent = "Per favore, inserisci una riflessione più dettagliata (min. 10 caratteri).";
             reflectionErrorEl.style.display = 'block';
        }
    }

     // --- Simulation Confirmation Logic ---
     function displaySimulationConfirmation(challengeId) {
         simulationTitleEl.textContent = `Sfida: ${getAchievementName(challengeId)}`;
         // Descrizione specifica per la sfida della serie di 20 trade
         if (challengeId === '20-trade-series') {
              simulationDescriptionEl.textContent = "Questa sfida richiede l'esecuzione disciplinata di 20 trade consecutivi secondo il tuo edge definito, come descritto nel framework. Conferma di aver compreso l'impegno e di aver completato (o che stai per iniziare seriamente) la serie per ricevere i token.";
         } else {
              // Descrizione generica per altre simulazioni
               simulationDescriptionEl.textContent = "Questa sfida richiede un'attività esterna o simulata. Conferma di aver compreso e completato l'attività per ricevere i token.";
         }
     }

     function handleSubmitSimulation(event) {
          event.preventDefault();
          if (!currentChallengeData) return;

          // Per le simulazioni, il completamento è basato sulla conferma dell'utente
          completeChallenge(currentChallengeData.id, currentChallengeData.reward);
          closeModal('simulationModal');
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
        loginBtn?.addEventListener('click', () => openModal('loginModal'));
        signupBtn?.addEventListener('click', () => openModal('signupModal'));
        walletBtn?.addEventListener('click', () => openModal('walletModal'));
        logoutBtn?.addEventListener('click', handleLogout);
        connectWalletBtn?.addEventListener('click', connectWallet);
        disconnectWalletBtn?.addEventListener('click', disconnectWallet);

        document.getElementById('login-form')?.addEventListener('submit', handleLogin);
        document.getElementById('signup-form')?.addEventListener('submit', handleSignup);

        closeModalsBtns.forEach(btn => {
            btn.addEventListener('click', () => closeModal(btn.dataset.modalId));
        });

        switchModalsLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                switchModalUI(link.dataset.from, link.dataset.to);
            });
        });

         challengeLinks.forEach(link => {
            link.addEventListener('click', handleChallengeClick);
         });

         // Listeners per i form delle sfide
         quizForm?.addEventListener('submit', handleSubmitQuiz);
         reflectionForm?.addEventListener('submit', handleSubmitReflection);
         simulationForm?.addEventListener('submit', handleSubmitSimulation);


        // Highlight nav link on scroll
        window.addEventListener('scroll', highlightActiveNavLink);

        // Chiudi modal cliccando fuori (assicurati che funzioni ancora)
         window.addEventListener('click', (event) => {
            modals.forEach(modal => {
                if (event.target == modal) {
                    closeModal(modal.id);
                }
            });
        });
    }

    // --- Initialization ---
    function initializeApp() {
        loadStateFromLocalStorage();
        updateLoginStateUI();
        updateWalletModalUI();
        updateTokenDisplayUI();
        highlightActiveNavLink();
        setupEventListeners();
        console.log("Trading Mindset App Initialized with interactive challenges.");
    }

    initializeApp(); // Avvia l'applicazione

}); // End DOMContentLoaded