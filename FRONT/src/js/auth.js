export function obtenerTokenAuth() {
    return localStorage.getItem('tokenSesion');
}

export function obtenerDatosUsuario() {
    const datosUsuario = localStorage.getItem('datosUsuario');
    return datosUsuario ? JSON.parse(datosUsuario) : null;
}

export function estaAutenticado() {
    return !!obtenerTokenAuth();
}

export function cerrarSesion() {
    localStorage.removeItem('tokenSesion');
    localStorage.removeItem('datosUsuario');
    sessionStorage.clear();
    window.location.href = '../index.html';
}

export function verificarAuth() {
    if (!estaAutenticado()) {
        window.location.href = '../index.html';
        return false;
    }
    return true;
}

export function obtenerCabecerasAuth() {
    const token = obtenerTokenAuth();
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

document.addEventListener('DOMContentLoaded', () => {
    if (!window.location.pathname.includes('index.html') && 
        !window.location.pathname.includes('agregarCiudadanos.html')) {
        verificarAuth();
    }
});

export const getAuthToken = obtenerTokenAuth;
export const getUserData = obtenerDatosUsuario;
export const isAuthenticated = estaAutenticado;
export const logout = cerrarSesion;
export const checkAuth = verificarAuth;
export const getAuthHeaders = obtenerCabecerasAuth;