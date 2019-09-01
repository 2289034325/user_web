import {getMyBooks,getNewWords,reviewOldWords} from '../services/vocabulary'

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
        *getNewWords({ payload,callback }, { call, put }) {
            let response = yield call(getNewWords, payload);
            if(response === undefined){
                return
            }

            // 可以用yield put，将结果connect到component
            // 也可以直接调用callback通知component!!!
            callback(response);
        },
        *reviewOldWords({ payload,callback }, { call, put }) {
            let response = yield call(reviewOldWords, payload);
            if(response === undefined){
                return
            }

            // 可以用yield put，将结果connect到component
            // 也可以直接调用callback通知component!!!
            callback(response);
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