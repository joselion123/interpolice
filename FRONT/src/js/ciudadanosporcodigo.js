import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal } from 'bootstrap';
import Swal  from 'sweetalert2';

let btnBuscar=document.querySelector('#btnBuscar');

btnBuscar.addEventListener('click', async(e) => {
    e.preventDefault();
    console.log("Iniciado");

    try {
        const cuerpo = document.querySelector('#resultados-container');
        cuerpo.innerHTML = ""; 
        const ciudadano = (await Buscarporcodigo(codigo))[0];
        if(ciudadano){
            let numero=document.querySelector('#total-resultados')
            numero.textContent="1"
        
            const card = document.createElement("div");
            card.classList.add("citizen-card");
            card.innerHTML = `
                <div class="citizen-header">
                <div class="citizen-photo">
                   <img id="foto" src="${ciudadano.foto || 'img/sin-foto.png'}" alt="Foto de ${ciudadano.nombre}"  width="60"/>
                </div>                  
                  <div class="citizen-name">
                        <h3>${ciudadano.nombre}</h3>
                        <div class="citizen-code">ID: ${ciudadano.codigo}</div>
                    </div>
                </div>
                <div class="citizen-details">
                    <div class="detail-row">
                        <span class="detail-label">Apellidos</span>
                        <span class="detail-value">${ciudadano.apellidos}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Apodo</span>
                        <span class="detail-value">${ciudadano.apodo}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Fecha Nacimiento</span>
                        <span class="detail-value">${ciudadano.fecha_nacimiento.split('T')[0]}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Planeta Origen</span>
                        <span class="detail-value">${ciudadano.planeta_origen}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Planeta Residencia</span>
                        <span class="detail-value">${ciudadano.planeta_residencia}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Código QR</span>
                        <span class="detail-value">
                            <div class="qr-display">${ciudadano.codigo_qr}</div>
                        </span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Estado</span>
                        <span class="detail-value">
                            <span class="estado-badge ${ciudadano.estado == 1 ? "estado-vivo" : "estado-muerto"}">
                                ${ciudadano.estado == 1 ? "Vivo" : "Muerto"}
                            </span>
                        </span>
                    </div>
                </div>
            `;

                  cuerpo.appendChild(card);
        }else{
        
        }
      
     
    } catch (err) {
        console.log("Error al llenar la carta:", err.message);
    }
});


async function Buscarporcodigo() {
    let codigo=document.querySelector('#codigo').value
  const urll = `http://localhost:4300/ciudadano/buscarporcodigo/${codigo}`;
  const response = await fetch(urll);
  const datos = await response.json();
  return datos.resultado;
}