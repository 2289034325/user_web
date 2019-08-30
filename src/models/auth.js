import {login,kaptcha} from '../services/auth'

export default {
    namespace: 'auth',

    state: {
        token: '',
        kaptcha: null
    },

    effects: {
        *kaptcha({ payload,callback }, { call, put }) {
            let response = yield call(kaptcha, payload);
            if(response === undefined){
                return
            }

            yield put({
                type: 'KAPTCHA',
                kaptcha: response
            });
        },

        *login({ payload,callback }, { call, put }) {
            let response = yield call(login, payload);
            if(response === undefined){
                // 调用另一个 effect!!!
                // 登录失败，刷新验证码
                yield put({type:"kaptcha"});
            }
            else {
                yield put({
                    type: 'LOGIN',
                    token: response
                });
            }
        },
    },

    reducers: {
        LOGIN(state, action) {
            return {
                ...state,
                token: action.token,
            };
        },
        KAPTCHA(state, action) {
            return {
                ...state,
                kaptcha: action.kaptcha,
            };
        },
    },
};