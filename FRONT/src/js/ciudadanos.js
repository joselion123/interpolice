import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal } from 'bootstrap';
import Swal  from 'sweetalert2';

const url = "http://localhost:4300/ciudadano/";
document.addEventListener('DOMContentLoaded', cargarDatos); 
async function cargarCiudadanos(ciudadanos) {
    console.log("Iniciado");

    try {
        const cuerpoTabla = document.querySelector('#tablaCiudadanos');
        cuerpoTabla.innerHTML = ""; 
       
        ciudadanos.forEach(ciudadano => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${ciudadano.codigo}</td>
                <td>${ciudadano.nombre}</td>
                <td>${ciudadano.apellidos}</td>
                <td>${ciudadano.apodo}</td>
                <td>${ciudadano.fecha_nacimiento.split('T')[0]}</td>
                <td>${ciudadano.planeta_origen}</td>
                <td>${ciudadano.planeta_residencia}</td>
                <td><img src="${ciudadano.foto}" width="60"  /></td>
                <td>${ciudadano.codigo_qr}</td>
                <td>${ciudadano.estado}</td>
                <td>${ciudadano.rol}</td>

                <td> <button type="button" class="btn btn-primary btnEditar" data-codigo="${ciudadano.codigo}">Editar</button> <br> <button type="button" class="btn btn-danger btnEliminar" data-codigo="${ciudadano.codigo}">Eliminar</button>

                </td>

            `;

            cuerpoTabla.appendChild(fila);
        });

    } catch (err) {
        console.log("Error al llenar la tabla:", err.message);
    }
}

function cargarDatos() {
    fetch(url+'listartodos')
        .then(response => response.json())
        .then((datos) => {
            cargarCiudadanos(datos.resultado);
                  console.log("Respuesta del backend:", datos); 

        })
        .catch(err => console.log("Error en fetch:", err.message));
}

async function Buscarporcodigo(codigo) {
  const urll = `http://localhost:4300/ciudadano/buscarporcodigo/${codigo}`;
  const response = await fetch(urll);
  const datos = await response.json();
  return datos.resultado;
}

document.addEventListener('click', async (e) => {
  if (e.target && e.target.classList.contains('btnEliminar')) {
    const codigo = e.target.dataset.codigo;

    Swal.fire({
      title: '¿Estás seguro?',
      text: `Vas a eliminar al ciudadano con código ${codigo}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (respuesta) => {
      if (respuesta.isConfirmed) {
        try {
          const url = `http://localhost:4300/ciudadano/eliminarporcodigo/${codigo}`;
          const resp = await fetch(url, { method: 'DELETE' });
          
          if (resp.ok) {
            Swal.fire('Éxito', 'Eliminado', 'success');
            cargarDatos();
          } else {
            Swal.fire('Error', 'No se pudo eliminar', 'error');
          }
        } catch (err) {
          console.error(err);
        }
      }
    });
  }

  if (e.target && e.target.classList.contains('btnEditar')) {
    const codigo = e.target.dataset.codigo;
    const modalEdicion = new Modal(document.querySelector('#modalEdicion'));

    const ciudadano = (await Buscarporcodigo(codigo))[0];

    if (ciudadano) {
      modalEdicion.show();
      console.log(ciudadano)
      document.querySelector('#codigo').value = ciudadano.codigo;
      document.querySelector('#nombre').value = ciudadano.nombre;
      document.querySelector('#apellidos').value = ciudadano.apellidos;
      document.querySelector('#apodo').value = ciudadano.apodo;
      document.querySelector('#fecha_nacimiento').value = ciudadano.fecha_nacimiento.split('T')[0];
      document.querySelector('#planeta_origen').value = ciudadano.planeta_origen;
      document.querySelector('#planeta_residencia').value = ciudadano.planeta_residencia;
      document.querySelector('#codigo_qr').value = ciudadano.codigo_qr;
      document.querySelector('#estado').value =String(ciudadano.estado);

    } else {
      Swal.fire('Error', 'No se encontraron datos para este ciudadano', 'error');
    }
    const formEdicion=document.querySelector('#modalEdicion')
 formEdicion.addEventListener('submit', async (e) => {
    e.preventDefault();
    const codigo = document.querySelector('#codigo').value;

    const datosCiudadano = {
        nombre: document.querySelector('#nombre').value,
        apellidos: document.querySelector('#apellidos').value,
        apodo: document.querySelector('#apodo').value,
        fecha_nacimiento: document.querySelector('#fecha_nacimiento').value,
        planeta_origen: document.querySelector('#planeta_origen').value,
        planeta_residencia: document.querySelector('#planeta_residencia').value,
        estado: document.querySelector('#estado').value
    };
  
    try {
        const respuesta = await fetch(url + 'editar/' + codigo, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosCiudadano)
        });
        const resultado = await respuesta.json();
        if (respuesta.ok) {
            Swal.fire('Éxito', 'Ciudadano editado correctamente', 'success');
            cargarDatos();
            const instanciaModal = Modal.getInstance(document.querySelector('#modalEdicion'));
            instanciaModal.hide();
        } else {
            Swal.fire('Error', resultado.message || 'Error al editar ciudadano', 'error');
        }
    } catch (error) {
        Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
        console.error(error);
    }
});

  }})