document.addEventListener('DOMContentLoaded', () => {
    // --- State Variables ---
    let isLoggedIn = false;
    let walletConnected = false;
    let currentTokens = 0;
    let userAchievements = []; // Rinominato per chiarezza
    let username = '';

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

    // Wallet Modal Elements
    const walletConnectedContent = document.getElementById('wallet-connected-content');
    const walletConnectContent = document.getElementById('wallet-connect-content');
    const walletTokenCountEl = document.getElementById('wallet-token-count');
    const walletAddressEl = document.getElementById('wallet-address');
    const achievementsListEl = document.getElementById('achievements-list');
    const connectWalletBtn = document.getElementById('connect-wallet-btn');
    const disconnectWalletBtn = document.getElementById('disconnect-wallet-btn');

    // --- Modal Functions ---
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            if (modalId === 'walletModal') updateWalletModalUI(); // Aggiorna UI prima di mostrare
            modal.style.display = "block";
        }
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = "none";
        }
    }

    function switchModalUI(fromModalId, toModalId) {
        closeModal(fromModalId);
        openModal(toModalId);
    }

    // --- Login/Signup/Logout Functions (Simulated) ---
    function handleLogin(event) {
        event.preventDefault();
        // Simulate getting username from form
        username = document.getElementById('login-email').value.split('@')[0]; // Simple username extraction
        isLoggedIn = true;
        updateLoginStateUI();
        closeModal('loginModal');
        showNotification("Accesso effettuato!", 'info');
        console.log("User logged in:", username);
    }

     function handleSignup(event) {
        event.preventDefault();
        // Simulate getting username from form
        username = document.getElementById('signup-name').value || 'NuovoUtente';
        isLoggedIn = true;
        updateLoginStateUI();
        closeModal('signupModal');
        showNotification(`Registrazione completata! Benvenuto, ${username}!`, 'success');
        console.log("User signed up and logged in:", username);
    }

    function handleLogout() {
        isLoggedIn = false;
        username = '';
        // Potremmo anche disconnettere il wallet al logout, o chiedere all'utente
        // walletConnected = false;
        // userAchievements = [];
        // currentTokens = 0;
        updateLoginStateUI();
        updateTokenDisplayUI();
        updateWalletModalUI(); // Aggiorna il modal wallet allo stato disconnesso
        showNotification("Logout effettuato.", 'info');
        console.log("User logged out");
    }

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
         updateTokenDisplayUI(); // Assicura che il bilancio sia visibile/nascosto correttamente
    }


    // --- Wallet Functions (Simulated) ---
    function connectWallet() {
        console.log("Connecting wallet...");
        walletConnected = true;
        const achievementId = 'wallet-connect';
        const reward = 5;
        const achievementName = 'Wallet Collegato';

        // Aggiungi achievement solo se non presente
        if (!userAchievements.some(ach => ach.id === achievementId)) {
            currentTokens += reward;
            userAchievements.push({ id: achievementId, name: achievementName, tokens: reward });
            showNotification(`Wallet collegato! Hai ricevuto ${reward} TRAD.`, 'success');
        } else {
            showNotification(`Wallet già collegato.`, 'info');
        }

        updateWalletModalUI();
        updateTokenDisplayUI();
        // closeModal('walletModal'); // Opzionale: chiudere dopo connessione
    }

    function disconnectWallet() {
        console.log("Disconnecting wallet...");
        walletConnected = false;
        // Decidi se rimuovere l'achievement o resettare i token al disconnect
        // userAchievements = userAchievements.filter(ach => ach.id !== 'wallet-connect');
        updateWalletModalUI();
        updateTokenDisplayUI();
        showNotification("Wallet disconnesso.", 'info');
    }

    function updateWalletModalUI() {
        if (walletConnected) {
            walletConnectedContent.style.display = 'block';
            walletConnectContent.style.display = 'none';
            walletTokenCountEl.textContent = currentTokens;
            // Genera un indirizzo fittizio statico per la sessione
            if (!walletAddressEl.textContent || walletAddressEl.textContent.length < 40) {
                 walletAddressEl.textContent = '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
            }

            achievementsListEl.innerHTML = ''; // Pulisce
            if (userAchievements.length > 0) {
                 userAchievements.sort((a,b) => a.name.localeCompare(b.name)); // Ordina achievements
                 userAchievements.forEach(ach => {
                    const div = document.createElement('div');
                    div.classList.add('achievement');
                    // Potremmo mappare ID a icone specifiche
                    let iconClass = 'fa-trophy'; // Default
                    if (ach.id.includes('quiz') || ach.id.includes('assessment')) iconClass = 'fa-question-circle';
                    if (ach.id.includes('series') || ach.id.includes('exercise')) iconClass = 'fa-dumbbell';
                    if (ach.id.includes('journal')) iconClass = 'fa-book-open';
                    if (ach.id.includes('truth')) iconClass = 'fa-check-double';


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

    function updateTokenDisplayUI() {
        tokenCountEl.textContent = currentTokens;
        tokenBalanceEl.style.display = (isLoggedIn && walletConnected) ? 'flex' : 'none';
    }


    // --- Challenge Functions (Simulated) ---
    function handleChallengeClick(event) {
        event.preventDefault(); // Previene il comportamento di default del link
        const link = event.currentTarget;
        const challengeId = link.dataset.challengeId;
        const reward = parseInt(link.dataset.reward, 10);

        if (!isLoggedIn) {
            showNotification("Devi accedere o registrarti per le sfide.", 'error');
            openModal('loginModal');
            return;
        }
        if (!walletConnected) {
            showNotification("Devi collegare il tuo wallet per guadagnare token.", 'error');
            openModal('walletModal');
            return;
        }
        if (userAchievements.some(ach => ach.id === challengeId)) {
            showNotification("Hai già completato questa sfida!", 'info');
            return;
        }

        console.log(`Starting challenge: ${challengeId}, Reward: ${reward} TRAD`);
        // Mostra un feedback all'utente che la sfida è iniziata (opzionale)
        showNotification(`Inizio sfida "${challengeId}"...`, 'info');

        // Simuliamo il completamento
        setTimeout(() => {
            completeChallenge(challengeId, reward);
        }, 2000); // Simula 2 secondi
    }

    function completeChallenge(challengeId, tokenReward) {
        // Controllo ridondante per sicurezza
        if (userAchievements.some(ach => ach.id === challengeId)) return;

        console.log(`Challenge completed: ${challengeId}`);
        currentTokens += tokenReward;

        // Mappa ID a nomi più leggibili (come prima)
         let achievementName = challengeId.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase());
         const nameMap = { /* ... come prima ... */
             'self-assessment': 'Auto-Valutazione Completata',
             'truth-assimilation': 'Assimilazione Verità Fondamentali',
             '20-trade-series': 'Serie 20 Trade Eseguita',
             'psych-journal': 'Diario Psicologico Compilato',
             // Aggiungi altre mappature necessarie
         };
         achievementName = nameMap[challengeId] || achievementName;

        userAchievements.push({ id: challengeId, name: achievementName, tokens: tokenReward });

        updateTokenDisplayUI();
        showNotification(`Sfida "${achievementName}" completata! Hai guadagnato ${tokenReward} TRAD.`, 'success');
        if(document.getElementById('walletModal').style.display === 'block') {
            updateWalletModalUI(); // Aggiorna il modal se è aperto
        }
    }


    // --- Notification Function ---
    function showNotification(message, type = 'success') { // Types: success, error, info
        const notification = document.createElement('div');
        notification.classList.add('notification');

        let iconClass = 'fa-check-circle'; // Default success
        if (type === 'error') {
            notification.classList.add('error');
            iconClass = 'fa-times-circle';
        } else if (type === 'info') {
            notification.classList.add('info');
            iconClass = 'fa-info-circle';
        }

        notification.innerHTML = `<i class="fas ${iconClass}"></i> ${message}`;
        notificationArea.appendChild(notification);

        // Forza il reflow per applicare la transizione iniziale
        void notification.offsetWidth;

        // Mostra notifica
        notification.classList.add('show');

        // Nascondi e rimuovi dopo un po'
        setTimeout(() => {
            notification.classList.remove('show');
            // Rimuovi l'elemento dopo che la transizione è finita
            notification.addEventListener('transitionend', () => {
                notification.remove();
            });
        }, 4000); // Nasconde dopo 4 secondi
    }


    // --- Navigation Highlight (Active Link) ---
    function highlightActiveNavLink() {
        let currentSectionId = '';
        const sections = document.querySelectorAll('main.container section');
        const offset = document.querySelector('.toolbar').offsetHeight + document.querySelector('nav').offsetHeight + 50; // Offset per attivazione link

        sections.forEach(section => {
            const sectionTop = section.offsetTop - offset;
            const sectionBottom = sectionTop + section.offsetHeight;
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionBottom) {
                currentSectionId = section.getAttribute('id');
            }
        });

         // Caso speciale per l'inizio pagina o la fine
         if (window.pageYOffset < sections[0].offsetTop - offset) {
             currentSectionId = sections[0].getAttribute('id');
         }
         if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 50) { // Vicino alla fine
             currentSectionId = sections[sections.length - 1].getAttribute('id');
         }


        document.querySelectorAll('nav ul li a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }


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

    // Highlight nav link on scroll and load
    window.addEventListener('scroll', highlightActiveNavLink);


    // --- Initialization ---
    updateLoginStateUI(); // Imposta stato iniziale bottoni login/logout
    updateWalletModalUI(); // Imposta stato iniziale modal wallet
    updateTokenDisplayUI(); // Imposta stato iniziale token display
    highlightActiveNavLink(); // Evidenzia link navigazione iniziale

    console.log("Trading Mindset App Initialized");

}); // End DOMContentLoaded