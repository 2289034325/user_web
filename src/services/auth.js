import {request} from '../utils/request';

export async function login(params) {
    return request(`/api/auth/login/${params.ticket}/${params.vcode}`, 'POST',params);
}

export async function kaptcha() {
    return request('/api/kaptcha/', 'GET');
}