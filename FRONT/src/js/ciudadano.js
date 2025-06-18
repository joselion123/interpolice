import '../scss/style.scss';
import * as bootstrap from 'bootstrap';
import Swal  from 'sweetalert2';

const url= "http://localhost:4300/ciudadano";
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

