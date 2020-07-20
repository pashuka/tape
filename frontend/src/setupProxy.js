const { createProxyMiddleware: proxy } = require('http-proxy-middleware');
console.log('process.env.REACT_APP_APIS', process.env.REACT_APP_APIS);
const apis = JSON.parse(process.env.REACT_APP_APIS || '');

module.exports = app => {
  Object.keys(apis).forEach(version => {
    app.use(
      '/' + apis[version],
      proxy({ target: 'http://localhost:3333', changeOrigin: true }),
    );
  });
};
