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

    const formData = new FormData();
    
    // Agregar todos los campos del formulario
    formData.append('nombre', nombre.value);
    formData.append('apellidos', apellidos.value);
    formData.append('apodo', apodo.value);
    formData.append('fecha_nacimiento', fechanacimiento.value);
    formData.append('planeta_origen', planetaorigen.value);
    formData.append('planeta_residencia', planetaresidencia.value);
    formData.append('codigo_qr', codigoqr.value);
    formData.append('estado', estado.value);
    formData.append('rol', rol.value);
    formData.append('pass', password.value);
    
    if (foto.files[0]) {
        formData.append('foto', foto.files[0]);
    }

    try {
        const respuesta = await fetch(url, {
            method: 'POST',
            body: formData
        });

        const resultado = await respuesta.json();

        if (respuesta.ok) {
            Swal.fire('Éxito', 'Ciudadano registrado correctamente', 'success');
            document.querySelector('form').reset();
        } else {
            Swal.fire('Error', resultado.message || 'Error al registrar ciudadano', 'error');
        }

    } catch (error) {
        Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
        console.error('Error:', error);
    }
});
