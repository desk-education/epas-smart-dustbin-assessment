
        const PASSKEYS = {
            FULL_ADMIN: "P@55w0rd",
            KEY_ONLY: "GAS@2026",
            ASSESSMENT_ACCESS: "access1234"
        };

        const STATE = {
            teacherRole: null, // 'ADMIN' or 'KEY_ONLY'
            isAssessmentUnlocked: false,
            currentTheme: localStorage.getItem('app_theme') || 'light',
            currentFontSize: localStorage.getItem('app_font') || 'font-medium',
            endpointUrl: localStorage.getItem('apps_script_url') || '',
            submissionId: null
        };

        const ASSESSMENT_DATA = [
            { id: 1, q: "Which component is classified as a passive element designed specifically to limit or regulate the flow of electrical current in a circuit?", options: ["Diode", "Resistor", "Light Emitting Diode (LED)", "Transistor"], ans: 1, comp: "Identify and classify passive components", level: "Remembering" },
            { id: 2, q: "What is the primary safety procedure that must be performed before measuring the capacitance of an electrolytic capacitor removed from a power supply?", options: ["Reverse the multimeter test probes", "Dip the leads in isopropyl alcohol", "Fully discharge the capacitor using a resistor or insulated tool", "Measure its temperature with a thermal camera"], ans: 2, comp: "Execute safety rules: Power down & discharge", level: "Applying" },
            { id: 3, q: "When testing a silicon diode with a digital multimeter in Diode Mode under forward bias conditions, what is the expected voltage drop reading for a healthy component?", options: ["0.00 V", "1.8 V - 3.2 V", "0.5 V - 0.7 V", "OL (Over Limit)"], ans: 2, comp: "Inspect and measure forward voltage drop", level: "Understanding" },
            { id: 4, q: "A technician measures a 1,000 Ω (1 kΩ) resistor with a 5% tolerance. Which measured value indicates that the resistor is within acceptable specification?", options: ["850 Ω", "910 Ω", "980 Ω", "1,100 Ω"], ans: 2, comp: "Evaluate component condition based on tolerance", level: "Analyzing" },
            { id: 5, q: "What does an OL (Over Limit) reading display on both forward and reverse bias tests when testing a standard rectifier diode?", options: ["The diode is short-circuited.", "The diode is open-circuited.", "The diode is leaky.", "The diode is functioning normally."], ans: 1, comp: "Diagnose open-circuit failure modes", level: "Analyzing" },
            { id: 6, q: "Why should you avoid touching both metal probe tips with your bare fingers while measuring high resistance values (>100 kΩ)?", options: ["Your body resistance acts in parallel, causing a lower reading.", "Static electricity from your hands will destroy the multimeter.", "Your body resistance acts in series, causing a higher reading.", "The multimeter battery will discharge into your skin."], ans: 0, comp: "Prevent human parallel resistance errors", level: "Understanding" },
            { id: 7, q: "Which lead of a polarized electrolytic capacitor is positive (Anode)?", options: ["The lead marked with a broad stripe on the body", "The longer lead", "The shorter lead", "The lead closest to the flat edge"], ans: 1, comp: "Identify component lead polarities", level: "Remembering" },
            { id: 8, q: "A student tests a Red LED using Diode Mode. The red probe is connected to the longer lead, and the black probe is connected to the shorter lead. What should happen if the LED is good?", options: ["It displays 0.00 V and emits a loud beep.", "It remains dark and displays OL.", "It glows faintly and displays a voltage drop around 1.8 V - 2.2 V.", "It flashes brightly and displays negative capacitance."], ans: 2, comp: "Test LED status & forward voltage drop", level: "Applying" },
            { id: 9, q: "What is the main reason for desoldering at least one lead of a component from a circuit board before taking resistance measurements?", options: ["To allow the component to cool down to room temperature", "To prevent parallel circuit paths from skewing the resistance reading", "To discharge internal static voltages automatically", "To avoid blowing the internal fuse of the multimeter"], ans: 1, comp: "Apply isolation testing principles", level: "Understanding" },
            { id: 10, q: "When testing an ideal diode in reverse bias (Red probe to Cathode, Black probe to Anode), what should a digital multimeter display?", options: ["OL (Over Limit)", "0.00 V", "0.7 V", "12.0 V"], ans: 0, comp: "Verify reverse bias behavior on diodes", level: "Understanding" },
            { id: 11, q: "What failure mode has occurred if a multimeter beeps continuously and reads 0.000 Ω across a ceramic capacitor?", options: ["Open-circuit", "Short-circuit", "Drifted value", "Normal charging behavior"], ans: 1, comp: "Identify short-circuit conditions in capacitors", level: "Analyzing" },
            { id: 12, q: "In a simple charging test using high-resistance mode on an analog or digital meter, how does a good, high-value capacitor behave?", options: ["It stays at 0 Ω permanently.", "It shows OL instantly without changing.", "It initially shows a low resistance, then steadily rises toward infinity (OL).", "It fluctuates rapidly between 10 Ω and 100 Ω."], ans: 2, comp: "Interpret capacitor charging curves", level: "Analyzing" },
            { id: 13, q: "How is the Cathode terminal of a standard surface-mount or through-hole signal diode physically identified on its body?", options: ["A small notch at the bottom of the leads", "A red dot near the positive lead", "A colored stripe or band printed on one end", "A metallic square tab on the side"], ans: 2, comp: "Identify physical body markings", level: "Remembering" },
            { id: 14, q: "Before placing hands on a circuit board or assisting a classmate with high-voltage storage components, what value-driven practice best displays concern for others (Maka-tao)?", options: ["Handing them test probes while the power supply is turned on", "Verbally calling out safety warnings and verifying zero residual voltage first", "Allowing peers to test unknown circuits without wearing safety glasses", "Finishing your work quickly without sharing safety equipment"], ans: 1, comp: "Display concern for others (Maka-tao)", level: "Evaluating" },
            { id: 15, q: "What type of diode typically exhibits the lowest forward voltage drop (0.15 V - 0.4 V)?", options: ["Silicon Rectifier Diode (1N4007)", "Light Emitting Diode (LED)", "Schottky Diode", "Zener Diode in forward mode"], ans: 2, comp: "Compare semiconductor junction types", level: "Evaluating" }
        ];

        document.addEventListener('DOMContentLoaded', () => {
            applyTheme(STATE.currentTheme);
            applyFontSize(STATE.currentFontSize);
            renderQuestions();
            renderItemMatrix();
            updateSheetsDatasetShortcut();
            setupEventListeners();
            initDmmSimulator();
            initVomSimulator();
            
            if(window.innerWidth <= 768) {
                document.getElementById('appSidebar').classList.add('hidden');
            }

            if(STATE.endpointUrl) {
                document.getElementById('endpointInput').value = STATE.endpointUrl;
            }
        });

        function setupEventListeners() {
            document.getElementById('themeSelect').addEventListener('change', (e) => applyTheme(e.target.value));
            document.getElementById('fontSizeSelect').addEventListener('change', (e) => applyFontSize(e.target.value));

            document.querySelectorAll('.nav-btn').forEach(btn => {
                btn.addEventListener('click', () => navigateTo(btn.dataset.target));
            });

            document.getElementById('sidebarToggleBtn').addEventListener('click', toggleSidebar);
            document.getElementById('collapseSidebarBtn').addEventListener('click', collapseSidebar);

            document.getElementById('teacherAuthBtn').addEventListener('click', handleAuthButtonClick);
            document.getElementById('loginTeacherBtn').addEventListener('click', validateTeacherPasskey);
            document.getElementById('closeTeacherModalBtn').addEventListener('click', closeTeacherModal);
            document.getElementById('showPassCheck').addEventListener('change', (e) => {
                document.getElementById('teacherPassInput').type = e.target.checked ? 'text' : 'password';
            });

            document.getElementById('unlockAssessmentBtn').addEventListener('click', validateAssessmentCode);

            document.getElementById('openDonationModalBtn').addEventListener('click', openDonationModal);
            document.getElementById('closeDonationModalBtn').addEventListener('click', closeDonationModal);

            document.getElementById('assessmentForm').addEventListener('submit', handleAssessmentSubmit);
            document.getElementById('donationForm').addEventListener('submit', handleDonationSubmit);
            document.getElementById('copyGcashBtn').addEventListener('click', copyGcashNumber);
            document.getElementById('saveEndpointBtn').addEventListener('click', saveEndpoint);
            document.getElementById('closeConfirmModalBtn').addEventListener('click', () => {
                document.getElementById('confirmModal').classList.remove('active');
            });
        }

        function navigateTo(targetId) {
            document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
            document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

            const targetSec = document.getElementById(targetId);
            if(targetSec) targetSec.classList.add('active');

            const navBtn = document.querySelector(`.nav-btn[data-target="${targetId}"]`);
            if(navBtn) navBtn.classList.add('active');

            if(window.innerWidth <= 768) {
                document.getElementById('appSidebar').classList.add('hidden');
            }
        }

        function toggleSidebar() {
            const sidebar = document.getElementById('appSidebar');
            sidebar.classList.toggle('hidden');
        }

        function collapseSidebar() {
            const sidebar = document.getElementById('appSidebar');
            if(window.innerWidth <= 768) {
                sidebar.classList.add('hidden');
            } else {
                sidebar.classList.toggle('collapsed');
            }
        }

        function applyTheme(theme) {
            STATE.currentTheme = theme;
            document.body.setAttribute('data-theme', theme);
            document.getElementById('themeSelect').value = theme;
            localStorage.setItem('app_theme', theme);
        }

        function applyFontSize(sizeClass) {
            STATE.currentFontSize = sizeClass;
            document.body.className = `${sizeClass}`;
            document.getElementById('fontSizeSelect').value = sizeClass;
            localStorage.setItem('app_font', sizeClass);
        }

        function handleAuthButtonClick() {
            if (STATE.teacherRole) {
                STATE.teacherRole = null;
                document.getElementById('viewIndicator').textContent = "Student View";
                document.getElementById('viewIndicator').className = "view-indicator student";
                document.getElementById('teacherAuthBtn').textContent = "Teacher Access";
                document.querySelectorAll('.teacher-only').forEach(el => el.style.display = 'none');
                navigateTo('sec-objectives');
            } else {
                document.getElementById('teacherPassErr').style.display = 'none';
                document.getElementById('teacherPassInput').value = '';
                document.getElementById('teacherModal').classList.add('active');
            }
        }

        function validateTeacherPasskey() {
            const input = document.getElementById('teacherPassInput').value;
            const errDiv = document.getElementById('teacherPassErr');

            if (input === PASSKEYS.FULL_ADMIN) {
                STATE.teacherRole = 'ADMIN';
                document.getElementById('viewIndicator').textContent = "Admin View";
                document.getElementById('viewIndicator').className = "view-indicator teacher";
                document.getElementById('teacherAuthBtn').textContent = "Logout";
                
                document.querySelectorAll('.teacher-only').forEach(el => el.style.display = 'block');
                const adminTabBtn = document.querySelector('.nav-btn[data-target="sec-admin"]');
                if(adminTabBtn) adminTabBtn.style.display = 'block';

                document.querySelectorAll('.admin-only-block').forEach(el => el.style.display = 'block');
                closeTeacherModal();
                updateSheetsDatasetShortcut();
                navigateTo('sec-admin');
            } else if (input === PASSKEYS.KEY_ONLY) {
                STATE.teacherRole = 'KEY_ONLY';
                document.getElementById('viewIndicator').textContent = "Teacher View";
                document.getElementById('viewIndicator').className = "view-indicator teacher";
                document.getElementById('teacherAuthBtn').textContent = "Logout";
                
                document.querySelectorAll('.teacher-only').forEach(el => el.style.display = 'block');
                const adminTabBtn = document.querySelector('.nav-btn[data-target="sec-admin"]');
                if(adminTabBtn) adminTabBtn.style.display = 'block';

                document.querySelectorAll('.admin-only-block').forEach(el => el.style.display = 'none');
                closeTeacherModal();
                updateSheetsDatasetShortcut();
                navigateTo('sec-admin');
            } else {
                errDiv.textContent = "Incorrect passkey. Please enter valid teacher or administrator credentials.";
                errDiv.style.display = 'block';
            }
        }

        function closeTeacherModal() {
            document.getElementById('teacherModal').classList.remove('active');
        }

        function validateAssessmentCode() {
            const code = document.getElementById('assessCodeInput').value;
            const err = document.getElementById('assessCodeErr');

            if (code === PASSKEYS.ASSESSMENT_ACCESS) {
                STATE.isAssessmentUnlocked = true;
                document.getElementById('assessmentLockPanel').style.display = 'none';
                const content = document.getElementById('assessmentContent');
                content.style.display = 'block';
                content.classList.remove('protected-blur');
            } else {
                err.textContent = "Invalid Assessment Access Code.";
                err.style.display = 'block';
            }
        }

        function updateSheetsDatasetShortcut() {
            const container = document.getElementById('sheetsLinkContainer');
            if (!container) return;

            if (STATE.endpointUrl) {
                container.innerHTML = `
                    <div style="display:flex; align-items:center; gap:1rem; flex-wrap:wrap;">
                        <a href="https://docs.google.com/spreadsheets/d/14J-jDJoxl1tKV-yowaWt7RghjMu3G9IsJ0UULxmrgjo/edit" target="_blank" class="btn btn-success">
                            🔗 View Live Google Sheets Data
                        </a>
                        <span style="font-size:0.85rem; color:var(--text-muted);">
                            Opened in new tab via Web App Endpoint
                        </span>
                    </div>
                `;
            } else {
                container.innerHTML = `
                    <p style="font-size:0.85rem; color:var(--danger);">
                        ⚠️ Google Apps Script Endpoint URL is not configured yet. 
                        ${STATE.teacherRole === 'ADMIN' ? 'Please set it up in the Administrator controls below.' : 'Ask your administrator to set up the Web App URL.'}
                    </p>
                `;
            }
        }

        function renderQuestions() {
            const container = document.getElementById('questionsContainer');
            container.innerHTML = '';

            ASSESSMENT_DATA.forEach((q, idx) => {
                const qDiv = document.createElement('div');
                qDiv.className = 'card';
                qDiv.style.marginBottom = '1rem';

                let optionsHtml = '';
                q.options.forEach((opt, optIdx) => {
                    optionsHtml += `
                        <div style="margin: 0.5rem 0;">
                            <label style="cursor:pointer; display:flex; align-items:flex-start; gap:0.5rem;">
                                <input type="radio" name="q_${q.id}" value="${optIdx}" required style="margin-top:0.25rem;">
                                <span>${String.fromCharCode(65 + optIdx)}. ${opt}</span>
                            </label>
                        </div>
                    `;
                });

                qDiv.innerHTML = `
                    <p><strong>Question ${idx + 1}:</strong> ${q.q}</p>
                    <div style="margin-top:0.5rem;">${optionsHtml}</div>
                `;
                container.appendChild(qDiv);
            });
        }

        function renderItemMatrix() {
            const body = document.getElementById('itemMatrixBody');
            body.innerHTML = '';

            ASSESSMENT_DATA.forEach((q) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><strong>${q.id}</strong></td>
                    <td>${q.comp}</td>
                    <td>${q.level}</td>
                    <td><strong style="color:var(--success);">${String.fromCharCode(65 + q.ans)}</strong></td>
                `;
                body.appendChild(row);
            });
        }

        function generateUUID() {
            return 'SUB-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
        }

        async function handleAssessmentSubmit(e) {
            e.preventDefault();
            const submitBtn = document.getElementById('submitAssessmentBtn');
            submitBtn.disabled = true;
            submitBtn.textContent = "Submitting...";

            if(!STATE.submissionId) {
                STATE.submissionId = generateUUID();
            }

            let correct = 0;
            ASSESSMENT_DATA.forEach(q => {
                const selected = document.querySelector(`input[name="q_${q.id}"]:checked`);
                if(selected && parseInt(selected.value) === q.ans) {
                    correct++;
                }
            });

            const total = ASSESSMENT_DATA.length;
            const percentage = ((correct / total) * 100).toFixed(1);

            const payload = {
                type: 'ASSESSMENT',
                submissionId: STATE.submissionId,
                fullName: document.getElementById('studName').value.trim(),
                gradeLevel: document.getElementById('studGrade').value.trim(),
                section: document.getElementById('studSection').value.trim(),
                totalItems: total,
                correctAnswers: correct,
                incorrectAnswers: total - correct,
                score: correct,
                percentage: percentage + '%'
            };

            if(STATE.endpointUrl) {
                try {
                    await fetch(STATE.endpointUrl, {
                        method: 'POST',
                        mode: 'no-cors',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                    showConfirmationModal(payload);
                } catch(err) {
                    alert('Network issue submitting to Google Sheets. Submission saved locally.');
                    showConfirmationModal(payload);
                }
            } else {
                showConfirmationModal(payload);
            }

            submitBtn.disabled = false;
            submitBtn.textContent = "Submit Assessment";
        }

        function showConfirmationModal(data) {
            const details = document.getElementById('confirmDetails');
            details.innerHTML = `
                <p><strong>Reference ID:</strong> ${data.submissionId}</p>
                <p><strong>Student:</strong> ${data.fullName}</p>
                <p><strong>Grade & Section:</strong> Grade ${data.gradeLevel} - ${data.section}</p>
                <p><strong>Score:</strong> ${data.score} / ${data.totalItems} (${data.percentage})</p>
                <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
            `;
            document.getElementById('confirmModal').classList.add('active');
            STATE.submissionId = null;
        }

        const DMM_MODES = ['OFF', 'DCV', 'ACV', 'RES', 'DIODE', 'CAP'];
        let dmmState = {
            modeIndex: 0,
            selectedCompKey: 'res_1k',
            redConnected: null,
            blackConnected: null
        };

        const DMM_COMPONENTS = {
            'res_1k': {
                name: '1kΩ Resistor (Good)',
                type: 'resistor',
                labelA: 'Pin 1',
                labelB: 'Pin 2',
                svg: `
                <svg width="240" height="70" viewBox="0 0 240 70">
                    <line x1="10" y1="35" x2="50" y2="35" stroke="#94a3b8" stroke-width="5" stroke-linecap="round"/>
                    <line x1="190" y1="35" x2="230" y2="35" stroke="#94a3b8" stroke-width="5" stroke-linecap="round"/>
                    <rect x="50" y="15" width="140" height="40" rx="8" fill="#e0cb97" stroke="#b48843" stroke-width="2"/>
                    <rect x="75" y="15" width="8" height="40" fill="#78350f"/>
                    <rect x="95" y="15" width="8" height="40" fill="#000000"/>
                    <rect x="115" y="15" width="8" height="40" fill="#dc2626"/>
                    <rect x="155" y="15" width="8" height="40" fill="#d97706"/>
                    <path d="M 65 35 L 75 27 L 85 43 L 95 27 L 105 43 L 115 27 L 125 43 L 135 27 L 145 43 L 155 35" stroke="rgba(15, 23, 42, 0.25)" stroke-width="2" fill="none"/>
                </svg>`,
                evaluate: (mode, red, black) => {
                    if (mode !== 'RES') return { display: '0.00', feedback: 'Switch dial to Resistance (Ω) mode at 6:00 o"clock position.' };
                    if (red && black) return { display: '0.998 kΩ', feedback: 'Good resistor! Measured value (0.998 kΩ) is within 5% tolerance of 1 kΩ.' };
                    return { display: 'OL', feedback: 'Connect BOTH probes to terminals.' };
                }
            },
            'res_open': {
                name: 'Resistor (Defective - Open)',
                type: 'resistor',
                labelA: 'Pin 1',
                labelB: 'Pin 2',
                svg: `
                <svg width="240" height="70" viewBox="0 0 240 70">
                    <line x1="10" y1="35" x2="50" y2="35" stroke="#94a3b8" stroke-width="5"/>
                    <line x1="190" y1="35" x2="230" y2="35" stroke="#94a3b8" stroke-width="5"/>
                    <rect x="50" y="15" width="140" height="40" rx="8" fill="#6b7280" stroke="#374151" stroke-width="2"/>
                    <path d="M 110 15 L 122 30 L 115 55" stroke="#111827" stroke-width="4" fill="none"/>
                    <circle cx="118" cy="35" r="14" fill="#18181b"/>
                    <circle cx="115" cy="12" r="3" fill="#9ca3af" opacity="0.6"/>
                    <circle cx="122" cy="6" r="4" fill="#9ca3af" opacity="0.4"/>
                </svg>`,
                evaluate: (mode, red, black) => {
                    if (mode !== 'RES') return { display: '0.00', feedback: 'Switch dial to Resistance (Ω) mode at 6:00 o"clock.' };
                    if (red && black) return { display: 'OL', feedback: 'Defective! Multimeter displays OL (Over Limit) indicating an open internal circuit.' };
                    return { display: 'OL', feedback: 'Connect BOTH probes to terminals.' };
                }
            },
            'diode_silicon': {
                name: '1N4007 Silicon Diode (Good)',
                type: 'diode',
                labelA: 'Anode (+)',
                labelB: 'Cathode (-)',
                svg: `
                <svg width="240" height="70" viewBox="0 0 240 70">
                    <line x1="10" y1="35" x2="60" y2="35" stroke="#94a3b8" stroke-width="5"/>
                    <line x1="180" y1="35" x2="230" y2="35" stroke="#94a3b8" stroke-width="5"/>
                    <rect x="60" y="15" width="120" height="40" rx="4" fill="#1e293b" stroke="#0f172a" stroke-width="2"/>
                    <rect x="155" y="15" width="18" height="40" fill="#e2e8f0"/>
                    <line x1="80" y1="35" x2="140" y2="35" stroke="#38bdf8" stroke-width="2"/>
                    <polygon points="95,22 125,35 95,48" fill="none" stroke="#38bdf8" stroke-width="2"/>
                    <line x1="125" y1="22" x2="125" y2="48" stroke="#38bdf8" stroke-width="3"/>
                </svg>`,
                evaluate: (mode, red, black) => {
                    if (mode !== 'DIODE') return { display: '0.00', feedback: 'Switch dial to Diode Test mode at 8:00 o"clock position.' };
                    if (red === 'A' && black === 'B') return { display: '0.642 V', feedback: 'Forward Bias: Normal Silicon Diode voltage drop (~0.64V).' };
                    if (red === 'B' && black === 'A') return { display: 'OL', feedback: 'Reverse Bias: Reading OL confirms non-conducting reverse direction.' };
                    return { display: 'OL', feedback: 'Connect BOTH probes to component terminals.' };
                }
            },
            'diode_shorted': {
                name: 'Diode (Defective - Shorted)',
                type: 'diode',
                labelA: 'Anode (+)',
                labelB: 'Cathode (-)',
                svg: `
                <svg width="240" height="70" viewBox="0 0 240 70">
                    <line x1="10" y1="35" x2="60" y2="35" stroke="#ef4444" stroke-width="5"/>
                    <line x1="180" y1="35" x2="230" y2="35" stroke="#ef4444" stroke-width="5"/>
                    <rect x="60" y="15" width="120" height="40" rx="4" fill="#881337" stroke="#450a0a" stroke-width="2"/>
                    <circle cx="120" cy="35" r="12" fill="#18181b"/>
                    <line x1="80" y1="35" x2="160" y2="35" stroke="#ef4444" stroke-width="3" stroke-dasharray="3"/>
                </svg>`,
                evaluate: (mode, red, black) => {
                    if (mode !== 'DIODE') return { display: '0.00', feedback: 'Switch dial to Diode Test mode at 8:00 o"clock.' };
                    if (red && black) return { display: '0.001 V', feedback: 'Defective! Reads 0.000V in both directions (Shorted PN junction).' };
                    return { display: 'OL', feedback: 'Connect BOTH probes to terminals.' };
                }
            },
            'led_red': {
                name: 'Red LED (Good)',
                type: 'led',
                labelA: 'Anode (Longer +)',
                labelB: 'Cathode (Shorter -)',
                svg: `
                <svg width="240" height="70" viewBox="0 0 240 70">
                    <line x1="10" y1="35" x2="80" y2="35" stroke="#94a3b8" stroke-width="5"/>
                    <line x1="160" y1="35" x2="230" y2="35" stroke="#94a3b8" stroke-width="5"/>
                    <path d="M 80 15 L 140 15 C 165 15, 165 55, 140 55 L 80 55 Z" fill="rgba(239, 68, 68, 0.85)" stroke="#dc2626" stroke-width="2"/>
                    <path d="M 90 25 L 110 25 L 115 35 L 90 35 Z" fill="#cbd5e1"/>
                    <line x1="120" y1="20" x2="120" y2="45" stroke="#cbd5e1" stroke-width="3"/>
                    <path d="M 145 15 L 160 5 M 155 22 L 170 12" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/>
                </svg>`,
                evaluate: (mode, red, black) => {
                    if (mode !== 'DIODE') return { display: '0.00', feedback: 'Switch dial to Diode Test mode at 8:00 o"clock.' };
                    if (red === 'A' && black === 'B') return { display: '1.954 V 💡', feedback: 'Forward Bias: Red LED glows faintly and displays ~1.95V forward voltage.' };
                    if (red === 'B' && black === 'A') return { display: 'OL', feedback: 'Reverse Bias: LED remains unlit and displays OL.' };
                    return { display: 'OL', feedback: 'Connect BOTH probes to terminals.' };
                }
            },
            'cap_100u': {
                name: '100µF Electrolytic Capacitor (Good)',
                type: 'capacitor',
                labelA: 'Anode (+)',
                labelB: 'Cathode (Stripe -)',
                svg: `
                <svg width="240" height="70" viewBox="0 0 240 70">
                    <line x1="10" y1="35" x2="70" y2="35" stroke="#94a3b8" stroke-width="5"/>
                    <line x1="170" y1="35" x2="230" y2="35" stroke="#94a3b8" stroke-width="5"/>
                    <rect x="70" y="12" width="100" height="46" rx="6" fill="#0284c7" stroke="#0369a1" stroke-width="2"/>
                    <rect x="145" y="12" width="25" height="46" fill="#e2e8f0"/>
                    <text x="152" y="28" font-size="14" font-weight="bold" fill="#0f172a">-</text>
                    <text x="152" y="48" font-size="14" font-weight="bold" fill="#0f172a">-</text>
                    <text x="80" y="38" font-size="11" font-weight="bold" fill="#ffffff">100µF 25V</text>
                </svg>`,
                evaluate: (mode, red, black) => {
                    if (mode !== 'CAP') return { display: '0.00', feedback: 'Switch dial to Capacitance (F) mode at 10:00 o"clock position.' };
                    if (red === 'A' && black === 'B') return { display: '98.4 µF', feedback: 'Good Capacitor! Measured 98.4µF is within 20% tolerance of nominal 100µF.' };
                    if (red === 'B' && black === 'A') return { display: '98.4 µF', feedback: 'Note: Always observe proper probe polarity on electrolytic capacitors.' };
                    return { display: 'OL', feedback: 'Connect BOTH probes to terminals.' };
                }
            },
            'volt_dc_9v': {
                name: '9V DC Battery (Voltage Source)',
                type: 'voltage_dc',
                labelA: 'Positive Terminal (+)',
                labelB: 'Negative Terminal (-)',
                svg: `
                <svg width="240" height="70" viewBox="0 0 240 70">
                    <line x1="10" y1="35" x2="40" y2="35" stroke="#ef4444" stroke-width="4"/>
                    <line x1="200" y1="35" x2="230" y2="35" stroke="#0f172a" stroke-width="4"/>
                    <rect x="50" y="10" width="140" height="50" rx="4" fill="#d97706" stroke="#78350f" stroke-width="2"/>
                    <rect x="40" y="22" width="10" height="12" fill="#cbd5e1" rx="2"/>
                    <rect x="40" y="38" width="10" height="10" fill="#94a3b8" rx="5"/>
                    <text x="60" y="40" font-size="16" font-weight="extrabold" fill="#ffffff">9V DC POWER</text>
                    <text x="60" y="24" font-size="12" font-weight="bold" fill="#ef4444">+</text>
                    <text x="175" y="24" font-size="14" font-weight="bold" fill="#0f172a">-</text>
                </svg>`,
                evaluate: (mode, red, black) => {
                    if (mode === 'ACV' && red && black) return { display: '0.00 V', feedback: 'Warning: DC voltage source measured in AC mode (4:00 o"clock) reads zero!' };
                    if (mode !== 'DCV') return { display: '0.00 V', feedback: 'Switch dial to DC Voltage (V=) mode at 2:00 o"clock position.' };
                    if (red === 'A' && black === 'B') return { display: '+9.12 V', feedback: 'Healthy 9V Battery! Red probe on Positive (+) and Black probe on Negative (-) displays positive voltage.' };
                    if (red === 'B' && black === 'A') return { display: '-9.12 V', feedback: 'Reverse Polarity! Reversing probes displays negative voltage (-9.12V).' };
                    return { display: '0.00 V', feedback: 'Connect BOTH probes to battery terminals.' };
                }
            },
            'volt_ac_220v': {
                name: '220V AC Outlet (AC Mains Source)',
                type: 'voltage_ac',
                labelA: 'Line / Phase (L)',
                labelB: 'Neutral (N)',
                svg: `
                <svg width="240" height="70" viewBox="0 0 240 70">
                    <line x1="10" y1="35" x2="60" y2="35" stroke="#ef4444" stroke-width="4"/>
                    <line x1="180" y1="35" x2="230" y2="35" stroke="#2563eb" stroke-width="4"/>
                    <rect x="60" y="8" width="120" height="54" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="3"/>
                    <rect x="85" y="28" width="6" height="14" fill="#0f172a" rx="1"/>
                    <rect x="149" y="28" width="6" height="14" fill="#0f172a" rx="1"/>
                    <text x="88" y="54" font-size="10" font-weight="bold" fill="#64748b">220V ~ AC MAINS</text>
                </svg>`,
                evaluate: (mode, red, black) => {
                    if (mode === 'DCV' && red && black) return { display: '0.00 V', feedback: 'Warning! AC mains measured in DC Voltage mode displays average zero reading.' };
                    if (mode !== 'ACV') return { display: '0.00 V', feedback: 'Caution! Switch dial to AC Voltage (V~) mode at 4:00 o"clock position.' };
                    if (red && black) return { display: '221.8 V~', feedback: 'AC Outlet Voltage measured accurately (~220V RMS). AC voltage is non-polar.' };
                    return { display: '0.00 V', feedback: 'Connect BOTH probes to AC socket terminals.' };
                }
            }
        };

        function initDmmSimulator() {
            document.getElementById('dmmKnob').addEventListener('click', cycleDmmDial);
            document.getElementById('dmmComponentSelect').addEventListener('change', (e) => {
                dmmState.selectedCompKey = e.target.value;
                resetProbes();
            });
            document.getElementById('resetProbesBtn').addEventListener('click', resetProbes);

            renderDmmWorkbench();
        }

        function cycleDmmDial() {
            dmmState.modeIndex = (dmmState.modeIndex + 1) % DMM_MODES.length;
            const mode = DMM_MODES[dmmState.modeIndex];
            
            const angles = [0, 60, 120, 180, 240, 300];
            document.getElementById('dmmKnob').style.transform = `rotate(${angles[dmmState.modeIndex]}deg)`;
            document.getElementById('dmmModeLabel').textContent = mode;
            
            updateDmmEvaluation();
        }

        function renderDmmWorkbench() {
            const comp = DMM_COMPONENTS[dmmState.selectedCompKey];
            const visual = document.getElementById('compVisual');

            visual.innerHTML = `
                <div id="targetA" class="probe-target ${dmmState.redConnected === 'A' ? 'red-connected' : (dmmState.blackConnected === 'A' ? 'black-connected' : '')}" onclick="handleTargetClick('A')">
                    ${dmmState.redConnected === 'A' ? 'RED' : (dmmState.blackConnected === 'A' ? 'BLK' : 'A')}
                </div>
                <div>${comp.svg}</div>
                <div id="targetB" class="probe-target ${dmmState.redConnected === 'B' ? 'red-connected' : (dmmState.blackConnected === 'B' ? 'black-connected' : '')}" onclick="handleTargetClick('B')">
                    ${dmmState.redConnected === 'B' ? 'RED' : (dmmState.blackConnected === 'B' ? 'BLK' : 'B')}
                </div>
            `;

            updateDmmEvaluation();
        }

        function handleTargetClick(targetKey) {
            if (!dmmState.redConnected && dmmState.blackConnected !== targetKey) {
                dmmState.redConnected = targetKey;
            } else if (!dmmState.blackConnected && dmmState.redConnected !== targetKey) {
                dmmState.blackConnected = targetKey;
            } else if (dmmState.redConnected === targetKey) {
                dmmState.redConnected = null;
            } else if (dmmState.blackConnected === targetKey) {
                dmmState.blackConnected = null;
            } else {
                dmmState.redConnected = targetKey;
            }

            renderDmmWorkbench();
        }

        function resetProbes() {
            dmmState.redConnected = null;
            dmmState.blackConnected = null;
            renderDmmWorkbench();
        }

        function updateDmmEvaluation() {
            const mode = DMM_MODES[dmmState.modeIndex];
            const comp = DMM_COMPONENTS[dmmState.selectedCompKey];
            
            document.getElementById('redProbeStatus').textContent = dmmState.redConnected ? `${comp['label' + dmmState.redConnected]}` : 'Disconnected';
            document.getElementById('blackProbeStatus').textContent = dmmState.blackConnected ? `${comp['label' + dmmState.blackConnected]}` : 'Disconnected';

            const displayEl = document.getElementById('dmmDisplay');
            const feedbackEl = document.getElementById('dmmFeedback');

            if (mode === 'OFF') {
                displayEl.textContent = 'OFF';
                feedbackEl.className = 'alert alert-info';
                feedbackEl.textContent = 'Multimeter is powered OFF. Click rotary dial knob to turn ON.';
                return;
            }

            const evalResult = comp.evaluate(mode, dmmState.redConnected, dmmState.blackConnected);
            displayEl.textContent = evalResult.display;
            feedbackEl.textContent = evalResult.feedback;
        }

        /* ==========================================================================
           ANALOG MULTIMETER (VOM) SIMULATOR LOGIC
           ========================================================================== */
        const VOM_RANGES = ['OFF', 'R_X1', 'R_X10', 'R_X1K', 'DCV_10', 'ACV_250'];
        let vomState = {
            rangeIndex: 0, //0
            selectedCompKey: 'res_1k',
            redConnected: null,
            blackConnected: null,
            zeroOffset: 65 // -5 to +5 degrees zero calibration offset
        };

        const VOM_COMPONENTS = {
            'res_1k': {
                name: '1kΩ Resistor (Good)',
                value: 1000,
                type: 'resistor',
                labelA: 'Pin 1', labelB: 'Pin 2',
                svg: DMM_COMPONENTS['res_1k'].svg
            },
            'res_330': {
                name: '330Ω Resistor (Good)',
                value: 330,
                type: 'resistor',
                labelA: 'Pin 1', labelB: 'Pin 2',
                svg: `
                <svg width="240" height="70" viewBox="0 0 240 70">
                    <line x1="10" y1="35" x2="50" y2="35" stroke="#94a3b8" stroke-width="5" stroke-linecap="round"/>
                    <line x1="190" y1="35" x2="230" y2="35" stroke="#94a3b8" stroke-width="5" stroke-linecap="round"/>
                    <rect x="50" y="15" width="140" height="40" rx="8" fill="#e0cb97" stroke="#b48843" stroke-width="2"/>
                    <rect x="75" y="15" width="8" height="40" fill="#f97316"/>
                    <rect x="95" y="15" width="8" height="40" fill="#f97316"/>
                    <rect x="115" y="15" width="8" height="40" fill="#78350f"/>
                    <rect x="155" y="15" width="8" height="40" fill="#d97706"/>
                </svg>`
            },
            'res_open': {
                name: 'Resistor (Defective - Open)',
                value: Infinity,
                type: 'resistor',
                labelA: 'Pin 1', labelB: 'Pin 2',
                svg: DMM_COMPONENTS['res_open'].svg
            },
            'diode_silicon': {
                name: '1N4007 Silicon Diode (Good)',
                type: 'diode',
                labelA: 'Anode (+)', labelB: 'Cathode (-)',
                svg: DMM_COMPONENTS['diode_silicon'].svg
            },
            'diode_shorted': {
                name: 'Diode (Defective - Shorted)',
                value: 0,
                type: 'diode',
                labelA: 'Anode (+)', labelB: 'Cathode (-)',
                svg: DMM_COMPONENTS['diode_shorted'].svg
            },
            'led_red': {
                name: 'Red LED (Good)',
                type: 'led',
                labelA: 'Anode (Longer +)', labelB: 'Cathode (Shorter -)',
                svg: DMM_COMPONENTS['led_red'].svg
            },
            'volt_dc_9v': {
                name: '9V DC Battery (Voltage Source)',
                voltage: 9.12,
                type: 'voltage_dc',
                labelA: 'Positive (+)', labelB: 'Negative (-)',
                svg: DMM_COMPONENTS['volt_dc_9v'].svg
            },
            'volt_ac_220v': {
                name: '220V AC Outlet (AC Mains Source)',
                voltage: 220,
                type: 'voltage_ac',
                labelA: 'Line (L)', labelB: 'Neutral (N)',
                svg: DMM_COMPONENTS['volt_ac_220v'].svg
            }
        };

        function initVomSimulator() {
            document.getElementById('vomKnob').addEventListener('click', cycleVomRange);
            document.getElementById('vomZeroAdjKnob').addEventListener('click', adjustVomZero);
            document.getElementById('vomComponentSelect').addEventListener('change', (e) => {
                vomState.selectedCompKey = e.target.value;
                resetVomProbes();
            });
            document.getElementById('resetVomProbesBtn').addEventListener('click', resetVomProbes);

            renderVomWorkbench();
        }

        function cycleVomRange() {
            vomState.rangeIndex = (vomState.rangeIndex + 1) % VOM_RANGES.length;
            const range = VOM_RANGES[vomState.rangeIndex];
            
            const angles = [0, 45, 90, 135, 180, 225];
            document.getElementById('vomKnob').style.transform = `rotate(${angles[vomState.rangeIndex]}deg)`;
            
            const labels = {
                'OFF': 'OFF',
                'R_X1': 'R × 1',
                'R_X10': 'R × 10',
                'R_X1K': 'R × 1k',
                'DCV_10': '10V DCV',
                'ACV_250': '250V ACV'
            };
            document.getElementById('vomRangeLabel').textContent = labels[range];
            
            updateVomEvaluation();
        }

        function adjustVomZero() {
            vomState.zeroOffset = (vomState.zeroOffset + 1.5);
            if(vomState.zeroOffset > 4.5) vomState.zeroOffset = -4.5;
            document.getElementById('vomZeroAdjKnob').style.transform = `rotate(${vomState.zeroOffset * 20}deg)`;
            updateVomEvaluation();
        }

        function renderVomWorkbench() {
            const comp = VOM_COMPONENTS[vomState.selectedCompKey];
            const visual = document.getElementById('vomCompVisual');

            visual.innerHTML = `
                <div id="vomTargetA" class="probe-target ${vomState.redConnected === 'A' ? 'red-connected' : (vomState.blackConnected === 'A' ? 'black-connected' : '')}" onclick="handleVomTargetClick('A')">
                    ${vomState.redConnected === 'A' ? 'RED' : (vomState.blackConnected === 'A' ? 'BLK' : 'A')}
                </div>
                <div>${comp.svg}</div>
                <div id="vomTargetB" class="probe-target ${vomState.redConnected === 'B' ? 'red-connected' : (vomState.blackConnected === 'B' ? 'black-connected' : '')}" onclick="handleVomTargetClick('B')">
                    ${vomState.redConnected === 'B' ? 'RED' : (vomState.blackConnected === 'B' ? 'BLK' : 'B')}
                </div>
            `;

            updateVomEvaluation();
        }

        function handleVomTargetClick(targetKey) {
            if (!vomState.redConnected && vomState.blackConnected !== targetKey) {
                vomState.redConnected = targetKey;
            } else if (!vomState.blackConnected && vomState.redConnected !== targetKey) {
                vomState.blackConnected = targetKey;
            } else if (vomState.redConnected === targetKey) {
                vomState.redConnected = null;
            } else if (vomState.blackConnected === targetKey) {
                vomState.blackConnected = null;
            } else {
                vomState.redConnected = targetKey;
            }

            renderVomWorkbench();
        }

        function resetVomProbes() {
            vomState.redConnected = null;
            vomState.blackConnected = null;
            renderVomWorkbench();
        }

        function updateVomEvaluation() {
            const range = VOM_RANGES[vomState.rangeIndex];
            const comp = VOM_COMPONENTS[vomState.selectedCompKey];
            
            document.getElementById('vomRedStatus').textContent = vomState.redConnected ? `${comp['label' + vomState.redConnected]}` : 'Disconnected';
            document.getElementById('vomBlackStatus').textContent = vomState.blackConnected ? `${comp['label' + vomState.blackConnected]}` : 'Disconnected';

            const needleGroup = document.getElementById('vomNeedleGroup');
            const feedbackEl = document.getElementById('vomFeedback');

            // Default Rest Position: -89 deg (Far Left, Infinity Ohms / 0 Volts)
            let angle = -90;
            let feedback = '';

            if (range === 'OFF') {
                needleGroup.style.transform = `rotate(-90deg)`;
                feedbackEl.className = 'alert alert-info';
                feedbackEl.textContent = 'Analog Multimeter is switched OFF. Select a range setting to operate.';
                return;
            }

            if (!vomState.redConnected || !vomState.blackConnected) {
                needleGroup.style.transform = `rotate(-89deg)`;
                feedbackEl.className = 'alert alert-info';
                feedbackEl.textContent = 'Probes disconnected. Connect BOTH RED (+) and BLACK (-) probes to component terminals.';
                return;
            }

            // Resistance Ranges (R x 1, R x 10, R x 1k)
            if (range.startsWith('R_')) {
                let mult = 1;
                let midR = 50; // Mid-scale resistance value for angle 90 deg
                if (range === 'R_X10') { mult = 10; midR = 1300; }
                if (range === 'R_X1K') { mult = 1000; midR =1000000; }

                if (comp.type === 'voltage_dc' || comp.type === 'voltage_ac') {
                    angle = -89;
                    feedback = '⚠️ WARNING: Never measure resistance across live voltage sources! Internal meter fuse risk.';
                } else if (comp.value === Infinity || (comp.type === 'diode' && vomState.redConnected === 'B' && vomState.blackConnected === 'A')) {
                    angle = -90; // Infinity Ohms
                    feedback = 'Pointer rests at ∞ (Far Left). Indicates an OPEN circuit or Reverse Biased diode junction.';
                } else if (comp.value === 0) {
                    angle = -90 + vomState.zeroOffset; // Zero Ohms
                    feedback = 'Pointer swings to 0 Ω (Far Right). Indicates SHORT CIRCUIT. (Use 0-Ω ADJ knob to zero calibrate).';
                } else {
                    let rVal = comp.value || 1000;
                    if (comp.type === 'diode' || comp.type === 'led') rVal = (range === 'R_X10' ? 640 : 1500);

                    // Galvanometer resistance curve equation
                    let ratio = midR / (midR + rVal);
                    angle = -90 + (100 * ratio) + vomState.zeroOffset;

                    let scaleRead = (rVal / mult).toFixed(1);
                    feedback = `Measured Reading: Pointer indicates ~${scaleRead} on Green Ω Scale. Scale (${scaleRead}) × Multiplier (${range.replace('R_', 'R×')}) = ${rVal} Ω.`;
                }
            } 
            // DC Voltage Range (10V DCV)
            else if (range === 'DCV_10') {
                if (comp.type === 'voltage_dc') {
                    if (vomState.redConnected === 'A' && vomState.blackConnected === 'B') {
                        let ratio = comp.voltage / 10;
                        angle = -62 + (100 * ratio);
                        feedback = `Direct DC Voltage Reading: Pointer indicates ~9.1V on Black 0-10 DC Scale. Correct Polarity.`;
                    } else {
                        angle = 97; // Reverse polarity peg bounce
                        feedback = '⚠️ Reverse Polarity! Pointer pegs backward below 0V. Reverse probe connections immediately.';
                    }
                } else {
                    angle = -89;
                    feedback = 'No DC voltage detected across passive component.';
                }
            }
            // AC Voltage Range (250V ACV)
            else if (range === 'ACV_250') {
                if (comp.type === 'voltage_ac') {
                    let ratio = comp.voltage / 250;
                    angle = -13 + (100 * ratio);
                    feedback = `AC Voltage Reading: Pointer indicates ~220V RMS on Red 250V AC Scale.`;
                } else {
                    angle = -89;
                    feedback = 'No AC voltage detected across test component.';
                }
            }

            needleGroup.style.transform = `rotate(${angle}deg)`;
            feedbackEl.className = 'alert alert-info';
            feedbackEl.textContent = feedback;
        }

        function openDonationModal() {
            document.getElementById('donationModal').classList.add('active');
        }

        function closeDonationModal() {
            document.getElementById('donationModal').classList.remove('active');
        }

        async function handleDonationSubmit(e) {
            e.preventDefault();
            const status = document.getElementById('donationStatus');
            const submitBtn = document.getElementById('submitDonationBtn');

            const name = document.getElementById('donorName').value.trim() || 'Anonymous';
            const amount = parseFloat(document.getElementById('donorAmount').value);

            if(isNaN(amount) || amount <= 0) {
                status.className = 'alert alert-error';
                status.textContent = 'Please enter a valid donation amount.';
                return;
            }

            submitBtn.disabled = true;
            status.className = 'alert alert-info';
            status.textContent = 'Processing donation record...';

            const payload = {
                type: 'DONATION',
                donationId: 'DON-' + Date.now(),
                donorName: name,
                amount: amount,
                currency: 'PHP'
            };

            if(STATE.endpointUrl) {
                try {
                    await fetch(STATE.endpointUrl, {
                        method: 'POST',
                        mode: 'no-cors',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                    status.className = 'alert alert-success';
                    status.textContent = 'Thank you! Your voluntary donation record has been submitted.';
                } catch(err) {
                    status.className = 'alert alert-error';
                    status.textContent = 'Failed to connect to backend endpoint.';
                }
            } else {
                status.className = 'alert alert-success';
                status.textContent = 'Record logged (Demo Mode: Configure Google Apps Script endpoint in Admin panel to save to Sheets).';
            }

            submitBtn.disabled = false;
            document.getElementById('donationForm').reset();
        }

        function copyGcashNumber() {
            const num = document.getElementById('gcashNum').textContent;
            navigator.clipboard.writeText(num).then(() => {
                alert('GCash number copied to clipboard: ' + num);
            });
        }

        function saveEndpoint() {
            const url = document.getElementById('endpointInput').value.trim();
            STATE.endpointUrl = url;
            localStorage.setItem('apps_script_url', url);
            updateSheetsDatasetShortcut();
            alert('Google Apps Script endpoint configuration saved successfully!');
        }

        function copyBackendCode() {
            const code = document.getElementById('scriptCodeBlock').textContent;
            navigator.clipboard.writeText(code).then(() => {
                alert('Google Apps Script backend code copied to clipboard!');
            });
        }