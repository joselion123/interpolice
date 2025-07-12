 function togglePassword()
  {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.toggle-password');
            
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.textContent = '🙈';
        } else {
            passwordInput.type = 'password';
            toggleBtn.textContent = '👁️';
    }
}

 document.getElementById('loginForm').addEventListener('submit',async function(e) {
            e.preventDefault();
            
            const loginBtn = document.getElementById('loginBtn');
            const loading = document.getElementById('loading');
            const username = document.getElementById('codigo').value;
            const password = document.getElementById('password').value;
            
            if (!username || !password) {
                alert('⚠️ Por favor, complete todos los campos obligatorios');
                return;
            }
            
            loginBtn.disabled = true;
            loginBtn.textContent = 'Verificando...';
            loading.style.display = 'block';
            
            setTimeout(async() => {                                
                loginBtn.disabled = false;
                loginBtn.textContent = 'Iniciar Sesión';
                loading.style.display = 'none';
                let datos= await buscarlogin()
                console.log(datos)
                let rol = datos[0].rol
                console.log(rol)
                if (rol==="ciudadano"){
                    window.location.href="../../vistaCiudadanos.html"
                    sessionStorage.setItem('codigo',datos[0].codigo)

                }else if (rol==="policia"){
                    console.log("abriendo vista policia")
                    window.location.href="../../vistaPolicia.html"
                    sessionStorage.setItem('codigo',datos[0].codigo)
                }
            }, 2000);
        });

async function buscarlogin() {
let codigo=document.querySelector('#codigo').value
let pass=document.querySelector('#password').value;
console.log(codigo,pass)
  const urll = `http://localhost:4300/ciudadano/login/${codigo}/${pass}`;
  const response = await fetch(urll);
  const datos = await response.json();
  return datos.resultado;
}