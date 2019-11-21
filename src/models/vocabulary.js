import {getMyWords,getNewWords,reviewOldWords,saveRecord} from '../services/vocabulary'

export default {
    namespace: 'vocabulary',

    state: {
        myWords: []
    },

    effects: {
        *getMyWords({ payload,callback }, { call, put }) {
            let response = yield call(getMyWords, payload);
            if(response === undefined){
                return
            }

            yield put({
                type: 'GETMYWORDS',
                myWords: response
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
        *saveRecord({ payload,callback }, { call, put }) {
            let response = yield call(saveRecord, payload);
            if(response === undefined){
                return
            }

            callback(response);
        }
    },

    reducers: {
        GETMYWORDS(state, action) {
            return {
                ...state,
                myWords: action.myWords,
            };
        }
    }
};