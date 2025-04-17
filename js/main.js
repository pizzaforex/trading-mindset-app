document.addEventListener('DOMContentLoaded', () => {
    // --- State Variables ---
    let isLoggedIn = false;
    let walletConnected = false;
    let currentTokens = 0;
    let userAchievements = [];
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
    const dynamicContentArea = document.getElementById('dynamic-content-area'); // Area for dynamic content
    const mainNav = document.getElementById('main-nav'); // Navigation container

    // Wallet Modal Elements
    const walletConnectedContent = document.getElementById('wallet-connected-content');
    const walletConnectContent = document.getElementById('wallet-connect-content');
    const walletTokenCountEl = document.getElementById('wallet-token-count');
    const walletAddressEl = document.getElementById('wallet-address');
    const achievementsListEl = document.getElementById('achievements-list');
    const connectWalletBtn = document.getElementById('connect-wallet-btn');
    const disconnectWalletBtn = document.getElementById('disconnect-wallet-btn');

    // --- Content Library (Store different page/topic contents here) ---
    const contentLibrary = {
        'trading-zone': {
            pageTitle: 'Trading in the Zone - Padroneggia la Mentalità del Trader',
            sections: [
                {
                    id: 'introduzione',
                    title: 'Introduzione: Il Dilemma del Trader',
                    icon: 'fa-door-open',
                    content: `
                        <p>Benvenuto nel percorso verso la maestria nel trading. Molti aspiranti trader si concentrano quasi esclusivamente sull'analisi di mercato, sulla ricerca dell'indicatore "perfetto" o sulla strategia infallibile. Tuttavia, anche con un sistema valido, la maggior parte fallisce nel raggiungere una profittabilità costante. Perché? La risposta risiede in un'area spesso trascurata: la <span class="concept">psicologia del trading</span>.</p>
                        <p>"Trading in the Zone", capolavoro di Mark Douglas, svela come le nostre credenze, paure e atteggiamenti mentali siano i veri motori (o freni) del nostro successo sui mercati. Non si tratta di prevedere il futuro con certezza, ma di sviluppare una <span class="concept">mentalità da trader</span> che permetta di operare in modo disciplinato, obiettivo e senza stress emotivo, anche di fronte all'incertezza intrinseca del mercato.</p>
                        <h3>Perché la Maggior Parte dei Trader Fallisce?</h3>
                        <p>La risposta risiede nella psicologia. Il mercato è un ambiente unico che mette a nudo le nostre debolezze emotive come nessun altro:</p>
                        <ul>
                            <li>Reazioni emotive (paura, avidità, speranza, rimpianto) che portano a decisioni impulsive e irrazionali.</li>
                            <li>Difficoltà nell'accettare le perdite come parte integrante del business, portando a "revenge trading" o a blocchi operativi.</li>
                            <li>Incapacità di eseguire il proprio piano di trading in modo consistente a causa di dubbi e seconde ipotesi.</li>
                            <li>Errori ripetuti nonostante la conoscenza teorica, indicando un divario tra ciò che si sa e ciò che si riesce a fare.</li>
                        </ul>
                        <p>La <span class="concept">soluzione</span> non è necessariamente cercare più informazioni o analisi complesse, ma lavorare profondamente sullo sviluppo di una <span class="concept">mentalità da trader</span> che allinei le nostre credenze e aspettative alla realtà probabilistica del mercato.</p>
                    `,
                    challenges: [
                        { id: 'self-assessment', title: 'Sfida Iniziale: Auto-Valutazione', description: 'Rifletti onestamente sulle tue maggiori difficoltà psicologiche nel trading. Quali emozioni ti influenzano di più? In quali situazioni tendi a deviare dal tuo piano?', reward: 10, linkText: 'Inizia Valutazione' }
                    ]
                },
                {
                    id: 'principi',
                    title: 'Principi Chiave della Mentalità Vincente',
                    icon: 'fa-key',
                    content: `
                        <p>Per operare efficacemente nell'"incertezza" del mercato, è necessario ristrutturare il proprio pensiero attorno ad alcuni principi fondamentali che contrastano con le nostre intuizioni quotidiane.</p>
                        <div class="card" style="margin-top: 2rem;">
                            <h3><i class="fas fa-shield-alt icon-danger"></i> 1. Accettare Pienamente il Rischio</h3>
                            <p>Il rischio nel trading non è solo la possibilità di perdere denaro, ma l'intrinseca incertezza di ogni singolo trade. Accettare il rischio significa riconoscere che ogni operazione ha un esito potenzialmente negativo, che questo esito è fuori dal nostro controllo diretto una volta entrati, e che va bene così. La vera accettazione elimina la paura di sbagliare e la speranza irrazionale, permettendo un'esecuzione più fluida e obiettiva.</p>
                            <div class="mental-pitfalls"><h4><i class="fas fa-exclamation-triangle"></i> Trappola: Falsa Accettazione</h4><p>Molti credono di accettare il rischio solo perché piazzano uno stop-loss. La vera accettazione è emotiva e mentale: è la capacità di contemplare lo scenario peggiore senza disagio emotivo PRIMA di entrare nel trade.</p></div>
                        </div>
                        <div class="card" style="margin-top: 2rem;">
                            <h3><i class="fas fa-dice icon-success"></i> 2. Pensare in Termini di Probabilità</h3>
                            <p>Il mercato si muove in probabilità, non in certezze. Nessun singolo trade ha un esito garantito, indipendentemente da quanto "buono" appaia il setup. Un <span class="concept">edge</span> (vantaggio statistico) si manifesta solo su una serie di operazioni, non su una singola. Pensare in probabilità significa concentrarsi sulla corretta applicazione del proprio edge nel lungo periodo, sapendo che ci saranno trade vincenti e perdenti, e che la distribuzione tra i due è statisticamente prevedibile ma individualmente casuale. Questo libera dalla pressione di "avere ragione" su ogni trade.</p>
                        </div>
                        <div class="card" style="margin-top: 2rem;">
                            <h3><i class="fas fa-list-check icon-secondary"></i> 3. Le 5 Verità Fondamentali</h3>
                            <p>Queste verità, se integrate come credenze profonde, creano un framework mentale che neutralizza le reazioni emotive disfunzionali:</p>
                            <ol class="principles-list" style="margin-top: 0;">
                                 <li><strong>Tutto può succedere.</strong><div class="tooltip">?<span class="tooltiptext">Il mercato può fare qualsiasi cosa in qualsiasi momento; non esistono certezze.</span></div></li>
                                 <li><strong>Non hai bisogno di sapere cosa succederà dopo per fare soldi.</strong><div class="tooltip">?<span class="tooltiptext">Un edge probabilistico non richiede previsioni accurate sul singolo evento.</span></div></li>
                                 <li><strong>C'è una distribuzione casuale tra trade vincenti e perdenti per qualsiasi set di variabili che definisce un edge.</strong><div class="tooltip">?<span class="tooltiptext">Non puoi sapere in anticipo quale trade sarà vincente e quale perdente, anche con un edge valido.</span></div></li>
                                 <li><strong>Un edge è solo una probabilità maggiore che una cosa accada rispetto a un'altra.</strong><div class="tooltip">?<span class="tooltiptext">Niente di più, niente di meno. Non garantisce il successo sul singolo trade.</span></div></li>
                                 <li><strong>Ogni momento nel mercato è unico.</strong><div class="tooltip">?<span class="tooltiptext">Anche se un setup sembra identico al passato, le forze sottostanti sono sempre diverse. Ciò rafforza l'incertezza di ogni singolo trade.</span></div></li>
                             </ol>
                             <p><strong>Beneficio:</strong> Interiorizzare queste verità aiuta a creare un quadro mentale coerente con la natura probabilistica del mercato, riducendo conflitti interni ed errori emotivi.</p>
                        </div>
                    `,
                     challenges: [
                        { id: 'truth-assimilation', title: 'Sfida: Assimilazione Verità', description: 'Scegli una delle 5 Verità Fondamentali e scrivi un breve paragrafo su come potresti applicarla concretamente nel tuo prossimo trade o nella tua analisi.', reward: 15, linkText: 'Invia Riflessione' }
                    ]
                },
                 {
                    id: 'fasi-sviluppo',
                    title: 'Le Fasi di Sviluppo del Trader',
                    icon: 'fa-layer-group',
                    content: `
                        <p>Diventare un trader costantemente profittevole è un processo evolutivo che Mark Douglas suddivide in tre fasi principali. Comprendere queste fasi aiuta a gestire le aspettative e a concentrarsi sugli obiettivi giusti in ogni momento.</p>
                        <div class="flex-container">
                            <div class="flex-item card">
                                <h4><i class="fas fa-cogs"></i> 1. Fase Meccanica</h4>
                                <p>L'obiettivo primario è costruire fiducia nella propria capacità di eseguire un sistema senza deviazioni e gestire le proprie emozioni. In questa fase, si opera con un set di regole <span class="concept">rigide e oggettive</span> per definire l'edge, il rischio, l'entrata e l'uscita. Si lavora su un campione di trade (es. 20-25) concentrandosi <span class="concept">esclusivamente sull'esecuzione perfetta</span>, indipendentemente dai risultati economici. Questo costruisce la disciplina, l'accettazione del rischio e dimostra a livello pratico la natura probabilistica dell'edge. È la <strong>fondamenta della consistenza.</strong></p>
                            </div>
                            <div class="flex-item card">
                                <h4><i class="fas fa-lightbulb"></i> 2. Fase Soggettiva</h4>
                                <p>Una volta interiorizzati i principi della mentalità vincente e dimostrata la capacità di operare meccanicamente, il trader può iniziare a introdurre elementi di <span class="concept">giudizio soggettivo</span> basati sull'esperienza e sulla lettura del "flusso" del mercato. Si impara a riconoscere condizioni di mercato particolari o pattern sottili che potrebbero giustificare un aggiustamento delle regole (es. prendere profitti parziali, non fare un trade anche se le regole meccaniche ci sono). Questa fase richiede grande auto-consapevolezza per non ricadere in errori emotivi. Non si può saltare a questa fase se le basi della fase meccanica non sono solide.</p>
                            </div>
                            <div class="flex-item card">
                                <h4><i class="fas fa-brain"></i> 3. Fase Intuitiva</h4>
                                <p>Il livello più avanzato, dove il trading diventa quasi <span class="concept">automatico e istintivo</span>. Il trader ha integrato così profondamente i principi e l'esperienza che opera in uno stato di "flusso", prendendo decisioni rapide e accurate senza un eccessivo pensiero cosciente. L'intuizione qui non è una sensazione casuale, ma il risultato di migliaia di ore di pratica deliberata e osservazione del mercato. Si raggiunge solo dopo aver pienamente padroneggiato le fasi precedenti.</p>
                            </div>
                        </div>
                    ` // No challenges in this section in the original
                },
                {
                    id: 'framework',
                    title: 'Il Framework per la Consistenza: Operare come un Casinò',
                    icon: 'fa-tools',
                    content: `
                        <p>Questa sezione descrive l'esercizio pratico fondamentale proposto da Douglas per passare dalla teoria alla pratica e costruire la mentalità corretta. È il cuore della <span class="concept">Fase Meccanica</span>.</p>
                        <h3>L'Esercizio Base:</h3>
                        <ol>
                            <li><strong>Scegli un Edge:</strong> Identifica un sistema di trading con regole di entrata <span class="concept">oggettive e precise</span>. Non deve essere perfetto, ma deve avere una logica e, idealmente, un backtest positivo (anche se Douglas enfatizza più l'esecuzione che la perfezione del sistema in questa fase).</li>
                            <li><strong>Definisci il Campione:</strong> Impegnati a eseguire <span class="concept">esattamente</span> questo sistema per i prossimi 20 trade (o un numero simile). Questo crea un campione statisticamente significativo per osservare l'edge e la tua capacità di esecuzione.</li>
                            <li><strong>Predefinisci e Accetta il Rischio:</strong> Per ogni trade, determina <span class="concept">prima di entrare</span> l'esatto punto di stop-loss e la quantità di capitale a rischio (es. 1% del capitale). Accetta mentalmente che potresti perdere quella somma.</li>
                            <li><strong>Esegui Senza Esitazione:</strong> Appena le regole del tuo edge si verificano, <span class="concept">agisci immediatamente</span>. Non dubitare, non aspettare conferme extra, non farti influenzare dalle emozioni.</li>
                            <li><strong>Gestisci il Trade:</strong> Segui le tue regole predefinite per la gestione del trade (es. trailing stop, target di profitto fisso) <span class="concept">senza intervento soggettivo</span>. Lascia che sia il mercato a decidere l'esito secondo le tue regole.</li>
                            <li><strong>Non Giudicare i Risultati Singoli:</strong> Valuta il tuo successo sulla <span class="concept">qualità dell'esecuzione</span> delle regole per l'intero campione di 20 trade, non sul profitto o perdita di ogni singolo trade.</li>
                        </ol>
                        <div class="card consistency-principles">
                             <h3><i class="fas fa-clipboard-check"></i> I 7 Principi Guida della Consistenza</h3>
                             <p>Durante l'esercizio (e idealmente sempre), mantieni questi principi attivi nella tua mente:</p>
                             <ol class="principles-list" style="font-size: 1.05em;">
                                 <li><strong>Definisco oggettivamente il mio edge.</strong></li>
                                 <li><strong>Predefinisco il rischio di ogni trade.</strong></li>
                                 <li><strong>Accetto completamente il rischio (sono disposto a perdere).</strong></li>
                                 <li><strong>Applico il mio edge senza riserve o esitazioni.</strong></li>
                                 <li><strong>Prendo profitto quando il mercato rende disponibile il denaro secondo le mie regole.</strong></li>
                                 <li><strong>Monitoro continuamente la mia suscettibilità a commettere errori (e agisco per correggerli).</strong></li>
                                 <li><strong>Capisco la necessità assoluta di questi principi di consistenza e quindi non li violo mai.</strong></li>
                             </ol>
                        </div>
                    `,
                     challenges: [
                        { id: '20-trade-series', title: 'Sfida Chiave: Serie di 20 Trade', description: 'Applica l\'esercizio "Operare come un Casinò" per i tuoi prossimi 20 trade (reali o simulati). Concentrati SOLO sull\'esecuzione perfetta delle tue regole predefinite. Tieni un diario dettagliato.', reward: 50, linkText: 'Inizia la Serie Simulata' } // Simulata link is just a placeholder
                    ]
                },
                 {
                    id: 'risorse',
                    title: 'Risorse e Prossimi Passi',
                    icon: 'fa-graduation-cap',
                    content: `
                        <p>Padroneggiare la mentalità del trading è un viaggio continuo di auto-scoperta e pratica deliberata. Le idee presentate qui sono solo l'inizio.</p>
                        <div class="resources">
                            <h4><i class="fas fa-book"></i> Letture Consigliate</h4>
                            <ul>
                                <li>"Trading in the Zone" di Mark Douglas: Il testo fondamentale su cui si basa questa sintesi. Da leggere e rileggere.</li>
                                <li>"The Disciplined Trader" di Mark Douglas: Il suo primo libro, più denso ma altrettanto importante.</li>
                                <li>"Market Wizards" di Jack Schwager: Interviste a top trader che spesso confermano l'importanza della psicologia.</li>
                                <li>"Thinking, Fast and Slow" di Daniel Kahneman: Utile per capire i bias cognitivi che influenzano le decisioni.</li>
                            </ul>
                            <h4><i class="fas fa-link"></i> Strumenti Utili</h4>
                            <ul>
                                <li>Diario di Trading Psicologico: Fondamentale per tracciare non solo i trade, ma anche pensieri, emozioni e deviazioni dal piano.</li>
                                <li>Software di Backtesting: Utile per testare oggettivamente strategie e costruire fiducia in un edge.</li>
                                <li>Comunità di Trader (Selezionate): Confrontarsi con altri trader focalizzati sulla mentalità può essere utile (ma attenzione a non farsi influenzare negativamente).</li>
                            </ul>
                            <h4><i class="fas fa-chalkboard-teacher"></i> Coaching e Supporto</h4>
                            <ul>
                                <li>Considera un coaching specifico sulla psicologia del trading se trovi difficoltà persistenti.</li>
                            </ul>
                        </div>

                        <p style="margin-top: 2rem; text-align: center;">Ricorda: la consistenza non si trova nel mercato, ma dentro di te.</p>
                        <div style="text-align: center; margin-top: 2rem;">
                           <!-- <a href="#top" class="cta-button">Torna su</a> --> <!-- Removed as scrolling handled differently now -->
                        </div>
                    `,
                     challenges: [
                        { id: 'psych-journal', title: 'Sfida: Diario Psicologico', description: 'Tieni un diario psicologico dettagliato per almeno una settimana di trading. Annota pensieri, emozioni e decisioni per ogni trade.', reward: 30, linkText: 'Scarica Template Diario' } // Template link is placeholder
                    ]
                }
            ]
        },
        'placeholder-1': {
            pageTitle: 'Analisi Tecnica - Concetti Base',
            sections: [
                 {
                    id: 'intro-ta',
                    title: 'Introduzione all\'Analisi Tecnica',
                    icon: 'fa-chart-line',
                    content: `<p>Questa sezione è un placeholder per contenuti sull'analisi tecnica. Qui potresti spiegare cos'è l'analisi tecnica, i suoi presupposti (il prezzo sconta tutto, i prezzi si muovono in trend, la storia si ripete), e i suoi strumenti principali.</p>
                             <div class="card"><p>Contenuto sull'Analisi Tecnica verrà inserito qui.</p></div>`,
                    challenges: []
                 }
            ]
        },
        'placeholder-2': {
             pageTitle: 'Gestione del Rischio Fondamentale',
             sections: [
                 {
                    id: 'intro-risk',
                    title: 'Introduzione alla Gestione del Rischio',
                    icon: 'fa-shield-halved',
                    content: `<p>Questa sezione è un placeholder per contenuti sulla gestione del rischio. Qui potresti parlare dell'importanza del risk management, position sizing, stop loss, rapporto rischio/rendimento, etc.</p>
                              <div class="card"><p>Contenuto sulla Gestione del Rischio verrà inserito qui.</p></div>`,
                     challenges: []
                 }
             ]
        }
        // Add more content keys (e.g., 'technical-analysis', 'risk-management') here
    };

    // --- Modal Functions (Unchanged) ---
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            if (modalId === 'walletModal') updateWalletModalUI();
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

    // --- Login/Signup/Logout Functions (Unchanged) ---
    function handleLogin(event) {
        event.preventDefault();
        username = document.getElementById('login-email').value.split('@')[0];
        isLoggedIn = true;
        updateLoginStateUI();
        closeModal('loginModal');
        showNotification("Accesso effettuato!", 'info');
        console.log("User logged in:", username);
    }

     function handleSignup(event) {
        event.preventDefault();
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
        updateLoginStateUI();
        updateTokenDisplayUI();
        updateWalletModalUI();
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
         updateTokenDisplayUI();
    }

    // --- Wallet Functions (Unchanged) ---
    function connectWallet() {
        console.log("Connecting wallet...");
        walletConnected = true;
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

        updateWalletModalUI();
        updateTokenDisplayUI();
    }

    function disconnectWallet() {
        console.log("Disconnecting wallet...");
        walletConnected = false;
        updateWalletModalUI();
        updateTokenDisplayUI();
        showNotification("Wallet disconnesso.", 'info');
    }

     function updateWalletModalUI() {
        if (walletConnected) {
            walletConnectedContent.style.display = 'block';
            walletConnectContent.style.display = 'none';
            walletTokenCountEl.textContent = currentTokens;
            if (!walletAddressEl.textContent || walletAddressEl.textContent.length < 40) {
                 walletAddressEl.textContent = '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
            }

            achievementsListEl.innerHTML = '';
            if (userAchievements.length > 0) {
                 userAchievements.sort((a,b) => a.name.localeCompare(b.name));
                 userAchievements.forEach(ach => {
                    const div = document.createElement('div');
                    div.classList.add('achievement');
                    let iconClass = 'fa-trophy';
                    if (ach.id.includes('quiz') || ach.id.includes('assessment')) iconClass = 'fa-question-circle';
                    if (ach.id.includes('series') || ach.id.includes('exercise')) iconClass = 'fa-dumbbell';
                    if (ach.id.includes('journal')) iconClass = 'fa-book-open';
                    if (ach.id.includes('truth')) iconClass = 'fa-check-double';
                    if (ach.id === 'wallet-connect') iconClass = 'fa-wallet'; // Specific icon for wallet

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

    // --- Challenge Functions (Slight modification for re-attachment) ---
    function handleChallengeClick(event) { // This function remains largely the same
        event.preventDefault();
        const link = event.currentTarget;
        const challengeId = link.dataset.challengeId;
        const reward = parseInt(link.dataset.reward, 10);

        if (!isLoggedIn) {
            showNotification("Devi accedere o registrarti per le sfide.", 'error');
            openModal('loginModal'); return;
        }
        if (!walletConnected) {
            showNotification("Devi collegare il tuo wallet per guadagnare token.", 'error');
            openModal('walletModal'); return;
        }
        if (userAchievements.some(ach => ach.id === challengeId)) {
            showNotification("Hai già completato questa sfida!", 'info'); return;
        }

        console.log(`Starting challenge: ${challengeId}, Reward: ${reward} TRAD`);
        showNotification(`Inizio sfida "${challengeId}"...`, 'info');

        setTimeout(() => {
            completeChallenge(challengeId, reward);
        }, 1500); // Simulate 1.5 seconds
    }

    function completeChallenge(challengeId, tokenReward) {
        if (userAchievements.some(ach => ach.id === challengeId)) return;

        console.log(`Challenge completed: ${challengeId}`);
        currentTokens += tokenReward;

        let achievementName = challengeId.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase());
        const nameMap = {
             'self-assessment': 'Auto-Valutazione Completata',
             'truth-assimilation': 'Assimilazione Verità Fondamentali',
             '20-trade-series': 'Serie 20 Trade Eseguita',
             'psych-journal': 'Diario Psicologico Compilato',
             // Add other mappings if needed
         };
         achievementName = nameMap[challengeId] || achievementName;

        userAchievements.push({ id: challengeId, name: achievementName, tokens: tokenReward });

        updateTokenDisplayUI();
        showNotification(`Sfida "${achievementName}" completata! Hai guadagnato ${tokenReward} TRAD.`, 'success');
        if(document.getElementById('walletModal').style.display === 'block') {
            updateWalletModalUI();
        }
         // Maybe disable the completed challenge button visually
         const completedLink = dynamicContentArea.querySelector(`.challenge-link[data-challenge-id="${challengeId}"]`);
         if (completedLink) {
             completedLink.style.opacity = '0.6';
             completedLink.style.pointerEvents = 'none';
             completedLink.textContent = 'Completata';
         }
    }

    // --- Notification Function (Unchanged) ---
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.classList.add('notification');

        let iconClass = 'fa-check-circle';
        if (type === 'error') {
            notification.classList.add('error'); iconClass = 'fa-times-circle';
        } else if (type === 'info') {
            notification.classList.add('info'); iconClass = 'fa-info-circle';
        }

        notification.innerHTML = `<i class="fas ${iconClass}"></i> ${message}`;
        notificationArea.appendChild(notification);
        void notification.offsetWidth; // Reflow
        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
            notification.addEventListener('transitionend', () => notification.remove());
        }, 4000);
    }

    // --- Navigation Highlight (Active Link) ---
    // Modified to work with dynamic content loading based on data-content-key
    function highlightActiveNavLink(activeKey) {
        document.querySelectorAll('#main-nav ul li a').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.contentKey === activeKey) {
                link.classList.add('active');
            }
        });
    }

    // --- *** NEW: Content Rendering Functions *** ---

    /**
     * Renders a single section based on the data provided.
     * @param {object} sectionData - The data object for the section.
     * @returns {string} - The HTML string for the section.
     */
    function renderContentSection(sectionData) {
        let challengesHTML = '';
        if (sectionData.challenges && sectionData.challenges.length > 0) {
            challengesHTML = sectionData.challenges.map(challenge => {
                // Check if challenge is already completed
                const isCompleted = userAchievements.some(ach => ach.id === challenge.id);
                const linkText = isCompleted ? 'Completata' : (challenge.linkText || 'Inizia Sfida');
                const linkClass = `resource-link challenge-link ${isCompleted ? 'completed' : ''}`;
                const linkStyle = isCompleted ? 'style="opacity: 0.6; pointer-events: none;"' : '';

                return `
                    <div class="challenge">
                        <div class="token-reward"><i class="fas fa-coins"></i> ${challenge.reward} TRAD</div>
                        <h4><i class="fas fa-tasks"></i> ${challenge.title}</h4>
                        <p>${challenge.description}
                           <a href="#" class="${linkClass}" data-challenge-id="${challenge.id}" data-reward="${challenge.reward}" ${linkStyle}>
                              ${linkText}
                           </a>
                        </p>
                    </div>
                `;
            }).join('');
        }

        // Construct the section HTML using template literals
        return `
            <section id="${sectionData.id}">
                <h2><i class="fas ${sectionData.icon || 'fa-file-alt'}"></i> ${sectionData.title}</h2>
                ${sectionData.content}
                ${challengesHTML}
            </section>
        `;
    }

    /**
     * Loads and renders the content for a given key into the main content area.
     * @param {string} contentKey - The key for the content in contentLibrary.
     */
    function loadContent(contentKey) {
        const contentData = contentLibrary[contentKey];
        if (!contentData) {
            console.error(`Content not found for key: ${contentKey}`);
            dynamicContentArea.innerHTML = `<p style="color: var(--danger-color); text-align: center; padding: 3rem 0;">Errore: Contenuto non trovato.</p>`;
            return;
        }

        console.log(`Loading content for: ${contentKey}`);
        // Set page title (optional)
        document.title = contentData.pageTitle || 'Trading Mindset Platform';

        // Clear previous content
        dynamicContentArea.innerHTML = '';

        // Render each section
        contentData.sections.forEach(section => {
            dynamicContentArea.innerHTML += renderContentSection(section);
        });

        // Re-attach event listeners for dynamic elements (like challenges)
        reAttachEventListeners();

        // Update active navigation link
        highlightActiveNavLink(contentKey);

        // Scroll to top of content area
         // Scroll to the top of the main content area smoothly
        dynamicContentArea.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Optionally, update browser history (more advanced, needs router)
        // history.pushState({ contentKey: contentKey }, '', `#${contentKey}`);
    }

    /**
     * Re-attaches event listeners to dynamically added elements.
     * Currently focuses on challenge links.
     */
    function reAttachEventListeners() {
        const currentChallengeLinks = dynamicContentArea.querySelectorAll('.challenge-link:not(.completed)');
        currentChallengeLinks.forEach(link => {
            // Remove potential old listener before adding new one to prevent duplicates
            // This requires a named function or a more complex listener management if listeners were added differently
            // For simplicity here, we rely on the fact that innerHTML replacement removes old nodes and their listeners.
            // We just add the listener to the newly created links.
            link.addEventListener('click', handleChallengeClick);
        });

         // Re-attach listeners for tooltips if needed (assuming they were part of dynamic content)
        // ...add tooltip listener logic if applicable...
    }

    // --- *** Event Listener Setup *** ---

    // Modals
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

    // Dynamic Content Navigation
    mainNav.addEventListener('click', (e) => {
        // Find the closest ancestor anchor tag with a data-content-key
        const navLink = e.target.closest('a[data-content-key]');
        if (navLink) {
            e.preventDefault(); // Prevent default anchor behavior
            const contentKey = navLink.dataset.contentKey;
            loadContent(contentKey);
        }
    });

     // Remove scroll-based navigation highlighting as it's now click-based
    // window.removeEventListener('scroll', highlightActiveNavLink);


    // --- Initialization ---
    updateLoginStateUI();
    updateWalletModalUI();
    updateTokenDisplayUI();

    // Load initial content (e.g., the 'trading-zone' content)
    loadContent('trading-zone'); // Load the default content on page start

    console.log("Trading Mindset Platform Initialized (Dynamic)");

}); // End DOMContentLoaded