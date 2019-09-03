import axios from "axios";
import qs from "qs";
import { getToken } from './authority';
import { message } from 'antd';

export function request(url, method, data, contentType) {
    let config = {
        url: url,
        method: method.toUpperCase(),
        withCredentials: true,
        credentials: "include"
    };

    if (contentType == "file") {
        config.data = data;
    } else {
        config.headers = {
            "Content-Type": contentType || "application/json",
            "X-Requested-With": "XMLHttpRequest"
        };
        if(!url.startsWith('/api/auth/') && !url.startsWith('/api/kaptcha/')) {
            config.headers.Authorization = `Bearer ${getToken()}`;
        }
        if (data) {
            if (method && method.toUpperCase() == "GET") {
                config.params = qs.stringify(data);
            } else {
                config.data = data;
            }
        }
    }

    return axios(config)
        .then(res => {
            // 只有200才认定为是正常返回
            if (res.status === 200) {
                return res.data;
            }

            // 系统错误和业务错误都不再返回response到业务层，只是报出message
            const msg_content = res.headers["msg-content"];
            if (msg_content) {
                message.error(decodeURI(msg_content));
            } else {
                message.error('发生错误，请重新尝试')
            }

        })
        .catch(err => {
            message.error('发生错误，请重新尝试')
            console.log(err);
        });
}