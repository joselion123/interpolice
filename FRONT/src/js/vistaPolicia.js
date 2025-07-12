document.addEventListener('DOMContentLoaded', () => {
let codigo=sessionStorage.getItem('codigo')
if (!codigo){
    window.location.href="../../index.html"
}
});
    window.addEventListener('beforeunload', () => {
    sessionStorage.clear(); // o solo sessionStorage.removeItem('codigo');
});
     
     let currentMethod = 'qr';
        let currentResults = null;

        const citizensDatabase = [
            {
                id: 1,
                name: "Juan Carlos Vega Martínez",
                qr: "QR-7834-9821-ALPHA",
                birth: "15 de Marzo, 2387",
                origin: "Kepler-442b",
                residence: "Tierra - Sector 7",
                status: "vivo",
                crimes: [
                    {
                        date: "24 de Junio, 2425 - 23:45h",
                        location: "Sector Comercial Alpha-7, Estación Espacial Omega",
                        types: ["Conducción bajo efectos", "Daño a bien ajeno", "Lesiones personales", "Intento de homicidio"],
                        severity: "alto",
                        description: "El sujeto conducía una nave bajo efectos de sustancias psicotrópicas cuando colisionó contra un puesto de comida espacial."
                    },
                    {
                        date: "12 de Mayo, 2425 - 14:20h",
                        location: "Plaza Central, Ciudad Nueva Terra",
                        types: ["Alteración del orden público", "Resistencia a la autoridad"],
                        severity: "medio",
                        description: "Durante una manifestación pacífica, el ciudadano incitó a la violencia contra las fuerzas del orden."
                    }
                ]
            },
            {
                id: 2,
                name: "Ana López Stellar",
                qr: "QR-9876-5432-BETA",
                birth: "22 de Julio, 2390",
                origin: "Marte - Colonia Norte",
                residence: "Estación Lunar Gateway",
                status: "vivo",
                crimes: []
            }
        ];

        function selectMethod(method) {
            currentMethod = method;
            
            document.querySelectorAll('.method-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');

            document.getElementById('qrScanner').style.display = method === 'qr' ? 'block' : 'none';
            document.getElementById('codeSearch').style.display = method === 'code' ? 'block' : 'none';
            document.getElementById('nameSearch').style.display = method === 'name' ? 'block' : 'none';

            clearResults();
        }

        function simulateQRScan() {
            showLoading();
            setTimeout(() => {
                const citizen = citizensDatabase[0]; 
                displayResults([citizen]);
            }, 2000);
        }

        function searchByCitizen() {
            let searchValue = '';
            
            if (currentMethod === 'code') {
                searchValue = document.getElementById('codeInput').value.trim();
            } else if (currentMethod === 'name') {
                searchValue = document.getElementById('nameInput').value.trim();
            }

            if (!searchValue) {
                alert('⚠️ Por favor ingrese un valor para buscar');
                return;
            }

            showLoading();

            setTimeout(() => {
                let results = [];
                
                if (currentMethod === 'code') {
                    results = citizensDatabase.filter(c => 
                        c.qr.toLowerCase().includes(searchValue.toLowerCase())
                    );
                } else if (currentMethod === 'name') {
                    results = citizensDatabase.filter(c => 
                        c.name.toLowerCase().includes(searchValue.toLowerCase())
                    );
                }

                displayResults(results);
            }, 1500);
        }

        function showLoading() {
            document.getElementById('loading').classList.add('active');
            document.getElementById('noResults').style.display = 'none';
            document.getElementById('searchResults').style.display = 'none';
            document.getElementById('printBtn').style.display = 'none';
        }

        function clearResults() {
            document.getElementById('loading').classList.remove('active');
            document.getElementById('noResults').style.display = 'block';
            document.getElementById('searchResults').style.display = 'none';
            document.getElementById('printBtn').style.display = 'none';
            currentResults = null;
        }

        function displayResults(results) {
            document.getElementById('loading').classList.remove('active');
            document.getElementById('noResults').style.display = 'none';
            
            const resultsContainer = document.getElementById('searchResults');
            
            if (results.length === 0) {
                resultsContainer.innerHTML = `
                    <div class="no-results">
                        ❌ No se encontraron ciudadanos con los criterios especificados
                    </div>
                `;
            } else {
                let html = '';
                results.forEach(citizen => {
                    const statusClass = citizen.crimes.length > 0 ? 'status-criminal' : 'status-clean';
                    const statusText = citizen.crimes.length > 0 ? 'CON ANTECEDENTES' : 'SIN ANTECEDENTES';
                    
                    html += `
                        <div class="citizen-card">
                            <div class="citizen-header">
                                <div class="citizen-avatar">👤</div>
                                <div class="citizen-details">
                                    <h3>${citizen.name}</h3>
                                    <p><strong>Código QR:</strong> ${citizen.qr}</p>
                                    <p><strong>Fecha Nacimiento:</strong> ${citizen.birth}</p>
                                    <p><strong>Origen:</strong> ${citizen.origin}</p>
                                    <p><strong>Residencia:</strong> ${citizen.residence}</p>
                                    <p><strong>Estado:</strong> ${citizen.status.toUpperCase()}
                                        <span class="status-indicator ${statusClass}">${statusText}</span>
                                    </p>
                                </div>
                            </div>
                    `;

                    if (citizen.crimes.length > 0) {
                        html += `
                            <div class="crimes-section">
                                <div class="crimes-header">
                                    ⚠️ Historial Criminal (${citizen.crimes.length} delitos)
                                </div>
                        `;
                        
                        citizen.crimes.forEach((crime, index) => {
                            html += `
                                <div class="crime-summary">
                                    <div class="crime-date">📅 ${crime.date}</div>
                                    <div class="crime-location">📍 ${crime.location}</div>
                                    <div class="crime-types-summary">
                                        ${crime.types.map(type => `<span class="crime-type-tag">${type}</span>`).join('')}
                                    </div>
                                    <p style="color: #ffffff; font-size: 0.9em; margin-top: 8px;">${crime.description}</p>
                                </div>
                            `;
                        });
                        
                        html += `</div>`;
                    } else {
                        html += `
                            <div style="text-align: center; padding: 20px; color: #2ed573;">
                                ✅ Ciudadano sin antecedentes penales
                            </div>
                        `;
                    }

                    html += `
                            <div class="quick-actions">
                                <button class="action-btn" onclick="addCrime(${citizen.id})">➕ Agregar Delito</button>
                                <button class="action-btn" onclick="viewDetails(${citizen.id})">👁️ Ver Detalles</button>
                                <button class="action-btn" onclick="printCitizen(${citizen.id})">🖨️ Imprimir Solo Este</button>
                            </div>
                        </div>
                    `;
                });
                
                resultsContainer.innerHTML = html;
                currentResults = results;
            }
            
            resultsContainer.style.display = 'block';
            document.getElementById('printBtn').style.display = results.length > 0 ? 'block' : 'none';
        }

        // Función para imprimir resultados
        function printResults() {
            if (!currentResults) return;
            
            const originalTitle = document.title;
            document.title = `Consulta_Antecedentes_${new Date().toISOString().split('T')[0]}`;
            
            window.print();
            document.title = originalTitle;
        }

        // Función para imprimir ciudadano específico
        function printCitizen(citizenId) {
            const citizen = citizensDatabase.find(c => c.id === citizenId);
            if (!citizen) return;
            
            displayResults([citizen]);
            setTimeout(() => {
                printResults();
            }, 100);
        }

        // Función para agregar delito
        function addCrime(citizenId) {
            alert(`🚨 Función para agregar nuevo delito al ciudadano ID: ${citizenId}\n\nEsta funcionalidad se implementaría en el panel de registro de delitos.`);
        }

        // Función para ver detalles
        function viewDetails(citizenId) {
            const citizen = citizensDatabase.find(c => c.id === citizenId);
            if (!citizen) return;
            
            alert(`👤 Detalles completos del ciudadano:\n\nNombre: ${citizen.name}\nCódigo: ${citizen.qr}\nDelitos: ${citizen.crimes.length}\n\nEsta función abriría una ventana con información detallada.`);
        }

        // Función de logout
        function logout() {
            if (confirm('¿Está seguro que desea cerrar sesión?')) {
                window.location.href = '../../index.html';
                sessionStorage.clear()
            }
        }

        // Manejar Enter en campos de búsqueda
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                if (currentMethod === 'code' && document.getElementById('codeInput') === document.activeElement) {
                    searchByCitizen();
                } else if (currentMethod === 'name' && document.getElementById('nameInput') === document.activeElement) {
                    searchByCitizen();
                }
            }
        });

        // Inicializar
        window.addEventListener('load', function() {
            clearResults();
        });


