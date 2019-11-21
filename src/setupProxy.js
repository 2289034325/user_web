const proxy = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        proxy('/api/auth', {
            target: 'http://127.0.0.1:9000/',
            changeOrigin: true,
            pathRewrite: {
                '^/api/auth': 'auth'
            }
        })
    );
    app.use(
        proxy('/api/kaptcha', {
            target: 'http://127.0.0.1:9000/',
            changeOrigin: true,
            pathRewrite: {
                '^/api/kaptcha': 'kaptcha'
            }
        })
    );
    app.use(
        proxy('/api', {
            target: 'http://127.0.0.1:9000/app/',
            changeOrigin: true,
            pathRewrite: {
                '^/api': ''
            }
        })
    );
}