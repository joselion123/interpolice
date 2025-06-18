const url = "http://localhost:4300/ciudadano/listarTodos";

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
            `;

            cuerpoTabla.appendChild(fila);
        });

    } catch (err) {
        console.log("Error al llenar la tabla:", err.message);
    }
}

function cargarDatos() {
    fetch(url)
        .then(response => response.json())
        .then((datos) => {
            cargarCiudadanos(datos.resultado);
                  console.log("Respuesta del backend:", datos); 

        })
        .catch(err => console.log("Error en fetch:", err.message));
}
