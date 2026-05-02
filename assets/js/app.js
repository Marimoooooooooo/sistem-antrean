/**
 * app.js
 * Core Logic and State Management (with LocalStorage)
 */
const App = {
    state: {
        tickets: [],
        nextId: 1,
        currentlyServing: null,
        history: [], // last 3 called
        isAdminLoggedIn: false,
        myTicketId: null // Stores the ID of the ticket the user just generated
    },
    
    currentSelection: {
        service: ''
    },

    init() {
        this.loadState();
        this.renderAll();
        
        // Auto-refresh wait times every minute
        setInterval(() => {
            this.renderUserTicket();
            this.renderAdminTable();
        }, 60000);
    },

    loadState() {
        const saved = localStorage.getItem('sadt_queue_state');
        if (saved) {
            this.state = JSON.parse(saved);
        }
    },

    saveState() {
        localStorage.setItem('sadt_queue_state', JSON.stringify(this.state));
        this.renderAll();
    },

    // --- User Actions ---
    
    generateTicket() {
        const nameInput = document.getElementById('visitor-name').value.trim();
        const phoneInput = document.getElementById('visitor-phone').value.trim();
        
        const prefix = this.currentSelection.service === 'Layanan Umum' ? 'U-' : 'T-';
        const numStr = this.state.nextId.toString().padStart(3, '0');
        
        const newTicket = {
            id: this.state.nextId++,
            number: `${prefix}${numStr}`,
            service: this.currentSelection.service,
            name: nameInput || 'Tamu',
            phone: phoneInput || '-',
            status: 'waiting', // waiting, serving, completed, skipped
            timestamp: new Date().getTime(),
            timeFormatted: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        };

        this.state.tickets.push(newTicket);
        this.state.myTicketId = newTicket.id;
        this.saveState();

        // Clear form
        document.getElementById('visitor-name').value = '';
        document.getElementById('visitor-phone').value = '';

        Navigation.goToUserStep('ticket');
    },

    takeAnotherTicket() {
        this.state.myTicketId = null;
        this.saveState();
        Navigation.goToUserStep('service');
    },

    printTicket() {
        alert("Menyiapkan PDF untuk Diunduh...\n(Aksi simulasi)");
    },

    // --- Admin Actions ---

    adminLogin() {
        const user = document.getElementById('admin-user').value;
        const pass = document.getElementById('admin-pass').value;
        if (user === 'admin' && pass === 'password') {
            this.state.isAdminLoggedIn = true;
            this.saveState();
            Navigation.goToAdminStep('dashboard');
        } else {
            alert('Kredensial tidak valid. Gunakan admin / password');
        }
    },

    adminLogout() {
        this.state.isAdminLoggedIn = false;
        this.saveState();
        Navigation.goToAdminStep('login');
    },

    simulatePasswordReset() {
        const email = document.getElementById('forgot-email').value;
        if(email) {
            document.getElementById('reset-msg').style.display = 'block';
            setTimeout(() => {
                document.getElementById('reset-msg').style.display = 'none';
                Navigation.goToAdminStep('login');
            }, 3000);
        }
    },

    callTicket(id) {
        const ticket = this.state.tickets.find(t => t.id === id);
        if (!ticket) return;

        if (this.state.currentlyServing) {
            const current = this.state.tickets.find(t => t.id === this.state.currentlyServing.id);
            if(current && current.status === 'serving') current.status = 'completed';
        }

        ticket.status = 'serving';
        this.state.currentlyServing = ticket;

        // Update history (prepend, max 3)
        this.state.history.unshift(ticket);
        if (this.state.history.length > 3) this.state.history.pop();

        this.saveState();

        // Audio Synthesis
        this.announce(ticket.number, 1); // Mock counter 1
    },

    completeTicket(id) {
        const ticket = this.state.tickets.find(t => t.id === id);
        if (ticket) {
            ticket.status = 'completed';
            if (this.state.currentlyServing && this.state.currentlyServing.id === id) {
                this.state.currentlyServing = null;
            }
            this.saveState();
        }
    },

    skipTicket(id) {
        const ticket = this.state.tickets.find(t => t.id === id);
        if (ticket) {
            ticket.status = 'skipped';
            if (this.state.currentlyServing && this.state.currentlyServing.id === id) {
                this.state.currentlyServing = null;
            }
            this.saveState();
        }
    },

    resetQueue() {
        if(confirm("Apakah Anda yakin ingin menghapus semua data?")) {
            this.state = {
                tickets: [],
                nextId: 1,
                currentlyServing: null,
                history: [],
                isAdminLoggedIn: this.state.isAdminLoggedIn,
                myTicketId: null
            };
            this.saveState();
        }
    },

    announce(number, counter) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            
            // Format Suara Eksplisit
            const text = `Nomor antrean ${number}, silakan menuju ke Loket ${counter}.`;
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'id-ID';
            utterance.rate = 0.85;
            utterance.pitch = 1;
            
            let voices = window.speechSynthesis.getVoices();
            if(voices.length > 0) {
                const idVoice = voices.find(v => v.lang.includes('id') || v.lang.includes('ID'));
                if (idVoice) utterance.voice = idVoice;
            }
            window.speechSynthesis.speak(utterance);
        }
    },

    // --- Rendering logic ---

    getTranslation(status) {
        switch(status) {
            case 'waiting': return 'Menunggu';
            case 'serving': return 'Dilayani';
            case 'completed': return 'Selesai';
            case 'skipped': return 'Dilewati';
            default: return status;
        }
    },

    renderAll() {
        this.renderUserTicket();
        this.renderAdminTable();
        this.renderMonitor();
        this.renderStats();
    },

    renderUserTicket() {
        if (!this.state.myTicketId) return;
        const myTicket = this.state.tickets.find(t => t.id === this.state.myTicketId);
        if (!myTicket) return;

        document.getElementById('ticket-service-name').textContent = myTicket.service;
        document.getElementById('user-ticket-number').textContent = myTicket.number;
        document.getElementById('user-ticket-name').textContent = myTicket.name;
        document.getElementById('user-ticket-time').textContent = myTicket.timeFormatted;

        const waitingQueue = this.state.tickets.filter(t => t.status === 'waiting');
        const myIndex = waitingQueue.findIndex(t => t.id === myTicket.id);
        
        const peopleAheadEl = document.getElementById('people-ahead');
        const estWaitEl = document.getElementById('est-wait');
        const progressBar = document.getElementById('wait-progress');
        
        if (myTicket.status === 'waiting') {
            const aheadCount = Math.max(0, myIndex);
            
            // More realistic estimation: Base time + slightly increasing variance
            const estMinutes = aheadCount === 0 ? 2 : aheadCount * 5; 
            
            peopleAheadEl.textContent = aheadCount;
            estWaitEl.textContent = `${estMinutes} menit`;

            let progress = 100 - (aheadCount * 15);
            if(progress < 10) progress = 10;
            progressBar.style.width = `${progress}%`;
            progressBar.style.background = 'var(--accent-gradient)';
        } else if (myTicket.status === 'serving') {
            peopleAheadEl.textContent = 'GILIRAN ANDA';
            estWaitEl.textContent = 'Sekarang';
            progressBar.style.width = `100%`;
            progressBar.style.background = 'var(--success)';
        } else {
            peopleAheadEl.textContent = '-';
            estWaitEl.textContent = this.getTranslation(myTicket.status);
            progressBar.style.width = `100%`;
            progressBar.style.background = 'var(--text-muted)';
        }
    },

    renderAdminTable() {
        const tbody = document.getElementById('admin-table-body');
        if(!tbody) return;
        tbody.innerHTML = '';

        const activeTickets = this.state.tickets.filter(t => ['waiting', 'serving'].includes(t.status));
        
        if (activeTickets.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--text-muted)">Tidak ada tiket aktif dalam antrean</td></tr>`;
            return;
        }

        const now = new Date().getTime();

        activeTickets.forEach(t => {
            const tr = document.createElement('tr');
            
            const waitMins = Math.floor((now - t.timestamp) / 60000);
            const waitStr = `${waitMins}m`;

            let actions = '';
            if (t.status === 'waiting') {
                actions = `
                    <button class="btn-sm btn-sm-call" onclick="App.callTicket(${t.id})">Panggil</button>
                    <button class="btn-sm btn-sm-skip" onclick="App.skipTicket(${t.id})">Lewati</button>
                `;
            } else if (t.status === 'serving') {
                actions = `
                    <button class="btn-sm btn-sm-call" onclick="App.callTicket(${t.id})" title="Panggil Ulang">Ulangi</button>
                    <button class="btn-sm btn-sm-complete" onclick="App.completeTicket(${t.id})">Selesai</button>
                `;
            }

            tr.innerHTML = `
                <td><strong>${t.number}</strong></td>
                <td>${t.name} <br><small style="color:var(--text-muted)">${t.phone}</small></td>
                <td>${t.service}</td>
                <td><span class="badge badge-${t.status}">${this.getTranslation(t.status)}</span></td>
                <td>${waitStr}</td>
                <td class="action-btns">${actions}</td>
            `;
            tbody.appendChild(tr);
        });
    },

    renderMonitor() {
        const currentEl = document.getElementById('monitor-current-number');
        const counterEl = document.getElementById('monitor-current-counter');
        
        if (this.state.currentlyServing) {
            currentEl.textContent = this.state.currentlyServing.number;
            counterEl.textContent = "Loket 1";
        } else {
            currentEl.textContent = "--";
            counterEl.textContent = "Silakan Menunggu";
        }

        const histList = document.getElementById('monitor-history-list');
        if(histList) {
            histList.innerHTML = '';
            if(this.state.history.length === 0) {
                histList.innerHTML = `<div style="color:var(--text-muted); text-align:center; padding: 20px;">Belum ada panggilan</div>`;
            } else {
                this.state.history.forEach((t, i) => {
                    histList.innerHTML += `
                        <div class="history-item">
                            <div class="h-num" style="color: ${i===0 ? 'var(--accent)' : 'var(--text-main)'}">${t.number}</div>
                            <div class="h-details">Loket 1<br><small>${t.timeFormatted}</small></div>
                        </div>
                    `;
                });
            }
        }
    },

    renderStats() {
        const activeCount = this.state.tickets.filter(t => t.status === 'waiting' || t.status === 'serving').length;
        const servedCount = this.state.tickets.filter(t => t.status === 'completed').length;
        
        const waiting = this.state.tickets.filter(t => t.status === 'waiting');
        let avgWait = 0;
        if (waiting.length > 0) {
            const now = new Date().getTime();
            const totalWait = waiting.reduce((acc, t) => acc + (now - t.timestamp), 0);
            avgWait = Math.floor((totalWait / waiting.length) / 60000); // in minutes
        }

        if(document.getElementById('stat-active')) document.getElementById('stat-active').textContent = activeCount;
        if(document.getElementById('stat-served')) document.getElementById('stat-served').textContent = servedCount;
        if(document.getElementById('stat-wait')) document.getElementById('stat-wait').textContent = `${avgWait}m`;
    }
};

if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = function() {
        window.speechSynthesis.getVoices();
    };
}

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
