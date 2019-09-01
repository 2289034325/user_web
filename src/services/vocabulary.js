import {request} from '../utils/request';

export async function getMyBooks() {
    return request('/api/dictionary/book/mybooks', 'GET');
}

export async function getNewWords(params) {
    return request(`/api/dictionary/book/${params.userBookId}/learn_new/${params.count}`, 'GET');
}

export async function reviewOldWords(params) {
    return request(`/api/dictionary/book/${params.userBookId}/review_old/${params.count}`, 'GET');
}