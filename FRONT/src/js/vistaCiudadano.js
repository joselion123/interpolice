document.addEventListener('DOMContentLoaded', async () => {
    let codigo = sessionStorage.getItem('codigo');
    if (!codigo) {
        window.location.href = "../../index.html";
        return;
    }

    await inicializarVista();
});

window.addEventListener('beforeunload', () => {
    sessionStorage.clear();
});

let citizenData = {};

async function inicializarVista() {
    const datosCiudadano = await Buscarporcodigo();
    if (!datosCiudadano || datosCiudadano.length === 0) {
        alert("❌ No se encontró el ciudadano");
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
}

async function Buscarporcodigo() {
    let codigo = sessionStorage.getItem('codigo');
    const urll = `http://localhost:4300/ciudadano/buscarporcodigo/${codigo}`;
    const response = await fetch(urll);
    const datos = await response.json();
    return datos.resultado;
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
