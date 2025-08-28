let codigoGlobal = ""
document.addEventListener('DOMContentLoaded', async () => {
    let codigo = sessionStorage.getItem('codigoUsuario');
    if (!codigo) {
        window.location.href = "../../index.html";
        return;
    } else {
        codigoGlobal = codigo;
    }

    await inicializarVista();
});

window.addEventListener('beforeunload', () => {
    sessionStorage.clear();
});

let citizenData = {};

async function inicializarVista() {
    const datosCiudadano = await buscarPorCodigo();
    
    console.log("Código buscado:", codigoGlobal);
    console.log("Datos recibidos:", datosCiudadano);
    
    if (!datosCiudadano || datosCiudadano.length === 0) {
        alert(`❌ No se encontró el ciudadano con código: ${codigoGlobal}`);
        return;
    }

    let estado = datosCiudadano[0].estado;
    if (estado == 1) estado = "vivo";
    else if (estado == 0) estado = "muerto";
    else estado = "congelado";

    citizenData = {
        name: datosCiudadano[0].nombre + " " + datosCiudadano[0].apellidos,
        qr: datosCiudadano[0].codigo_qr,
        birth: datosCiudadano[0].fecha_nacimiento,
        origin: datosCiudadano[0].planeta_origen,
        residence: datosCiudadano[0].planeta_residencia,
        status: estado,
        registration: "02 de Julio, 2425",
        photo: "👤"
    };

    loadCitizenData();
    await cargarCrimenes();
}

async function buscarPorCodigo() {
    const urll = `http://localhost:4300/ciudadano/buscarporcodigo/${codigoGlobal}`;
    // Obtener token de localStorage
    const token = localStorage.getItem('tokenSesion');
    
    const response = await fetch(urll, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const datos = await response.json();
    
    if (datos.estado === "ok") {
        return datos.data; 
    } else {
        console.log("Backend response:", datos);
        return null; 
    }
}

const citizenStates = [
    { status: "vivo", text: "VIVO", class: "vivo" },
    { status: "muerto", text: "FALLECIDO", class: "muerto" },
    { status: "congelado", text: "CRIOGENIA", class: "congelado" }
];

function loadCitizenData() {
    document.getElementById('citizenName').textContent = citizenData.name;
    document.getElementById('citizenQR').textContent = citizenData.qr;
    document.getElementById('citizenBirth').textContent = citizenData.birth;
    document.getElementById('citizenOrigin').textContent = citizenData.origin;
    document.getElementById('citizenResidence').textContent = citizenData.residence;
    document.getElementById('registrationDate').textContent = citizenData.registration;
    document.getElementById('citizenPhoto').textContent = citizenData.photo;

    const statusElement = document.getElementById('citizenStatus');
    const currentState = citizenStates.find(s => s.status === citizenData.status);
    statusElement.textContent = currentState.text;
    statusElement.className = `status ${currentState.class}`;
}

async function traerCrimenesPorCodigo() {
    try {
        const url = `http://localhost:4300/crimenes/porcodigo/${codigoGlobal}`;
        // Obtener token de localStorage
        const token = localStorage.getItem('tokenSesion');
        
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const datos = await response.json();
        
        console.log("Crímenes obtenidos:", datos);
        
        if (datos.estado === "ok") {
            return datos.data;
        } else {
            console.log("No se encontraron crímenes:", datos.mensaje);
            return [];
        }
    } catch (error) {
        console.error("Error al obtener crímenes:", error);
        return [];
    }
}

async function cargarCrimenes() {
    const crimenes = await traerCrimenesPorCodigo();
    renderizarCrimenes(crimenes);
}

function renderizarCrimenes(crimenes) {
    const crimesList = document.getElementById('crimesList');
    const crimeCount = document.getElementById('crimeCount');
    
    if (!crimenes || crimenes.length === 0) {
        crimesList.innerHTML = `
            <div class="no-crimes">
                Ciudadano sin antecedentes criminales
            </div>
        `;
        crimeCount.textContent = "0 Delitos Registrados";
        return;
    }
    
    crimeCount.textContent = `${crimenes.length} Delito${crimenes.length > 1 ? 's' : ''} Registrado${crimenes.length > 1 ? 's' : ''}`;
    
    const crimenesHTML = crimenes.map(crimen => {
        const fecha = new Date(crimen.hora_crimen);
        const fechaFormateada = fecha.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const nivelGravedad = crimen.gravedad_crimen ? crimen.gravedad_crimen.toLowerCase() : 'media';
        const gravedadClass = `severity-${nivelGravedad}`;
        const gravedadText = {
            'alta': 'GRAVEDAD ALTA',
            'media': 'GRAVEDAD MEDIA', 
            'baja': 'GRAVEDAD BAJA'
        }[nivelGravedad] || 'GRAVEDAD MEDIA';
        
        const estadoCaso = crimen.estado_caso || 'ABIERTO';
        const estadoColor = {
            'ABIERTO': '#ff6b6b',
            'CERRADO': '#2ed573',
            'EN_PROCESO': '#ffa502'
        }[estadoCaso] || '#ff6b6b';
        
        return `
            <div class="crime-item">
                <div class="crime-header">
                    <div class="crime-date">🕐 ${fechaFormateada} h</div>
                    <div class="crime-severity ${gravedadClass}">${gravedadText}</div>
                </div>
                <div class="crime-location">📍 ID Crimen: ${crimen.id}</div>
                <div class="crime-planet">🪐 Planeta del crimen: ${crimen.lugar_crimen || 'No especificado'}</div>
                <div class="crime-types">
                    <span class="crime-type">Tipo crimen: ${crimen.tipos_crimen}</span>
                    ${crimen.ciudadano_codigo ? `<span class="crime-type">Código criminal: ${crimen.ciudadano_codigo}</span>` : ''}
                </div>
                <div class="crime-description">
                    "${crimen.descripcion_crimen || 'Descripción no disponible'}"
                </div>
            </div>
        `;
    }).join('');
    
    crimesList.innerHTML = crimenesHTML;
}

function cerrarSesion() {
    sessionStorage.clear();
    localStorage.removeItem('tokenSesion');
    localStorage.removeItem('datosUsuario');
    window.location.href = "../../index.html";
}

function logout() {
    cerrarSesion();
}

function printRecord() {
    window.print();
}