function openCrimeModal(citizenCode, citizenName) {
    document.getElementById('citizenCode').value = citizenCode || '';
    document.getElementById('citizenName').value = citizenName || '';
    document.getElementById('crimeModal').style.display = 'flex';
    
    // Establecer fecha actual
    const today = new Date();
    document.getElementById('crimeDate').value = today.toISOString().split('T')[0];
    
    // Establecer oficial actual (puedes obtener esto de tu sistema)
    document.getElementById('arrestingOfficer').value = document.getElementById('officerName').textContent;
    document.getElementById('badgeNumber').value = document.getElementById('badgeNumber').textContent;
}

function closeCrimeModal() {
    document.getElementById('crimeModal').style.display = 'none';
    document.getElementById('crimeForm').reset();
}

function saveCrime() {
    const form = document.getElementById('crimeForm');
    const formData = new FormData(form);
    
    // Validar campos requeridos
    const requiredFields = ['crimeDate', 'crimeTime', 'crimeLocation', 'crimeType', 'crimeSeverity', 'arrestingOfficer', 'crimeDescription'];
    let isValid = true;
    
    requiredFields.forEach(field => {
        const element = document.getElementById(field);
        if (!element.value.trim()) {
            element.style.borderColor = '#ff4757';
            isValid = false;
        } else {
            element.style.borderColor = 'rgba(0, 255, 255, 0.3)';
        }
    });
    
    if (!isValid) {
        alert('Por favor, complete todos los campos obligatorios.');
        return;
    }
 console.log('Guardando crimen:', {
        citizenCode: document.getElementById('citizenCode').value,
        date: document.getElementById('crimeDate').value,
        time: document.getElementById('crimeTime').value,
        location: document.getElementById('crimeLocation').value,
        type: document.getElementById('crimeType').value,
        severity: document.getElementById('crimeSeverity').value,
        description: document.getElementById('crimeDescription').value,
        evidence: document.getElementById('evidence').value,
        witnesses: document.getElementById('witnesses').value
    });
    
    alert('Crimen registrado exitosamente en la base de datos galáctica.');
    closeCrimeModal();
}