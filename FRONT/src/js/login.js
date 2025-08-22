// API Base URL
const API_BASE = 'http://localhost:4300';

const loginForm = document.getElementById('loginForm');
const loginBtn = document.getElementById('loginBtn');
const loading = document.getElementById('loading');

document.addEventListener('DOMContentLoaded', function() {
    loginForm.addEventListener('submit', handleLogin);
});

async function handleLogin(e) {
    e.preventDefault();
    
    const codigo = document.getElementById('codigo').value.trim();
    const password = document.getElementById('password').value;
    
    if (!codigo || !password) {
        showAlert('Por favor, complete todos los campos obligatorios', 'warning');
        return;
    }
    
    setLoadingState(true);
    
    try {
        const response = await fetch(`${API_BASE}/ciudadano/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                codigo: codigo,
                pass: password
            })
        });
        
        const data = await response.json();
        
        if (response.ok && data.estado === 'ok') {
            // Store token and user data
            localStorage.setItem('token', data.token);
            localStorage.setItem('userData', JSON.stringify(data.user));
            sessionStorage.setItem('codigo', codigo);
            showAlert('¡Acceso concedido! Bienvenido al sistema', 'success');
            
            // Redirect based on user role
            setTimeout(() => {
                if (data.user.rol === 'policia') {
                    window.location.href = '../vistaPolicia.html';
                } else {
                    window.location.href = '../vistaCiudadanos.html';
                }
            }, 1500);
            
        } else {
            showAlert(data.mensaje || 'Credenciales inválidas', 'error');
        }
        
    } catch (error) {
        console.error('Login error:', error);
        showAlert('Error de conexión. Verifique su conexión a la red galáctica.', 'error');
    } finally {
        setLoadingState(false);
    }
}

// Toggle password visibility
function togglePassword() {
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

// Handle forgot password
function forgotPassword() {
    showAlert('Contacte al administrador del sistema galáctico para recuperar su acceso.', 'info');
}

// Go to register page
function goToRegister() {
    window.location.href = 'agregarCiudadanos.html';
}


// Set loading state
function setLoadingState(isLoading) {
    if (isLoading) {
        loginBtn.disabled = true;
        loginBtn.textContent = 'Autenticando...';
        loading.style.display = 'block';
    } else {
        loginBtn.disabled = false;
        loginBtn.textContent = 'Iniciar Sesión';
        loading.style.display = 'none';
    }
}

// Show alert messages
function showAlert(message, type = 'info') {
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        animation: slideIn 0.3s ease-out;
        background: rgba(0, 255, 255, 0.1);
        border: 1px solid #00ffff;
        color: #ffffff;
        border-radius: 10px;
        padding: 15px;
        backdrop-filter: blur(10px);
    `;
    
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" onclick="this.parentElement.remove()" style="color: #ffffff; opacity: 0.8;"></button>
    `;
    
    // Add to page
    document.body.appendChild(alert);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alert.parentElement) {
            alert.remove();
        }
    }, 5000);
}

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .btn-close {
        background: none;
        border: none;
        font-size: 1.2em;
        cursor: pointer;
        float: right;
        margin-left: 10px;
    }
`;
document.head.appendChild(style);

// Make functions global
window.togglePassword = togglePassword;
window.forgotPassword = forgotPassword;
window.goToRegister = goToRegister;