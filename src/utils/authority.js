import * as jwt_decode from 'jwt-decode';

export function getUerInfo() {
    const token = localStorage.getItem('token');
    if(!token || token === 'undefined'){
        return null;
    }
    const user = jwt_decode(token);
    return user;
}
export function getToken() {
    return localStorage.getItem('token')||'';
}

export function saveToken(token) {
    localStorage.setItem('token',token);
}
