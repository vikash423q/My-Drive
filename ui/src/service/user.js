import { stringify } from 'query-string';
import config from '../config';

export const loginService = (data) => {
    return fetch(config.baseUrl + 'user/login', { method: 'POST', body: JSON.stringify(data) }).then(res => { console.log(res.headers); return res.json() });
}

export const signUpService = (data) => {
    return fetch(config.baseUrl + 'user/signup', { method: 'POST', body: JSON.stringify(data) }).then(res => res.json());
}

export const userProfileService = () => {
    return fetch(config.baseUrl + 'user/profile', { credentials: 'include' }).then(res => res.json());
}

export const deleteUserService = (data) => {
    return fetch(config.baseUrl + 'user/delete', { method: 'DELETE', credentials: 'include' }).then(res => res.json());
}

export const changePasswordService = (data) => {
    return fetch(config.baseUrl + 'user/change_password', { method: 'PUT', credentials: 'include', body: JSON.stringify(data) }).then(res => res.json());
}

export const updateProfileService = (data) => {
    return fetch(config.baseUrl + 'user/update_profile', { method: 'PUT', credentials: 'include', body: JSON.stringify(data) }).then(res => res.json());
}

export const checkUserService = (data) => {
    return fetch(config.baseUrl + `user/check?${stringify(data)}`, { credentials: 'include' }).then(res => res.json());
}

export const getStorageService = () => {
    return fetch(config.baseUrl + `user/storage`, { credentials: 'include' }).then(res => res.json());
}

export const updateStorageService = (data) => {
    return fetch(config.baseUrl + `user/update_storage?${stringify(data)}`, { method: 'PUT', credentials: 'include' }).then(res => res.json());
}

