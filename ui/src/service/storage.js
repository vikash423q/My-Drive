import { stringify } from 'query-string';
import config from '../config';

export const uploadService = (data) => {
    const formData = new URLSearchParams(new FormData(data));
    return fetch(config.baseUrl + 'upload_file', { method: 'POST', body: formData, credentials: 'include' }).then(res => res.json());
}

export const generateUploadLinkService = (data) => {
    return fetch(config.baseUrl + 'upload_link', { method: 'POST', body: JSON.stringify(data), credentials: 'include', json: true }).then(res => res.json());
}

export const createFolderService = (data) => {
    return fetch(config.baseUrl + 'folder', { method: 'POST', body: JSON.stringify(data), credentials: 'include' }).then(res => res.json());
}

export const getSizeService = (data) => {
    return fetch(config.baseUrl + `size?${stringify(data)}`, { credentials: 'include' }).then(res => res.json());
}

export const syncFileService = (data) => {
    return fetch(config.baseUrl + 'file_sync', { method: 'PUT', body: JSON.stringify(data), credentials: 'include', json: true }).then(res => res.json());
}

export const listFolderService = (data) => {
    // return request({ url: config.baseUrl + `list?${stringify(data)}`, headers: { auth}})
    return fetch(config.baseUrl + `list?${stringify(data)}`, { credentials: 'include' }).then(res => { console.log(res.headers); return res.json() });
}

export const listBinService = () => {
    return fetch(config.baseUrl + 'bin', { credentials: 'include' }).then(res => res.json());
}

export const listStarredService = () => {
    return fetch(config.baseUrl + 'starred', { credentials: 'include' }).then(res => res.json());
}

export const listSharedService = () => {
    return fetch(config.baseUrl + 'listshared', { credentials: 'include' }).then(res => res.json());
}

export const listRecentService = () => {
    return fetch(config.baseUrl + 'recent', { credentials: 'include' }).then(res => res.json());
}

export const starFileService = (data) => {
    return fetch(config.baseUrl + `star?${stringify(data)}`, { method: 'PUT', credentials: 'include' }).then(res => res.json());
}

export const deleteService = (data) => {
    return fetch(config.baseUrl + `delete?${stringify(data)}`, { method: 'DELETE', credentials: 'include', json: true }).then(res => res.json());
}

export const deleteForeverService = (data) => {
    return fetch(config.baseUrl + `delete_forever?${stringify(data)}`, { method: 'DELETE', credentials: 'include', json: true }).then(res => res.json());
}

export const restoreService = (data) => {
    return fetch(config.baseUrl + `restore?${stringify(data)}`, { method: 'PUT', credentials: 'include' }).then(res => res.json());
}

export const downloadFileService = (data) => {
    return fetch(config.baseUrl + `download_link?${stringify(data)}`, { credentials: 'include' }).then(res => res.json());
}

export const searchItemsService = (data) => {
    return fetch(config.baseUrl + `search?${stringify(data)}`, { credentials: 'include' }).then(res => res.json());
}

export const shareService = (data) => {
    return fetch(config.baseUrl + 'share/new', { method: 'POST', body: JSON.stringify(data), credentials: 'include' }).then(res => res.json());
}

export const toggleSharingService = (data) => {
    return fetch(config.baseUrl + 'share/toggle', { method: 'PUT', body: JSON.stringify(data), credentials: 'include' }).then(res => res.json());
}

export const downloadSharedService = (data) => {
    return fetch(config.baseUrl + `share/download?${stringify(data)}`, { credentials: 'include' }).then(res => res.json());
}

export const listSharedFolderService = (data) => {
    return fetch(config.baseUrl + `share/list_folder?${stringify(data)}`, { credentials: 'include' }).then(res => res.json());
}
