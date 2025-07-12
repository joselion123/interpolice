import * as bootstrap from 'bootstrap';
import Swal  from 'sweetalert2';


const url= "http://localhost:4300/ciudadano/insertar";
const codigo= document.querySelector('#codigo');
const nombre= document.querySelector('#nombre');
const apellidos= document.querySelector('#apellidos');
const apodo =document.querySelector('#apodo');
const fechanacimiento= document.querySelector('#fecha_nacimiento');
const planetaorigen = document.querySelector('#planeta_origen');
const planetaresidencia=document.querySelector('#planeta_residencia');
const foto= document.querySelector('#foto');
const codigoqr= document.querySelector('#codigo_qr');
const estado=document.querySelector('#estado');
const rol=document.querySelector('#rol');
const password=document.querySelector('#password');


document.querySelector('#btnGuardar').addEventListener('click', async (e) => {
    e.preventDefault(); 

    let base64 = "";

    const archivo = foto.files[0];
    if (archivo) {
        base64 = await convertirBase64(archivo);
    }

    const nuevoCiudadano = {
        nombre: nombre.value,
        apellidos: apellidos.value,
        apodo: apodo.value,
        fecha_nacimiento: fechanacimiento.value,
        planeta_origen: planetaorigen.value,
        planeta_residencia: planetaresidencia.value,
        foto: base64,
        codigo_qr: codigoqr.value,
        estado: estado.value,
        rol: rol.value,
        pass:password.value
    };
    console.log(nuevoCiudadano)
    try {
        const respuesta = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoCiudadano)
        });

        const resultado = await respuesta.json();

        if (respuesta.ok) {
            Swal.fire('Éxito', 'Ciudadano registrado correctamente', 'success');
        } else {
            Swal.fire('Error', resultado.message || 'Error al registrar ciudadano', 'error');
        }

    } catch (error) {
        Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
        console.error(error);
    }
});

function convertirBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
