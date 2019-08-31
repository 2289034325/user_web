import {request} from '../utils/request';

export async function getMyBooks() {
    return request('/api/dictionary/book/mybooks', 'GET');
}