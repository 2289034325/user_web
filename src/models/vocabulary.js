import {getMyBooks} from '../services/vocabulary'

export default {
    namespace: 'vocabulary',

    state: {
        myBooks: []
    },

    effects: {
        *getMyBooks({ payload,callback }, { call, put }) {
            let response = yield call(getMyBooks, payload);
            if(response === undefined){
                return
            }

            yield put({
                type: 'GETMYBOOKS',
                myBooks: response
            });
        },
    },

    reducers: {
        GETMYBOOKS(state, action) {
            return {
                ...state,
                myBooks: action.myBooks,
            };
        }
    }
};