import {request} from '../utils/request';

export async function getMyWords() {
    return request('/api/dictionary/word/stat', 'GET');
}

export async function getNewWords(params) {
    return request(`/api/dictionary/word/learn_new/${params.lang}/${params.count}`, 'GET');
}

export async function reviewOldWords(params) {
    return request(`/api/dictionary/word/review_old/${params.lang}/${params.count}`, 'GET');
}

export async function saveRecord(params) {
    return request(`/api/dictionary/learn/record/save`, 'POST', params);
}