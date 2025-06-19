import * as bootstrap from 'bootstrap';
import Swal  from 'sweetalert2';

const url= "http://localhost:4300/ciudadano/buscarporqr";
const codigoqr= document.querySelector('#codigo_qr');

document.querySelector('#btnEliminar').addEventListener('click', async (e) => {
    e.preventDefault(); 

    let base64 = "";

    const archivo = foto.files[0];
    if (archivo) {
        base64 = await convertirBase64(archivo);
    }

    const nuevoCiudadano = {
        codigo: codigo.value,
        nombre: nombre.value,
        apellidos: apellidos.value,
        apodo: apodo.value,
        fecha_nacimiento: fechanacimiento.value,
        planeta_origen: planetaorigen.value,
        planeta_residencia: planetaresidencia.value,
        foto: base64,
        codigo_qr: codigoqr.value,
        estado: estado.value
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
